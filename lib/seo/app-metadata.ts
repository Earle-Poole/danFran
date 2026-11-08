import type { Metadata } from 'next'
import type { AppearanceFeed } from '../calendar/types'
import type { RouteId } from '../content/types'
import { createSeoMetadata } from './metadata'

/** Adapt the existing SEO contract to the App Router Metadata API. */
export const createAppMetadata = ({
  routeId,
  calendarFeed,
}: {
  routeId: RouteId
  calendarFeed?: AppearanceFeed | null
}): Metadata => {
  const seo = createSeoMetadata({ routeId, calendarFeed })
  return {
    title: seo.title,
    description: seo.description,
    robots: seo.indexable ? { index: true, follow: true } : { index: false, follow: false },
    ...(seo.canonicalUrl ? { alternates: { canonical: seo.canonicalUrl } } : {}),
    openGraph: {
      type: 'website',
      siteName: 'Daniel Franzese',
      title: seo.title,
      description: seo.description,
      ...(seo.canonicalUrl ? { url: seo.canonicalUrl } : {}),
      ...(seo.imageUrl ? { images: [{ url: seo.imageUrl, alt: seo.imageAlt }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      ...(seo.imageUrl ? { images: [{ url: seo.imageUrl, alt: seo.imageAlt }] } : {}),
    },
  }
}
