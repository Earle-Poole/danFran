import { generateKeyPairSync } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  __resetCalendarCachesForTests,
  getAppearanceFeed,
} from '../../../lib/calendar/server'

const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
const serviceAccountJson = JSON.stringify({
  type: 'service_account',
  client_email: 'calendar-reader@example-project.iam.gserviceaccount.com',
  private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }),
})

const event = {
  id: 'event-1',
  summary: 'A future appearance',
  description: 'Category: speaking\nTicket status: coming-soon',
  start: { dateTime: '2027-06-01T19:00:00-05:00', timeZone: 'America/Chicago' },
  end: { dateTime: '2027-06-01T20:00:00-05:00' },
}

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

describe('calendar source, auth, pagination, and cache', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    vi.stubEnv('GOOGLE_CALENDAR_ID', 'private-calendar@example.com')
    vi.stubEnv('GOOGLE_SERVICE_ACCOUNT_JSON', serviceAccountJson)
    vi.stubEnv('GOOGLE_CALENDAR_REFRESH_SECONDS', '60')
    vi.stubEnv('GOOGLE_CALENDAR_LOOKAHEAD_DAYS', '365')
    __resetCalendarCachesForTests()
  })

  afterEach(() => {
    __resetCalendarCachesForTests()
    vi.unstubAllEnvs()
    vi.useRealTimers()
  })

  it('uses one token request and one event request for concurrent calls, then reuses the TTL result', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input)
      if (url === 'https://oauth2.googleapis.com/token') {
        return jsonResponse({ access_token: 'test-access-token', expires_in: 3600 })
      }
      return jsonResponse({ timeZone: 'America/Chicago', items: [event] })
    })

    const [first, second, third] = await Promise.all([
      getAppearanceFeed(),
      getAppearanceFeed(),
      getAppearanceFeed(),
    ])
    expect(first.status).toBe('ready')
    expect(first.events).toHaveLength(1)
    expect(second).toEqual(first)
    expect(third).toEqual(first)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    await getAppearanceFeed()
    expect(fetchMock).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(60_001)
    await getAppearanceFeed()
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(fetchMock.mock.calls.filter(([input]) => String(input) === 'https://oauth2.googleapis.com/token')).toHaveLength(1)
  })

  it('retrieves bounded pages and treats an incomplete source page as unavailable', async () => {
    let eventCalls = 0
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input)
      if (url === 'https://oauth2.googleapis.com/token') return jsonResponse({ access_token: 'token' })
      eventCalls += 1
      if (eventCalls === 1) return jsonResponse({ items: [event], nextPageToken: 'page-2' })
      expect(url).toContain('pageToken=page-2')
      return jsonResponse({ items: [{ ...event, id: 'event-2' }] })
    })

    const feed = await getAppearanceFeed()
    expect(feed.status).toBe('ready')
    expect(feed.events).toHaveLength(2)
    expect(eventCalls).toBe(2)

    __resetCalendarCachesForTests()
    eventCalls = 0
    vi.mocked(globalThis.fetch).mockImplementation(async (input) => {
      const url = String(input)
      if (url === 'https://oauth2.googleapis.com/token') return jsonResponse({ access_token: 'token' })
      return jsonResponse({ items: [event], nextPageToken: 123 })
    })
    const unavailable = await getAppearanceFeed()
    expect(unavailable.status).toBe('unavailable')
    expect(JSON.stringify(unavailable)).not.toContain('pageToken')
  })

  it('returns unconfigured without attempting credential or Google access', async () => {
    vi.stubEnv('GOOGLE_CALENDAR_ID', '')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => jsonResponse({}))
    const feed = await getAppearanceFeed()
    expect(feed).toMatchObject({ status: 'unconfigured', events: [], fetchedAt: null, refreshAfterSeconds: 60 })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects credentials that are not service-account credentials', async () => {
    vi.stubEnv(
      'GOOGLE_SERVICE_ACCOUNT_JSON',
      JSON.stringify({
        type: 'authorized_user',
        client_email: 'not-a-service-account@example.com',
        private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }),
      }),
    )
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => jsonResponse({}))
    const feed = await getAppearanceFeed()
    expect(feed.status).toBe('unavailable')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rechecks cached event expiry without fetching again', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) =>
      String(input) === 'https://oauth2.googleapis.com/token'
        ? jsonResponse({ access_token: 'token' })
        : jsonResponse({ items: [event] }),
    )
    const first = await getAppearanceFeed()
    expect(first.events).toHaveLength(1)
    vi.setSystemTime(new Date('2027-06-01T20:01:00-05:00'))
    const cached = await getAppearanceFeed()
    expect(cached.status).toBe('ready')
    expect(cached.events).toEqual([])
  })
})
