import HomeTemplate from '@/components/templates/home/HomeTemplate'
import { NewsletterSection } from '@/components/newsletter'
import { AppearanceProvider } from '@/components/appearances/AppearanceProvider'
import { getAppearanceFeed } from 'lib/calendar/server'
import type { RouteId } from 'lib/content/types'
import { AppStructuredData } from '@/components/seo/AppStructuredData'

export const renderHomePage = async (routeId: Extract<RouteId, 'home' | 'legacy-home'>) => {
  const feed = await getAppearanceFeed()

  return (
    <>
      <AppStructuredData routeId={routeId} calendarFeed={feed} />
      <AppearanceProvider initialFeed={feed}>
        <HomeTemplate newsletterSection={<NewsletterSection id="home-newsletter" />} />
      </AppearanceProvider>
    </>
  )
}
