import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { proxy } from '../../../proxy'
import { getAppearanceFeed } from 'lib/calendar/server'
import type { AppearanceEvent, AppearanceFeed } from 'lib/calendar/types'

vi.mock('lib/calendar/server', () => ({
  getAppearanceFeed: vi.fn(),
}))

const publicEventId = 'a99d6ebad0f5829e658b87b9'

const event: AppearanceEvent = {
  id: publicEventId,
  title: 'Proxy unit fixture',
  description: '',
  location: null,
  start: '2027-01-16T02:00:00.000Z',
  end: '2027-01-16T04:00:00.000Z',
  allDay: false,
  timeZone: 'America/Chicago',
  eventStatus: 'scheduled',
  ticketStatus: 'unknown',
  ticketUrl: null,
  waitlistUrl: null,
  ticketProvider: null,
  category: 'appearance',
}

const feed = (status: AppearanceFeed['status'], events: AppearanceEvent[] = []): AppearanceFeed => ({
  status,
  events,
  fetchedAt: status === 'ready' ? '2026-10-31T18:00:00.000Z' : null,
  refreshAfterSeconds: 60,
})

const request = (pathname: string, method = 'GET') =>
  new NextRequest(new URL(pathname, 'https://qa.invalid'), { method })

const rewrittenUrl = (response: Response) => response.headers.get('x-middleware-rewrite')

describe('calendar proxy preflight', () => {
  beforeEach(() => {
    vi.mocked(getAppearanceFeed).mockReset()
  })

  it.each([
    ['unconfigured', feed('unconfigured')],
    ['ready but empty', feed('ready')],
  ])('rewrites /calendar for a %s feed and preserves the query', async (_label, appearanceFeed) => {
    vi.mocked(getAppearanceFeed).mockResolvedValue(appearanceFeed)

    const response = await proxy(request('/calendar?source=qa'))

    expect(response).toBeDefined()
    expect(rewrittenUrl(response!)).toBe('https://qa.invalid/__calendar-not-found__?source=qa')
  })

  it('passes an available calendar listing to the App route', async () => {
    vi.mocked(getAppearanceFeed).mockResolvedValue(feed('ready', [event]))

    const response = await proxy(request('/calendar'))

    expect(response).toBeDefined()
    expect(rewrittenUrl(response!)).toBeNull()
    expect(getAppearanceFeed).toHaveBeenCalledTimes(1)
  })

  it('returns a self-contained noindex 503 recovery response for provider outages', async () => {
    vi.mocked(getAppearanceFeed).mockResolvedValue(feed('unavailable'))

    const calendarResponse = await proxy(request('/calendar'))
    expect(calendarResponse).toBeDefined()
    expect(calendarResponse!.status).toBe(503)
    expect(rewrittenUrl(calendarResponse!)).toBeNull()
    expect(calendarResponse!.headers.get('content-type')).toBe('text/html; charset=utf-8')
    expect(calendarResponse!.headers.get('cache-control')).toBe('no-store')
    expect(calendarResponse!.headers.get('x-robots-tag')).toBe('noindex, nofollow')
    expect(calendarResponse!.headers.get('retry-after')).toBe('60')
    const calendarHtml = await calendarResponse!.text()
    expect(calendarHtml).toContain('<html lang="en">')
    expect(calendarHtml).toContain('<h1 id="schedule-unavailable-title">Event updates are temporarily unavailable</h1>')
    expect(calendarHtml).toContain('href="/calendar">Schedule</a>')
    expect(calendarHtml).toContain('href="/booking">Booking</a>')
    expect(calendarHtml).not.toMatch(/private_key|client_email|googleapis|Synthetic provider failure/i)

    const eventResponse = await proxy(request(`/calendar/${publicEventId}`))
    expect(eventResponse).toBeDefined()
    expect(eventResponse!.status).toBe(503)
    expect((await eventResponse!.text())).toContain('Event updates are temporarily unavailable')
    expect(getAppearanceFeed).toHaveBeenCalledTimes(2)
  })

  it('returns the same outage status and headers for HEAD without a body', async () => {
    vi.mocked(getAppearanceFeed).mockResolvedValue(feed('unavailable'))

    const response = await proxy(request('/calendar', 'HEAD'))

    expect(response).toBeDefined()
    expect(response!.status).toBe(503)
    expect(response!.headers.get('cache-control')).toBe('no-store')
    expect(response!.headers.get('x-robots-tag')).toBe('noindex, nofollow')
    expect(response!.headers.get('retry-after')).toBe('60')
    expect(await response!.text()).toBe('')
  })

  it.each([
    ['unconfigured', feed('unconfigured')],
    ['ready but empty', feed('ready')],
  ])('rewrites a public event path when the feed is %s', async (_label, appearanceFeed) => {
    vi.mocked(getAppearanceFeed).mockResolvedValue(appearanceFeed)

    const response = await proxy(request(`/calendar/${publicEventId}`))

    expect(response).toBeDefined()
    expect(rewrittenUrl(response!)).toBe('https://qa.invalid/__calendar-not-found__')
  })

  it('passes only an existing opaque public event ID', async () => {
    vi.mocked(getAppearanceFeed).mockResolvedValue(feed('ready', [event]))

    const validResponse = await proxy(request(`/calendar/${publicEventId}`))
    expect(rewrittenUrl(validResponse!)).toBeNull()

    vi.mocked(getAppearanceFeed).mockResolvedValue(feed('ready', [event]))
    const missingResponse = await proxy(request('/calendar/0123456789abcdef01234567'))
    expect(rewrittenUrl(missingResponse!)).not.toBeNull()

    expect(getAppearanceFeed).toHaveBeenCalledTimes(2)
  })

  it.each([
    '/calendar/not-an-opaque-id',
    '/calendar/0123456789abcdef01234567/extra',
  ])('rewrites malformed or nested event paths without fetching the provider (%s)', async (pathname) => {
    const response = await proxy(request(pathname))

    expect(response).toBeDefined()
    expect(rewrittenUrl(response!)).not.toBeNull()
    expect(getAppearanceFeed).not.toHaveBeenCalled()
  })

  it.each(['POST', 'PUT', 'OPTIONS'])('leaves %s requests to route method handling', async (method) => {
    const response = await proxy(request('/calendar', method))

    expect(response).toBeDefined()
    expect(rewrittenUrl(response!)).toBeNull()
    expect(getAppearanceFeed).not.toHaveBeenCalled()
  })

  it('preflights HEAD like GET without requiring a response body', async () => {
    vi.mocked(getAppearanceFeed).mockResolvedValue(feed('ready', [event]))

    const response = await proxy(request(`/calendar/${publicEventId}`, 'HEAD'))

    expect(response).toBeDefined()
    expect(rewrittenUrl(response!)).toBeNull()
    expect(getAppearanceFeed).toHaveBeenCalledTimes(1)
  })
})
