import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { emptyFeed, readyFeed, unavailableFeed } from '../../fixtures/calendar'
import type { AppearanceFeed } from '../../../lib/calendar/types'

async function loadCalendarPage(feed: AppearanceFeed) {
  vi.resetModules()
  const getAppearanceFeed = vi.fn().mockResolvedValue(feed)
  vi.doMock('lib/calendar/server', () => ({ getAppearanceFeed }))
  const pageModule = await import('../../../app/calendar/page')
  return { pageModule, getAppearanceFeed }
}

afterEach(() => {
  vi.doUnmock('lib/calendar/server')
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('App Router calendar server boundary', () => {
  it('passes the positive feed to shared metadata and client provider boundaries', async () => {
    const feed = readyFeed()
    const { pageModule, getAppearanceFeed } = await loadCalendarPage(feed)
    const tree = await pageModule.default()
    expect(getAppearanceFeed).toHaveBeenCalledTimes(1)
    expect(isValidElement(tree)).toBe(true)
    if (!isValidElement<{ children?: ReactNode }>(tree)) throw new Error('Expected CalendarPage to return a React element')

    const children = Children.toArray(tree.props.children)
    const structuredData = children.find((child) => isValidElement<Record<string, unknown>>(child) && 'calendarFeed' in child.props) as ReactElement<Record<string, unknown>> | undefined
    const appearanceProvider = children.find((child) => isValidElement<Record<string, unknown>>(child) && 'initialFeed' in child.props) as ReactElement<Record<string, unknown>> | undefined
    expect(structuredData?.props).toMatchObject({ routeId: 'calendar', calendarFeed: feed })
    expect(appearanceProvider?.props.initialFeed).toEqual(feed)
  })

  it('uses App Router not-found for unconfigured and authoritative ready-empty schedules', async () => {
    for (const feed of [emptyFeed, readyFeed([])]) {
      const { pageModule } = await loadCalendarPage(feed)
      await expect(pageModule.default()).rejects.toMatchObject({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' })
    }
  })

  it('throws on a provider outage so the route error boundary preserves failure status', async () => {
    const { pageModule } = await loadCalendarPage(unavailableFeed)
    await expect(pageModule.default()).rejects.toThrow('Appearance schedule unavailable')
  })

  it('keeps calendar metadata noindex without events and indexable only for a configured production feed', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOYMENT_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://qa.invalid')

    const readyPage = await loadCalendarPage(readyFeed())
    const readyMetadata = await readyPage.pageModule.generateMetadata()
    expect(readyMetadata.robots).toEqual({ index: true, follow: true })
    expect(readyMetadata.alternates).toMatchObject({ canonical: 'https://qa.invalid/calendar' })

    const unavailablePage = await loadCalendarPage(unavailableFeed)
    const unavailableMetadata = await unavailablePage.pageModule.generateMetadata()
    expect(unavailableMetadata.robots).toEqual({ index: false, follow: false })
    expect(unavailableMetadata.alternates).toBeUndefined()
  })
})
