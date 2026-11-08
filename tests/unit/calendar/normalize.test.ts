import { describe, expect, it } from 'vitest'
import { normalizeGoogleEvent } from '../../../lib/calendar/normalize'

const futureStart = '2027-06-01T19:00:00-05:00'
const futureEnd = '2027-06-01T21:00:00-05:00'

describe('calendar event normalization', () => {
  it('parses metadata, removes metadata lines, decodes text, and validates links', () => {
    const event = normalizeGoogleEvent(
      {
        id: 'source-event-1',
        summary: '<b>Daniel &amp; Friends</b>',
        location: 'The <i>Paper</i> Room',
        description: [
          '<p>Event status: rescheduled</p>',
          'Ticket status: sold-out<br>',
          'Tickets: https://tickets.example-venue.co/show?ref=calendar',
          'Waitlist: https://tickets.example-venue.co/show/waitlist',
          'Ticket provider: Example Tickets',
          'Category: comedy',
          '<p>Bring a friend &amp; enjoy the night.</p>',
        ].join('\n'),
        start: { dateTime: futureStart, timeZone: 'America/Chicago' },
        end: { dateTime: futureEnd },
      },
      { now: Date.parse('2027-01-01T00:00:00Z'), calendarTimeZone: 'America/Chicago' },
    )

    expect(event).toMatchObject({
      title: 'Daniel & Friends',
      description: 'Bring a friend & enjoy the night.',
      location: 'The Paper Room',
      eventStatus: 'rescheduled',
      ticketStatus: 'sold-out',
      ticketUrl: 'https://tickets.example-venue.co/show?ref=calendar',
      waitlistUrl: 'https://tickets.example-venue.co/show/waitlist',
      ticketProvider: 'Example Tickets',
      category: 'comedy',
      timeZone: 'America/Chicago',
      allDay: false,
    })
    expect(event?.id).not.toBe('source-event-1')
    expect(event?.id).toMatch(/^[a-f0-9]{24}$/)
    expect(event?.description).not.toContain('<p>')
  })

  it('keeps all-day dates date-only and uses the calendar timezone fallback', () => {
    const event = normalizeGoogleEvent(
      {
        id: 'all-day-event',
        summary: 'Conference appearance',
        start: { date: '2027-06-01' },
        end: { date: '2027-06-03' },
      },
      { now: Date.parse('2027-01-01T00:00:00Z'), calendarTimeZone: 'America/New_York' },
    )

    expect(event).toMatchObject({
      start: '2027-06-01',
      end: '2027-06-03',
      allDay: true,
      timeZone: 'America/New_York',
    })

    expect(
      normalizeGoogleEvent(
        {
          id: 'invalid-date',
          summary: 'Invalid date',
          start: { date: '2027-02-30' },
          end: { date: '2027-03-02' },
        },
        { now: Date.parse('2027-01-01T00:00:00Z') },
      ),
    ).toBeNull()

    const offsetless = normalizeGoogleEvent(
      {
        id: 'offsetless-event',
        summary: 'Timezone-aware event',
        start: { dateTime: '2027-06-01T19:00:00', timeZone: 'America/Chicago' },
        end: { dateTime: '2027-06-01T20:00:00', timeZone: 'America/Chicago' },
      },
      { now: Date.parse('2027-01-01T00:00:00Z') },
    )
    expect(offsetless?.start).toBe('2027-06-02T00:00:00.000Z')
  })

  it('skips unsafe, malformed, private, tentative, non-default, and unknown-status events', () => {
    const base = {
      id: 'event',
      summary: 'Show',
      start: { dateTime: futureStart },
      end: { dateTime: futureEnd },
    }
    expect(normalizeGoogleEvent({ ...base, description: 'Event status: maybe' }, { now: 0 })).toBeNull()
    expect(normalizeGoogleEvent({ ...base, visibility: 'private' }, { now: 0 })).toBeNull()
    expect(normalizeGoogleEvent({ ...base, visibility: 'confidential' }, { now: 0 })).toBeNull()
    expect(normalizeGoogleEvent({ ...base, status: 'tentative' }, { now: 0 })).toBeNull()
    expect(normalizeGoogleEvent({ ...base, status: 'mystery' }, { now: 0 })).toBeNull()
    expect(normalizeGoogleEvent({ ...base, eventType: 'focusTime' }, { now: 0 })).toBeNull()
    expect(
      normalizeGoogleEvent(
        { ...base, id: 'deleted', status: 'cancelled', description: 'Event status: cancelled' },
        { now: 0 },
      ),
    ).toBeNull()

    const unsafe = normalizeGoogleEvent(
      {
        ...base,
        description: 'Tickets: http://localhost/show\nTicket status: on-sale',
      },
      { now: 0 },
    )
    expect(unsafe?.ticketUrl).toBeNull()
    expect(unsafe?.ticketStatus).toBe('on-sale')

    const placeholderHost = normalizeGoogleEvent(
      { ...base, description: 'Tickets: https://sales.example.com/show' },
      { now: 0 },
    )
    expect(placeholderHost?.ticketUrl).toBeNull()
  })

  it('retains an explicit cancellation notice but suppresses purchase actions', () => {
    const event = normalizeGoogleEvent(
      {
        id: 'cancelled-notice',
        status: 'confirmed',
        summary: 'Tonight’s show is cancelled',
        description: [
          'Event status: cancelled',
          'Ticket status: on-sale',
          'Tickets: https://tickets.example-venue.co/show',
        ].join('\n'),
        start: { dateTime: futureStart },
        end: { dateTime: futureEnd },
      },
      { now: 0 },
    )
    expect(event).toMatchObject({ eventStatus: 'cancelled', ticketUrl: null, waitlistUrl: null })
  })

  it('adds structured venue details only when the required facts are present', () => {
    const source = {
      id: 'venue-source-event',
      summary: 'Theatre show',
      location: 'Paper Room, Chicago',
      description: [
        'Venue name: The Paper Room',
        'Street address: 100 Main Street',
        'City: Chicago',
        'Region: IL',
        'Postal code: 60601',
        'Country: US',
        'An evening of conversation.',
      ].join('\n'),
      start: { dateTime: futureStart },
      end: { dateTime: futureEnd },
    }
    const event = normalizeGoogleEvent(source, { now: 0 })
    expect(event).toMatchObject({
      venue: {
        name: 'The Paper Room',
        streetAddress: '100 Main Street',
        addressLocality: 'Chicago',
        addressRegion: 'IL',
        postalCode: '60601',
        addressCountry: 'US',
      },
      description: 'An evening of conversation.',
    })
    expect(event?.description).not.toContain('Street address:')

    const incomplete = normalizeGoogleEvent({
      ...source,
      id: 'incomplete-venue',
      description: 'Venue name: The Paper Room\nStreet address: 100 Main Street\nDoors at 7 PM.',
    }, { now: 0 })
    expect(incomplete).not.toHaveProperty('venue')
    expect(incomplete?.description).toBe('Doors at 7 PM.')
  })

  it('preserves legacy normalized output when structured venue fields are absent', () => {
    const event = normalizeGoogleEvent({
      id: 'legacy-event',
      summary: 'A show',
      location: 'A known venue',
      description: 'An existing description.',
      start: { dateTime: futureStart },
      end: { dateTime: futureEnd },
    }, { now: 0 })
    expect(event).toEqual({
      id: expect.stringMatching(/^[a-f0-9]{24}$/),
      title: 'A show',
      description: 'An existing description.',
      location: 'A known venue',
      start: '2027-06-02T00:00:00.000Z',
      end: '2027-06-02T02:00:00.000Z',
      allDay: false,
      timeZone: 'UTC',
      eventStatus: 'scheduled',
      ticketStatus: 'unknown',
      ticketUrl: null,
      waitlistUrl: null,
      ticketProvider: null,
      category: 'appearance',
    })
    expect(event).not.toHaveProperty('venue')
  })

  it('keeps normalized instance URLs opaque and stable when a recurring event is edited', () => {
    const source = {
      id: 'private-google-instance-id',
      recurringEventId: 'private-google-series-id',
      originalStartTime: { dateTime: futureStart, timeZone: 'America/Chicago' },
      summary: 'Recurring show',
      start: { dateTime: futureStart },
      end: { dateTime: futureEnd },
    }
    const original = normalizeGoogleEvent(source, { now: 0 })
    const edited = normalizeGoogleEvent({
      ...source,
      start: { dateTime: '2027-06-02T19:00:00-05:00' },
      end: { dateTime: '2027-06-02T21:00:00-05:00' },
    }, { now: 0 })
    expect(original?.id).toMatch(/^[a-f0-9]{24}$/)
    expect(edited?.id).toBe(original?.id)
    expect(original?.id).not.toContain('private-google-instance-id')
    expect(original?.id).not.toContain('private-google-series-id')
  })
})
