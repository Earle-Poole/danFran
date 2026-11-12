import type { Metadata } from 'next'
import AboutPage from '@/components/about/AboutPage'
import { createAppMetadata } from 'lib/seo/app-metadata'
import { AppStructuredData } from '@/components/seo/AppStructuredData'

export const metadata: Metadata = createAppMetadata({ routeId: 'about' })

export default function AboutRoute() {
  return <><AppStructuredData routeId="about" /><AboutPage /></>
}
