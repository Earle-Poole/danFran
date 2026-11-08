'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Container, Section } from '@/components/ui'
import { useAppearanceFeed } from './AppearanceProvider'
import { AppearanceList } from './AppearanceList'
import { AppearanceFilterBar, getActiveAppearanceFilter, type AppearanceFilter } from './AppearanceFilterBar'
import styles from './appearances.module.css'

export function AppearancesSection() {
  const { feed, delayed } = useAppearanceFeed()
  const [filter, setFilter] = useState<AppearanceFilter>('all')
  if (!feed || feed.status !== 'ready' || feed.events.length === 0) return null
  const sourceEvents = feed.events.slice(0, 4)
  const activeFilter = getActiveAppearanceFilter(sourceEvents, filter)
  const visibleEvents = activeFilter === 'all' ? sourceEvents : sourceEvents.filter((event) => event.category === activeFilter)

  return (
    <Section id="appearances" className={styles.appearancesSection} aria-labelledby="appearances-heading">
      <Container>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>On stage / In person</p>
            <h2 id="appearances-heading" className={styles.sectionHeading}>Let&apos;s make a night of it.</h2>
          </div>
          <p className={styles.sectionIntro}>Comedy, conversations, and a little Daniel energy. Find your next night out.</p>
        </div>
        {delayed ? <p className={styles.delayedNotice} role="status">Event updates are delayed. Ticket actions are paused until the schedule is current.</p> : null}
        <AppearanceFilterBar events={sourceEvents} value={filter} onChange={setFilter} />
        <AppearanceList events={visibleEvents} delayed={delayed} />
        <div className={styles.sectionBottom}>
          <p className={styles.timezoneNote}>All times are local to the venue.</p>
          <Link className={styles.scheduleLink} href="/calendar">View full schedule <span aria-hidden="true">→</span></Link>
        </div>
      </Container>
    </Section>
  )
}
