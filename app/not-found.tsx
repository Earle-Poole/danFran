import type { Metadata } from 'next'
import NotFound from '@/components/seo/NotFound'
import { createAppMetadata } from 'lib/seo/app-metadata'

export const metadata: Metadata = createAppMetadata({ routeId: 'not-found' })

export default function AppNotFound() {
  return <NotFound />
}
