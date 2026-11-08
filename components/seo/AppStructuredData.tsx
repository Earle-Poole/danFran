import { createSeoMetadata, defaultSeoImagePath } from 'lib/seo/metadata'
import type { RouteId } from 'lib/content/types'
import type { AppearanceFeed } from 'lib/calendar/types'
import type { SeoSchemaInput } from 'lib/seo/schema'

export function AppStructuredData({
  routeId,
  calendarFeed,
  schema,
}: {
  routeId: RouteId
  calendarFeed?: AppearanceFeed | null
  schema?: SeoSchemaInput | readonly SeoSchemaInput[]
}) {
  const metadata = createSeoMetadata({ routeId, calendarFeed, schema, imagePath: defaultSeoImagePath })
  return metadata.jsonLd
    ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: metadata.jsonLd }} />
    : null
}
