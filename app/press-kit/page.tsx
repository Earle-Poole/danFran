import type { Metadata } from 'next'
import PressKitTemplate from '@/components/templates/press-kit'
import { createAppMetadata } from 'lib/seo/app-metadata'
import { AppStructuredData } from '@/components/seo/AppStructuredData'

export const metadata: Metadata = createAppMetadata({ routeId: 'press-kit' })

export default function PressKitRoute() {
  return <><AppStructuredData routeId="press-kit" /><PressKitTemplate /></>
}
