import { describe, expect, it } from 'vitest'
import { findAppearanceEventById, getAppearanceEventPath } from '../../../lib/calendar/event-links'
import type { AppearanceEvent } from '../../../lib/calendar/types'

const event = (id: string): AppearanceEvent => ({
  id,
  title: 'A show',
  description: '',
  location: null,
  start: '2027-06-01T19:00:00.000Z',
  end: '2027-06-01T21:00:00.000Z',
  allDay: false,
  timeZone: 'America/Chicago',
  eventStatus: 'scheduled',
  ticketStatus: 'unknown',
  ticketUrl: null,
  waitlistUrl: null,
  ticketProvider: null,
  category: 'appearance',
})

describe('stable public event links', () => {
  it('uses only the normalized opaque 24-hex ID', () => {
    const normalized = event('0123456789abcdef01234567')
    expect(getAppearanceEventPath(normalized)).toBe('/calendar/0123456789abcdef01234567')
    expect(getAppearanceEventPath(event('raw-google-id'))).toBeNull()
  })

  it('rejects malformed IDs and safely finds only normalized feed events', () => {
    const current = event('0123456789abcdef01234567')
    expect(findAppearanceEventById([current], current.id)).toBe(current)
    expect(findAppearanceEventById([current], 'https://attacker.invalid/')).toBeNull()
    expect(findAppearanceEventById([current], '0123456789ABCDEF01234567')).toBeNull()
    expect(findAppearanceEventById([event('not-an-id')], '0123456789abcdef01234567')).toBeNull()
  })
})
