import { describe, expect, it } from 'vitest'
import { createAppearanceEventMetadata, getEventSitemapEntries, getAppearanceEventJsonLd, serializeAppearanceEventJsonLd } from '../../../lib/seo/events'
import { createAppMetadata } from '../../../lib/seo/app-metadata'
import type { AppearanceEvent, AppearanceFeed } from '../../../lib/calendar/types'

const eligibleEvent: AppearanceEvent = {
  id: '0123456789abcdef01234567',
  title: 'Chicago Comedy Night',
  description: 'An evening with Daniel.',
  location: 'The Paper Room, Chicago',
  start: '2027-06-01T19:00:00.000Z',
  end: '2027-06-01T21:00:00.000Z',
  allDay: false,
  timeZone: 'America/Chicago',
  eventStatus: 'scheduled',
  ticketStatus: 'on-sale',
  ticketUrl: 'https://tickets.example.invalid/show',
  waitlistUrl: null,
  ticketProvider: null,
  category: 'comedy',
  venue: {
    name: 'The Paper Room',
    streetAddress: '100 Main Street',
    addressLocality: 'Chicago',
    addressRegion: 'IL',
    postalCode: '60601',
    addressCountry: 'US',
  },
}

const feed = (events: AppearanceEvent[], status: AppearanceFeed['status'] = 'ready'): AppearanceFeed => ({
  status,
  events,
  fetchedAt: '2026-10-31T12:00:00.000Z',
  refreshAfterSeconds: 60,
})

describe('event-page SEO contracts', () => {
  it('emits only source-supported Event fields and escaped JSON-LD', () => {
    const schema = getAppearanceEventJsonLd('https://danfran.example', eligibleEvent)
    expect(schema).toMatchObject({
      '@type': 'Event',
      url: 'https://danfran.example/calendar/0123456789abcdef01234567',
      name: 'Chicago Comedy Night',
      eventStatus: 'https://schema.org/EventScheduled',
      startDate: '2027-06-01T19:00:00.000Z',
      location: {
        '@type': 'Place',
        name: 'The Paper Room',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '100 Main Street',
          addressLocality: 'Chicago',
          addressCountry: 'US',
        },
      },
    })
    expect(schema).not.toHaveProperty('offers')
    const escaped = serializeAppearanceEventJsonLd({ ...schema!, name: '</script><script>' })
    expect(escaped).not.toContain('</script><script>')
    expect(escaped).toContain('\\u003c/script\\u003e')
  })

  it('requires structured venue facts and a safe event URL for eligibility', () => {
    const { venue: _venue, ...missingVenue } = eligibleEvent
    expect(getAppearanceEventJsonLd('https://danfran.example', missingVenue)).toBeNull()
    expect(getAppearanceEventJsonLd('https://danfran.example', { ...eligibleEvent, venue: { ...eligibleEvent.venue!, streetAddress: '' } })).toBeNull()
    expect(getAppearanceEventJsonLd('https://danfran.example', { ...eligibleEvent, id: 'raw-google-id' })).toBeNull()
    expect(getAppearanceEventJsonLd('https://danfran.example', { ...eligibleEvent, start: 'not-a-date' })).toBeNull()
    expect(getAppearanceEventJsonLd('https://danfran.example/path', eligibleEvent)).toBeNull()
    expect(getAppearanceEventJsonLd('javascript:alert(1)', eligibleEvent)).toBeNull()
    expect(getAppearanceEventJsonLd('https://danfran.example', { ...eligibleEvent, eventStatus: 'cancelled', ticketUrl: null })).toMatchObject({ eventStatus: 'https://schema.org/EventCancelled' })
    expect(getAppearanceEventJsonLd('https://danfran.example', { ...eligibleEvent, eventStatus: 'postponed', ticketUrl: null })).toMatchObject({ eventStatus: 'https://schema.org/EventPostponed' })
    expect(getAppearanceEventJsonLd('https://danfran.example', { ...eligibleEvent, eventStatus: 'rescheduled' })).not.toHaveProperty('previousStartDate')
  })

  it('converts all-day exclusive end dates to the included final date', () => {
    const day = getAppearanceEventJsonLd('https://danfran.example', {
      ...eligibleEvent,
      start: '2027-01-31',
      end: '2027-02-01',
      allDay: true,
    })
    expect(day).toMatchObject({ startDate: '2027-01-31', endDate: '2027-01-31' })

    const range = getAppearanceEventJsonLd('https://danfran.example', {
      ...eligibleEvent,
      start: '2027-12-30',
      end: '2028-01-03',
      allDay: true,
    })
    expect(range).toMatchObject({ startDate: '2027-12-30', endDate: '2028-01-02' })
    expect(getAppearanceEventJsonLd('https://danfran.example', {
      ...eligibleEvent,
      start: '2027-02-30',
      end: '2027-03-01',
      allDay: true,
    })).toBeNull()
  })

  it('lists ready-feed event pages, including schema-ineligible events, only on a public origin', () => {
    const { venue: _venue, ...noVenue } = eligibleEvent
    expect(getEventSitemapEntries('https://danfran.example', feed([eligibleEvent, { ...noVenue, id: '1123456789abcdef01234567' }, { ...eligibleEvent, id: 'invalid' }]))).toEqual([
      { loc: 'https://danfran.example/calendar/0123456789abcdef01234567' },
      { loc: 'https://danfran.example/calendar/1123456789abcdef01234567' },
    ])
    expect(getEventSitemapEntries('http://localhost:3000', feed([eligibleEvent]))).toEqual([])
    expect(getEventSitemapEntries('https://danfran.example', feed([eligibleEvent], 'unavailable'))).toEqual([])
  })

  it('preserves production and preview metadata policy in the App Router adapter', () => {
    const originalEnvironment = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV
    const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
    process.env.NEXT_PUBLIC_DEPLOYMENT_ENV = 'production'
    process.env.NEXT_PUBLIC_SITE_URL = 'https://danfran.example'
    try {
      const production = createAppMetadata({ routeId: 'calendar', calendarFeed: feed([eligibleEvent]) })
      expect(production.robots).toEqual({ index: true, follow: true })
      expect(production.alternates).toEqual({ canonical: 'https://danfran.example/calendar' })
      const eventMetadata = createAppearanceEventMetadata({ event: eligibleEvent, calendarFeed: feed([eligibleEvent]) })
      expect(eventMetadata.title).toBe('Chicago Comedy Night | Appearances | Daniel Franzese')
      expect(eventMetadata.alternates).toEqual({ canonical: 'https://danfran.example/calendar/0123456789abcdef01234567' })
      expect(eventMetadata.openGraph).toMatchObject({ url: 'https://danfran.example/calendar/0123456789abcdef01234567' })

      process.env.NEXT_PUBLIC_DEPLOYMENT_ENV = 'preview'
      const preview = createAppMetadata({ routeId: 'home' })
      expect(preview.robots).toEqual({ index: false, follow: false })
    } finally {
      if (originalEnvironment === undefined) delete process.env.NEXT_PUBLIC_DEPLOYMENT_ENV
      else process.env.NEXT_PUBLIC_DEPLOYMENT_ENV = originalEnvironment
      if (originalSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
      else process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl
    }
  })
})
