import { Children, isValidElement, type ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AppearanceEvent, AppearanceFeed } from '../../../lib/calendar/types'
import { qaEventIds } from '../../helpers/calendar-public-id'

const event: AppearanceEvent = {
  id: qaEventIds.chicago,
  title: 'Chicago QA Arts Night',
  description: 'A verified server-side event fixture.',
  location: 'QA Auditorium, Chicago, IL',
  start: '2027-01-16T02:00:00.000Z',
  end: '2027-01-16T04:00:00.000Z',
  allDay: false,
  timeZone: 'America/Chicago',
  eventStatus: 'scheduled',
  ticketStatus: 'sold-out',
  ticketUrl: null,
  waitlistUrl: null,
  ticketProvider: null,
  category: 'comedy',
  venue: {
    name: 'QA Auditorium',
    streetAddress: '999 QA Way',
    addressLocality: 'Chicago',
    addressRegion: 'IL',
    postalCode: '60601',
    addressCountry: 'US',
  },
}

const ready: AppearanceFeed = {
  status: 'ready',
  events: [event],
  fetchedAt: '2026-10-25T12:00:00.000Z',
  refreshAfterSeconds: 60,
}

async function loadEventPage(feed: AppearanceFeed) {
  vi.resetModules()
  const getAppearanceFeed = vi.fn().mockResolvedValue(feed)
  vi.doMock('lib/calendar/server', () => ({ getAppearanceFeed }))
  const eventPage = await import('../../../app/calendar/[eventId]/page')
  return { eventPage, getAppearanceFeed }
}

afterEach(() => {
  vi.doUnmock('lib/calendar/server')
  vi.unstubAllEnvs()
  vi.resetModules()
})

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_DEPLOYMENT_ENV', 'production')
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://qa.invalid')
})

describe('App Router event detail server boundary', () => {
  it('passes a matching public event and its truthful schema to the client leaf', async () => {
    const { eventPage, getAppearanceFeed } = await loadEventPage(ready)
    const element = await eventPage.default({ params: Promise.resolve({ eventId: qaEventIds.chicago }) })
    expect(getAppearanceFeed).toHaveBeenCalledTimes(1)
    expect(isValidElement(element)).toBe(true)
    if (!isValidElement<{ children?: ReactNode }>(element)) throw new Error('Expected the event page to return a React element')
    const detail = Children.toArray(element.props.children).find(
      (child) => isValidElement<Record<string, unknown>>(child) && 'initialFeed' in child.props,
    )
    if (!isValidElement<Record<string, unknown>>(detail)) throw new Error('Expected an EventDetail child')
    expect(detail.props.eventId).toBe(qaEventIds.chicago)
    expect(detail.props.initialFeed).toEqual(ready)
    const jsonLd = JSON.parse(String(detail.props.jsonLd)) as Record<string, unknown>
    expect(jsonLd).toMatchObject({
      '@type': 'Event',
      name: 'Chicago QA Arts Night',
      startDate: '2027-01-16T02:00:00.000Z',
      endDate: '2027-01-16T04:00:00.000Z',
    })
    expect(JSON.stringify(jsonLd)).toContain('999 QA Way')
    expect(jsonLd).not.toHaveProperty('offers')
  })

  it('rejects malformed and unknown opaque IDs with the framework not-found result', async () => {
    const { eventPage: malformed, getAppearanceFeed: malformedLookup } = await loadEventPage(ready)
    await expect(malformed.default({ params: Promise.resolve({ eventId: 'not-a-public-id' }) }))
      .rejects.toMatchObject({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' })
    expect(malformedLookup).not.toHaveBeenCalled()

    const { eventPage: unknown } = await loadEventPage(ready)
    await expect(unknown.default({ params: Promise.resolve({ eventId: '0123456789abcdef01234567' }) }))
      .rejects.toMatchObject({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' })
  })

  it('generates canonical Open Graph metadata and indexes only a verified public-origin event', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOYMENT_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://qa.invalid')
    const { eventPage } = await loadEventPage(ready)
    const metadata = await eventPage.generateMetadata({ params: Promise.resolve({ eventId: qaEventIds.chicago }) })

    expect(metadata.title).toContain('Chicago QA Arts Night')
    expect(metadata.description).toBe(event.description)
    expect(metadata.robots).toEqual({ index: true, follow: true })
    expect(metadata.alternates).toMatchObject({ canonical: `https://qa.invalid/calendar/${qaEventIds.chicago}` })
    expect(metadata.openGraph).toMatchObject({
      title: expect.stringContaining('Chicago QA Arts Night'),
      url: `https://qa.invalid/calendar/${qaEventIds.chicago}`,
    })
  })

  it('surfaces source outages as errors and emits noindex metadata while the feed is unavailable', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOYMENT_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://qa.invalid')
    const unavailable: AppearanceFeed = { status: 'unavailable', events: [], fetchedAt: null, refreshAfterSeconds: 60 }
    const { eventPage } = await loadEventPage(unavailable)
    await expect(eventPage.default({ params: Promise.resolve({ eventId: qaEventIds.chicago }) }))
      .rejects.toThrow('Appearance schedule unavailable')
    const metadata = await eventPage.generateMetadata({ params: Promise.resolve({ eventId: qaEventIds.chicago }) })
    expect(metadata.robots).toEqual({ index: false, follow: false })
    expect(metadata.alternates).toBeUndefined()
  })
})
