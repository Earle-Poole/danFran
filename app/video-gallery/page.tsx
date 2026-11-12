import type { Metadata } from 'next'
import VideoGalleryTemplate from '@/components/templates/video-gallery'
import { createAppMetadata } from 'lib/seo/app-metadata'
import { AppStructuredData } from '@/components/seo/AppStructuredData'

export const metadata: Metadata = createAppMetadata({ routeId: 'videos' })
export const dynamic = 'force-dynamic'

export default function VideoGalleryRoute() {
  return <><AppStructuredData routeId="videos" /><VideoGalleryTemplate /></>
}
