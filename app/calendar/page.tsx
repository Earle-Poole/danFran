import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AppearanceProvider } from '@/components/appearances/AppearanceProvider'
import CalendarTemplate from '@/components/templates/calendar'
import { getAppearanceFeed } from 'lib/calendar/server'
import { createAppMetadata } from 'lib/seo/app-metadata'
import { AppStructuredData } from '@/components/seo/AppStructuredData'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const calendarFeed = await getAppearanceFeed()
  return createAppMetadata({ routeId: 'calendar', calendarFeed })
}

export default async function CalendarPage() {
  const appearanceFeed = await getAppearanceFeed()

  if (appearanceFeed.status === 'unconfigured' || (appearanceFeed.status === 'ready' && appearanceFeed.events.length === 0)) {
    notFound()
  }
  if (appearanceFeed.status === 'unavailable') {
    throw new Error('Appearance schedule unavailable')
  }

  return (
    <>
      <AppStructuredData routeId="calendar" calendarFeed={appearanceFeed} />
      <AppearanceProvider initialFeed={appearanceFeed}>
        <CalendarTemplate />
      </AppearanceProvider>
    </>
  )
}
