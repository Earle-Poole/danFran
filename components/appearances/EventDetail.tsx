'use client'

import { AppearanceProvider, useAppearanceFeed } from './AppearanceProvider'
import { ActionLink, Container, Section } from '@/components/ui'
import Link from 'next/link'
import type { AppearanceEvent, AppearanceFeed } from 'lib/calendar/types'
import { findAppearanceEventById } from 'lib/calendar/event-links'
import { formatEventDate, getLocationLabel, getNeutralActionLabel, getTicketAction } from './helpers'
import styles from './event-detail.module.css'

type EventDetailProps = {
  initialFeed: AppearanceFeed
  eventId: string
  jsonLd: string | null
}

export function EventDetail({ initialFeed, eventId, jsonLd }: EventDetailProps) {
  const initialEvent = findAppearanceEventById(initialFeed.events, eventId)
  return (
    <AppearanceProvider initialFeed={initialFeed}>
      <LiveEventDetail eventId={eventId} initialEvent={initialEvent} jsonLd={jsonLd} />
    </AppearanceProvider>
  )
}

function LiveEventDetail({ eventId, initialEvent, jsonLd }: { eventId: string; initialEvent: AppearanceEvent | null; jsonLd: string | null }) {
  const { feed, delayed } = useAppearanceFeed()
  const event = feed?.status === 'ready'
    ? findAppearanceEventById(feed.events, eventId)
    : null

  if (!feed || feed.status === 'unavailable') {
    return (
      <Section className={styles.eventSection}>
        <Container>
          <p className={styles.eyebrow}>Daniel Franzese / Appearances</p>
          <h1 className={styles.heading}>Schedule update unavailable</h1>
          <p className={styles.copy} role="status">We can’t confirm this event’s current details. Ticket actions are paused. Please check back soon.</p>
        </Container>
      </Section>
    )
  }

  if (!event) {
    return (
      <Section className={styles.eventSection}>
        <Container>
          <p className={styles.eyebrow}>Daniel Franzese / Appearances</p>
          <h1 className={styles.heading}>Event no longer listed</h1>
          <p className={styles.copy} role="status">This event is no longer on the current schedule. Check the appearances calendar for current dates.</p>
          <Link className={styles.backLink} href="/calendar">Back to appearances <span aria-hidden="true">→</span></Link>
        </Container>
      </Section>
    )
  }

  const matchesInitialSnapshot = Boolean(initialEvent && JSON.stringify(event) === JSON.stringify(initialEvent))
  return <EventDetailContent event={event} delayed={delayed} jsonLd={matchesInitialSnapshot && !delayed ? jsonLd : null} />
}

function EventDetailContent({ event, delayed, jsonLd }: { event: AppearanceEvent; delayed: boolean; jsonLd: string | null }) {
  const display = formatEventDate(event)
  const ticketAction = getTicketAction(event, delayed)
  const eventStatusLabel = event.eventStatus[0].toUpperCase() + event.eventStatus.slice(1)
  const ticketStatusLabel = {
    'on-sale': 'On sale',
    presale: 'Presale',
    'sold-out': 'Sold out',
    'coming-soon': 'Coming soon',
    unknown: 'To be announced',
  }[event.ticketStatus]

  return (
    <Section className={styles.eventSection}>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
      <Container>
        <Link className={styles.backLink} href="/calendar">← All appearances</Link>
        <article className={styles.eventCard}>
          <p className={styles.eyebrow}>Daniel Franzese / Live dates</p>
          <h1 className={styles.heading} data-route-heading>{event.title}</h1>
          <div className={styles.facts}>
            <p className={styles.fact}>
              <span className={styles.factLabel}>Date &amp; time</span>
              <time dateTime={event.start}>
                {display.date}, {display.year}{event.allDay ? ' · All day' : ` · ${display.time}`}
              </time>
            </p>
            {event.location ? <p className={styles.fact}><span className={styles.factLabel}>Location</span>{getLocationLabel(event)}</p> : null}
            <p className={styles.fact} data-status={event.eventStatus}>
              <span className={styles.factLabel}>Event status</span>
              {eventStatusLabel}
            </p>
            {event.eventStatus === 'scheduled' || event.eventStatus === 'rescheduled'
              ? <p className={styles.fact}><span className={styles.factLabel}>Ticket status</span>{ticketStatusLabel}</p>
              : null}
          </div>
          {event.description ? <p className={styles.description}>{event.description}</p> : null}
          {delayed ? <p className={styles.notice} role="status">Event updates are delayed. Ticket actions are paused until the schedule is current.</p> : null}
          <div className={styles.actions}>
            {ticketAction ? <ActionLink href={ticketAction.href}>{ticketAction.label}</ActionLink> : <span className={styles.actionNote}>{getNeutralActionLabel(event, delayed)}</span>}
          </div>
        </article>
      </Container>
    </Section>
  )
}
