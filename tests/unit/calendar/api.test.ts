import { afterEach, describe, expect, it, vi } from 'vitest'
import type { AppearanceFeed } from '../../../lib/calendar/types'
import { emptyFeed, readyFeed, unavailableFeed } from '../../fixtures/calendar'

async function loadRoutes(feed: AppearanceFeed) {
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

describe('App Router /api/appearances handlers', () => {
  it('returns a ready feed with no-store caching and no provider-only fields', async () => {
    const feed = readyFeed()
    const { route, getAppearanceFeed } = await loadRoutes(feed)

    const response = await route.GET()
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.json()).toEqual(feed)
    expect(getAppearanceFeed).toHaveBeenCalledTimes(1)
    expect(JSON.stringify(feed)).not.toMatch(/private_key|client_email|attendees|organizer|googleapis/i)
  })

  it('keeps unconfigured, ready-empty, and unavailable states distinct', async () => {
    for (const feed of [emptyFeed, readyFeed([])]) {
      const { route } = await loadRoutes(feed)
      const response = await route.GET()
      expect(response.status).toBe(200)
      expect(response.headers.get('cache-control')).toBe('no-store')
      expect(await response.json()).toEqual(feed)
    }

    const { route } = await loadRoutes(unavailableFeed)
    const unavailable = await route.GET()
    expect(unavailable.status).toBe(503)
    expect(unavailable.headers.get('cache-control')).toBe('no-store')
    expect(await unavailable.json()).toEqual(unavailableFeed)
  })

  it('rejects write and discovery methods without contacting the calendar source', async () => {
    const { route, getAppearanceFeed } = await loadRoutes(emptyFeed)
    for (const method of [route.POST, route.PUT, route.PATCH, route.DELETE, route.HEAD, route.OPTIONS]) {
      const response = await method()
      expect(response.status).toBe(405)
      expect(response.headers.get('allow')).toBe('GET')
      expect(response.headers.get('cache-control')).toBe('no-store')
      expect(await response.json()).toEqual({ error: 'method_not_allowed' })
    }
    expect(getAppearanceFeed).not.toHaveBeenCalled()
  })
})
