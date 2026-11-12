import type { Metadata } from 'next'
import { createAppMetadata } from 'lib/seo/app-metadata'
import { renderHomePage } from './_home-page'

export const metadata: Metadata = createAppMetadata({ routeId: 'home' })
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  return await renderHomePage('home')
}
