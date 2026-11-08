import Head from 'next/head'
import type { RouteId } from '../../lib/content/types'
import {
  createSeoMetadata,
  defaultSeoImagePath,
} from '../../lib/seo/metadata'
import {
  getConfiguredOrigin,
  getDeploymentEnvironment,
} from '../../lib/seo/origin'
import type { SeoSchemaInput } from '../../lib/seo/schema'
import { serializeJsonLd, buildSeoJsonLd } from '../../lib/seo/schema'
import type { AppearanceFeed } from '../../lib/calendar/types'
import { useAppearanceFeed } from '../appearances/AppearanceProvider'

export type PageSeoProps = {
  routeId: RouteId
  schema?: SeoSchemaInput | readonly SeoSchemaInput[]
  imagePath?: string
  calendarFeed?: AppearanceFeed | null
}

export function PageSeo({ routeId, schema, imagePath = defaultSeoImagePath, calendarFeed }: PageSeoProps) {
  const environment = getDeploymentEnvironment()
  const origin = getConfiguredOrigin({ environment })
  const providerState = useAppearanceFeed()
  const currentFeed = routeId === 'calendar' ? providerState.feed ?? calendarFeed : calendarFeed
  const effectiveCalendarFeed = providerState.delayed && currentFeed
    ? { ...currentFeed, status: 'unavailable' as const }
    : currentFeed
  const metadata = createSeoMetadata({ routeId, origin, environment, imagePath, schema, calendarFeed: effectiveCalendarFeed })

  return (
    <Head>
      <title key="title">{metadata.title}</title>
      <meta key="description" name="description" content={metadata.description} />
      <meta key="robots" name="robots" content={metadata.robots} />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:site_name" property="og:site_name" content="Daniel Franzese" />
      <meta key="og:title" property="og:title" content={metadata.title} />
      <meta key="og:description" property="og:description" content={metadata.description} />
      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:title" name="twitter:title" content={metadata.title} />
      <meta key="twitter:description" name="twitter:description" content={metadata.description} />
      {metadata.canonicalUrl ? <link key="canonical" rel="canonical" href={metadata.canonicalUrl} /> : null}
      {metadata.canonicalUrl ? <meta key="og:url" property="og:url" content={metadata.canonicalUrl} /> : null}
      {metadata.imageUrl ? <meta key="og:image" property="og:image" content={metadata.imageUrl} /> : null}
      {metadata.imageUrl ? <meta key="og:image:alt" property="og:image:alt" content={metadata.imageAlt} /> : null}
      {metadata.imageUrl ? <meta key="twitter:image" name="twitter:image" content={metadata.imageUrl} /> : null}
      {metadata.jsonLd ? (
        <script
          key="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: metadata.jsonLd }}
        />
      ) : null}
    </Head>
  )
}

export { buildSeoJsonLd, serializeJsonLd }
