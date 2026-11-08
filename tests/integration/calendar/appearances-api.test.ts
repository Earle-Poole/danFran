import { afterEach, describe, expect, it, vi } from 'vitest'
import type { AppearanceEvent, AppearanceFeed } from '../../../lib/calendar/types'

async function loadRoute(feed: AppearanceFeed) {
  vi.resetModules()
  const getAppearanceFeed = vi.fn().mockResolvedValue(feed)
  vi.doMock('lib/calendar/server', () => ({ getAppearanceFeed }))
  const route = await import('../../../app/api/appearances/route')
  return { route, getAppearanceFeed }
}

afterEach(() => {
  vi.doUnmock('lib/calendar/server')
  vi.resetModules()
})

describe('App Router appearances API serialization', () => {
  it('serializes only normalized public event properties and prevents shared caching', async () => {
    const event: AppearanceEvent = {
      id: '2e03fc7f4241fa2c7d29ff70',
      title: 'Chicago Public Fixture',
      description: 'A safe public event description.',
      location: 'QA Venue, Chicago, IL',
      start: '2027-01-15T20:00:00.000Z',
      end: '2027-01-15T22:00:00.000Z',
      allDay: false,
      timeZone: 'America/Chicago',
      eventStatus: 'scheduled',
      ticketStatus: 'sold-out',
      ticketUrl: null,
      waitlistUrl: null,
      ticketProvider: null,
      category: 'comedy',
    }
    const feed: AppearanceFeed = {
      status: 'ready',
      events: [event],
      fetchedAt: '2026-10-25T12:00:00.000Z',
      refreshAfterSeconds: 60,
    }
    const { route } = await loadRoute(feed)

    const response = await route.GET()
    const payload = await response.json()
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(payload).toEqual(feed)
    expect(JSON.stringify(payload)).not.toMatch(/private_key|client_email|attendees|organizer|googleapis/i)
  })

  it('preserves source failure as a 503 response instead of an empty success', async () => {
    const feed: AppearanceFeed = {
      status: 'unavailable',
      events: [],
      fetchedAt: null,
      refreshAfterSeconds: 60,
    }
    const { route, getAppearanceFeed } = await loadRoute(feed)
    const response = await route.GET()

    expect(response.status).toBe(503)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.json()).toEqual(feed)
    expect(getAppearanceFeed).toHaveBeenCalledTimes(1)
  })
})
