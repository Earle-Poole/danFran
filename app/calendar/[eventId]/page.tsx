import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { findAppearanceEventById } from 'lib/calendar/event-links'
import { getAppearanceFeed } from 'lib/calendar/server'
import { createAppMetadata } from 'lib/seo/app-metadata'
import {
  createAppearanceEventMetadata,
  getAppearanceEventJsonLd,
  serializeAppearanceEventJsonLd,
} from 'lib/seo/events'
import { getConfiguredOrigin, getDeploymentEnvironment } from 'lib/seo/origin'
import { EventDetail } from '@/components/appearances/EventDetail'
import { AppStructuredData } from '@/components/seo/AppStructuredData'

type EventPageProps = {
  params: Promise<{ eventId: string }>
}

const getFeed = cache(getAppearanceFeed)
const PUBLIC_EVENT_ID = /^[a-f0-9]{24}$/

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { eventId } = await params
  if (!PUBLIC_EVENT_ID.test(eventId)) return createAppMetadata({ routeId: 'not-found' })

  const feed = await getFeed()
  const event = feed.status === 'ready' ? findAppearanceEventById(feed.events, eventId) : null
  if (!event || feed.status !== 'ready') {
    return createAppMetadata({ routeId: feed.status === 'unavailable' ? 'calendar' : 'not-found', calendarFeed: feed })
  }
  return createAppearanceEventMetadata({ event, calendarFeed: feed })
}

export default async function AppearanceEventPage({ params }: EventPageProps) {
  const { eventId } = await params
  if (!PUBLIC_EVENT_ID.test(eventId)) notFound()

  const feed = await getFeed()
  if (feed.status === 'unavailable') {
    // Let the route error boundary return an honest 500. Keep source details private.
    throw new Error('Appearance schedule unavailable')
  }
  if (feed.status !== 'ready') notFound()

  const event = findAppearanceEventById(feed.events, eventId)
  if (!event) notFound()

  const origin = getConfiguredOrigin({ environment: getDeploymentEnvironment() })
  const jsonLd = getAppearanceEventJsonLd(origin, event)

  return (
    <>
      <AppStructuredData routeId="calendar" calendarFeed={feed} />
      <EventDetail
        initialFeed={feed}
        eventId={eventId}
        jsonLd={jsonLd ? serializeAppearanceEventJsonLd(jsonLd) : null}
      />
    </>
  )
}
