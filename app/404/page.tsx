import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createAppMetadata } from 'lib/seo/app-metadata'

export const metadata: Metadata = createAppMetadata({ routeId: 'not-found' })

export default function LegacyNotFoundRoute(): never {
  notFound()
}
