import type { Metadata } from 'next'
import BookingPage from '@/components/booking/BookingPage'
import { createAppMetadata } from 'lib/seo/app-metadata'
import { AppStructuredData } from '@/components/seo/AppStructuredData'

export const metadata: Metadata = createAppMetadata({ routeId: 'booking' })

export default function BookingRoute() {
  return <><AppStructuredData routeId="booking" /><BookingPage /></>
}
