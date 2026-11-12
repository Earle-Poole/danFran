import { getAppearanceFeed } from 'lib/calendar/server'
import { getEventSitemapEntries } from 'lib/seo/events'
import { buildSitemapXml } from 'lib/seo/sitemap'
import { getConfiguredOrigin, getDeploymentEnvironment } from 'lib/seo/origin'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const environment = getDeploymentEnvironment()
  const origin = getConfiguredOrigin({ environment })
  const feed = environment === 'production' && origin ? await getAppearanceFeed() : null
  const xml = buildSitemapXml(origin, feed, getEventSitemapEntries(origin, feed))
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': environment === 'production' && origin ? 'all' : 'noindex',
      'Cache-Control': 'no-store',
    },
  })
}
