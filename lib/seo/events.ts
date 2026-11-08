import type { Metadata } from 'next'
import type { AppearanceEvent, AppearanceFeed } from '../calendar/types'
import { getAppearanceEventPath } from '../calendar/event-links'
import { getAppearanceEventJsonLd, serializeAppearanceEventJsonLd as serializeEventJsonLd, type AppearanceEventJsonLd } from '../calendar/event-schema'
import { createAppMetadata } from './app-metadata'
import { getConfiguredOrigin, getDeploymentEnvironment, isPublicProductionOrigin, parsePublicOrigin } from './origin'
export { getAppearanceEventJsonLd }
export const serializeAppearanceEventJsonLd = (event: AppearanceEventJsonLd): string =>
  serializeEventJsonLd(event)

/** Event-page metadata keeps the current deployment/origin indexing policy. */
export const createAppearanceEventMetadata = ({
  event,
  calendarFeed,
}: {
  event: AppearanceEvent
  calendarFeed: AppearanceFeed
}): Metadata => {
  const base = createAppMetadata({ routeId: 'calendar', calendarFeed })
  const origin = getConfiguredOrigin({ environment: getDeploymentEnvironment() })
  const path = getAppearanceEventPath(event)
  const canIndex = Boolean(
    calendarFeed.status === 'ready' && path && origin &&
    getDeploymentEnvironment() === 'production' && isPublicProductionOrigin(origin),
  )
  const canonical = path && origin && calendarFeed.status === 'ready' ? `${origin}${path}` : undefined
  const title = `${event.title} | Appearances | Daniel Franzese`
  const description = event.description.trim() || `${event.title} appearance details and schedule information.`
  return {
    ...base,
    title,
    description,
    robots: canIndex ? { index: true, follow: true } : { index: false, follow: false },
    ...(canonical ? { alternates: { canonical } } : { alternates: undefined }),
    openGraph: {
      ...(base.openGraph ?? {}),
      type: 'website',
      siteName: 'Daniel Franzese',
      title,
      description,
      ...(canonical ? { url: canonical } : { url: undefined }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(base.twitter?.images ? { images: base.twitter.images } : {}),
    },
  }
}

export type EventSitemapEntry = { readonly loc: string }

/** Include all currently displayable normalized event pages, even schema-ineligible ones. */
export const getEventSitemapEntries = (
  origin: string | null | undefined,
  feed: AppearanceFeed | null | undefined,
): readonly EventSitemapEntry[] => {
  const validOrigin = parsePublicOrigin(origin)
  if (!validOrigin || !isPublicProductionOrigin(validOrigin) || feed?.status !== 'ready') return []
  return feed.events.flatMap((event) => {
    const path = getAppearanceEventPath(event)
    return path ? [{ loc: `${validOrigin}${path}` }] : []
  })
}
