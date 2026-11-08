import type { AppearanceEvent } from 'lib/calendar/types'
import Link from 'next/link'
import { getAppearanceEventPath } from 'lib/calendar/event-links'
import { ActionLink } from '@/components/ui'
import { formatEventDate, getEventStatusLabel, getLocationLabel, getNeutralActionLabel, getTicketAction } from './helpers'
import styles from './appearances.module.css'

export function AppearanceEventRow({ event, delayed = false, showDescription = false }: { event: AppearanceEvent; delayed?: boolean; showDescription?: boolean }) {
  const display = formatEventDate(event)
  const action = getTicketAction(event, delayed)
  const eventPath = getAppearanceEventPath(event)

  return (
    <article className={styles.eventRow}>
      <div className={styles.eventDate} aria-label={`${display.date} ${display.year}`}>
        <time dateTime={event.start}>
          <span className={styles.eventMonth}>{display.month}</span>
          <span className={styles.eventDay}>{display.day}</span>
        </time>
      </div>
      <div className={styles.eventPrimary}>
        <h3 className={styles.eventTitle}>
          {eventPath ? <Link href={eventPath}>{event.title}</Link> : event.title}
        </h3>
      </div>
      <div className={styles.eventDetails}>
        <p className={styles.eventVenue}>{getLocationLabel(event)}</p>
        <p className={styles.eventMeta}>{display.time}</p>
        {showDescription && event.description ? <p className={styles.eventDescription}>{event.description}</p> : null}
      </div>
      <p className={styles.eventStatus} data-status={event.eventStatus}>
        <span aria-hidden="true" className={styles.statusDot} />
        {getEventStatusLabel(event)}
      </p>
      <div className={styles.eventAction}>
        {action ? (
          <ActionLink href={action.href} aria-label={`${action.label}: ${event.title}`}>
            {action.label}
          </ActionLink>
        ) : <span className={styles.eventActionNote}>{getNeutralActionLabel(event, delayed)}</span>}
      </div>
    </article>
  )
}
