import { routeById, selectIndexableRoutes } from '../content/routes'
import { isPublicProductionOrigin, parsePublicOrigin } from './origin'
import type { AppearanceFeed } from '../calendar/types'

export type SitemapEntry = { readonly loc: string }

export const getSitemapEntries = (origin: string | null | undefined, calendarFeed?: AppearanceFeed | null): readonly SitemapEntry[] => {
  const validOrigin = parsePublicOrigin(origin)
  if (!validOrigin || !isPublicProductionOrigin(validOrigin)) return []

  const eligibleRoutes = [...selectIndexableRoutes()]
  const calendarRoute = routeById('calendar')
  if (calendarFeed?.status === 'ready' && calendarFeed.events.length > 0 && calendarRoute) {
    eligibleRoutes.push(calendarRoute)
  }
  const routes = Array.from(new Map(eligibleRoutes.map((route) => [route.id, route])).values())

  return routes.map((route) => ({
    loc: `${validOrigin}${route.canonicalPath}`,
  }))
}

const escapeXml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export const buildSitemapXml = (
  origin: string | null | undefined,
  calendarFeed?: AppearanceFeed | null,
  additionalEntries: readonly SitemapEntry[] = [],
): string => {
  const entries = Array.from(new Map(
    [...getSitemapEntries(origin, calendarFeed), ...additionalEntries].map((entry) => [entry.loc, entry]),
  ).values())
  const urls = entries.map((entry) => `  <url><loc>${escapeXml(entry.loc)}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls ? `\n${urls}\n` : ''}</urlset>`
}
