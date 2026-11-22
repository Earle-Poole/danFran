import type { AppearanceEvent } from 'lib/calendar/types'
import { AppearanceEventRow } from './AppearanceEventRow'
import styles from './appearances.module.css'

export function AppearanceList({ events, delayed = false, showDescription = false, featuredEventId }: {
  events: AppearanceEvent[]
  delayed?: boolean
  showDescription?: boolean
  featuredEventId?: string
}) {
  return (
    <div className={styles.eventList}>
      {events.map((event) => (
        <AppearanceEventRow key={event.id} event={event} delayed={delayed} showDescription={showDescription} featured={event.id === featuredEventId} />
      ))}
    </div>
  )
}
