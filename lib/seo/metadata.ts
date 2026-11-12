import { photos, selectedPhotos } from '../content'
import { routeById } from '../content/routes'
import type { RouteId } from '../content/types'
import { getConfiguredOrigin, getDeploymentEnvironment, type DeploymentEnvironment } from './origin'
import { buildSeoJsonLd, type JsonLdValue, type SeoSchemaInput, serializeJsonLd } from './schema'
import type { AppearanceFeed } from '../calendar/types'

export type SeoMetadata = {
  readonly title: string
  readonly description: string
  readonly canonicalUrl: string | null
  readonly imageUrl: string | null
  readonly imageAlt: string
  readonly robots: string
  readonly indexable: boolean
  readonly jsonLd: string | null
}

export const defaultSeoImagePath = selectedPhotos[0].originalPath

export const isOriginalSeoImage = (path: string): boolean =>
  photos.some((photo) => photo.originalPath === path)

export const createSeoMetadata = ({
  routeId,
  origin,
  environment = getDeploymentEnvironment(),
  imagePath = defaultSeoImagePath,
  schema,
  calendarFeed,
}: {
  routeId: RouteId
  origin?: string | null
  environment?: DeploymentEnvironment
  imagePath?: string
  schema?: SeoSchemaInput | readonly SeoSchemaInput[]
  calendarFeed?: AppearanceFeed | null
}): SeoMetadata => {
  const route = routeById(routeId) ?? routeById('not-found')!
  const validOrigin = getConfiguredOrigin({ value: origin ?? undefined, environment })
  const validImage = isOriginalSeoImage(imagePath) ? photos.find((photo) => photo.originalPath === imagePath) : undefined
  const isNotFound = route.id === 'not-found'
  const calendarHasEvents = route.id !== 'calendar' || (calendarFeed?.status === 'ready' && calendarFeed.events.length > 0)
  const indexable =
    environment === 'production' &&
    Boolean(validOrigin) &&
    (route.indexable || route.id === 'calendar') &&
    route.availability === 'available' &&
    !isNotFound &&
    calendarHasEvents
  const canonicalUrl =
    validOrigin && !isNotFound && calendarHasEvents ? `${validOrigin}${route.canonicalPath}` : null
  const imageUrl = validOrigin && validImage ? `${validOrigin}${validImage.originalPath}` : null
  const jsonLdValue: JsonLdValue | null =
    validOrigin && !isNotFound
      ? buildSeoJsonLd({ origin: validOrigin, imagePath: validImage?.originalPath, schema })
      : null

  return {
    title: route.title,
    description: route.description,
    canonicalUrl,
    imageUrl,
    imageAlt: validImage?.alt ?? 'Daniel Franzese',
    robots: indexable ? 'index,follow' : 'noindex,nofollow',
    indexable,
    jsonLd: jsonLdValue ? serializeJsonLd(jsonLdValue) : null,
  }
}
