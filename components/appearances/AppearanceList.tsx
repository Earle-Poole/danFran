import type { AppearanceEvent } from 'lib/calendar/types'
import { AppearanceEventRow } from './AppearanceEventRow'
import styles from './appearances.module.css'

export function AppearanceList({ events, delayed = false, showDescription = false }: { events: AppearanceEvent[]; delayed?: boolean; showDescription?: boolean }) {
  return (
    <div className={styles.eventList}>
      {events.map((event) => <AppearanceEventRow key={event.id} event={event} delayed={delayed} showDescription={showDescription} />)}
    </div>
  )
}
