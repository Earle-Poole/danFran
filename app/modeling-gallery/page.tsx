import type { Metadata } from 'next'
import ModelingGalleryTemplate from '@/components/templates/model-gallery'
import { createAppMetadata } from 'lib/seo/app-metadata'
import { AppStructuredData } from '@/components/seo/AppStructuredData'

export const metadata: Metadata = createAppMetadata({ routeId: 'portraits' })

export default function ModelingGalleryRoute() {
  return <><AppStructuredData routeId="portraits" /><ModelingGalleryTemplate /></>
}
