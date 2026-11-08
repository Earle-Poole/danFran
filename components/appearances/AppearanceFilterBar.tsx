import type { AppearanceCategory, AppearanceEvent } from 'lib/calendar/types'
import { formatEventDate } from './helpers'
import styles from './appearances.module.css'

export type AppearanceFilter = 'all' | AppearanceCategory

const categoryLabels: Record<AppearanceCategory, string> = {
  comedy: 'Comedy',
  speaking: 'Speaking',
  appearance: 'Appearances',
}

export const getActiveAppearanceFilter = (
  events: AppearanceEvent[],
  value: AppearanceFilter,
): AppearanceFilter => value !== 'all' && !events.some((event) => event.category === value) ? 'all' : value

export function AppearanceFilterBar({
  events,
  value,
  onChange,
}: {
  events: AppearanceEvent[]
  value: AppearanceFilter
  onChange: (value: AppearanceFilter) => void
}) {
  const categories = Array.from(new Set(events.map((event) => event.category)))
  const meaningfulFilters = categories.length > 1
  const activeValue = getActiveAppearanceFilter(events, value)
  const countedEvents = activeValue === 'all' ? events : events.filter((event) => event.category === activeValue)
  const count = countedEvents.length
  const year = countedEvents.length ? ` · ${formatEventDate(countedEvents[0]).year}` : ''
  const countLabel = `${count} upcoming appearance${count === 1 ? '' : 's'}${year}`

  return (
    <div className={styles.toolbar}>
      <div className={styles.filters} role={meaningfulFilters ? 'group' : undefined} aria-label={meaningfulFilters ? 'Filter appearances' : undefined}>
        {meaningfulFilters ? (
          <>
            <button type="button" className={`${styles.filter} ${activeValue === 'all' ? styles.filterSelected : ''}`} aria-pressed={activeValue === 'all'} onClick={() => onChange('all')}>All appearances</button>
            {categories.map((category) => <button key={category} type="button" className={`${styles.filter} ${activeValue === category ? styles.filterSelected : ''}`} aria-pressed={activeValue === category} onClick={() => onChange(category)}>{categoryLabels[category]}</button>)}
          </>
        ) : <button type="button" className={`${styles.filter} ${styles.filterSelected}`} aria-pressed="true" onClick={() => onChange('all')}>All appearances</button>}
      </div>
      <p className={styles.listCount} aria-live="polite">{countLabel}</p>
    </div>
  )
}
