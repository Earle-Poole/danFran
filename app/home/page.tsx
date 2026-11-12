import type { Metadata } from 'next'
import { createAppMetadata } from 'lib/seo/app-metadata'
import { renderHomePage } from '../_home-page'

export const metadata: Metadata = createAppMetadata({ routeId: 'legacy-home' })
export const dynamic = 'force-dynamic'

export default async function LegacyHomePage() {
  return await renderHomePage('legacy-home')
}
