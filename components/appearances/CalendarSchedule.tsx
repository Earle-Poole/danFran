'use client'

import { useState } from 'react'
import { Container, Section } from '@/components/ui'
import { useAppearanceFeed } from './AppearanceProvider'
import { AppearanceList } from './AppearanceList'
import { AppearanceFilterBar, getActiveAppearanceFilter, type AppearanceFilter } from './AppearanceFilterBar'
import styles from './appearances.module.css'

export function CalendarSchedule() {
  const { feed, delayed } = useAppearanceFeed()
  const [filter, setFilter] = useState<AppearanceFilter>('all')

  if (!feed || feed.status === 'unavailable') {
    return (
      <Section className={styles.calendarSection} aria-labelledby="calendar-title">
        <Container><div className={styles.calendarState}><p className={styles.eyebrow}>Daniel Franzese / Appearances</p><h1 id="calendar-title" data-route-heading>Appearances</h1><p>Event updates are temporarily unavailable. Please check back soon or contact the booking team for a professional appearance inquiry.</p></div></Container>
      </Section>
    )
  }

  if (feed.events.length === 0) {
    return (
      <Section className={styles.calendarSection} aria-labelledby="calendar-title">
        <Container><div className={styles.calendarState}><p className={styles.eyebrow}>Daniel Franzese / Appearances</p><h1 id="calendar-title" data-route-heading>Appearances</h1><p>There are no upcoming appearances listed right now. Check back for new dates.</p></div></Container>
      </Section>
    )
  }

  return (
    <Section className={styles.calendarSection} aria-labelledby="calendar-title">
      <Container>
        <div className={styles.calendarHeader}>
          <p className={styles.eyebrow}>Daniel Franzese / Live dates</p>
          <h1 id="calendar-title" data-route-heading>Appearances</h1>
          <p>Upcoming comedy, speaking, and appearance dates. Times are shown in each venue’s local timezone.</p>
          <p className={styles.lookahead}>Showing the upcoming dates currently on Daniel’s schedule.</p>
        </div>
        {delayed ? <p className={styles.delayedNotice} role="status">Event updates are delayed. Ticket actions are paused until the schedule is current.</p> : null}
        <AppearanceFilterBar events={feed.events} value={filter} onChange={setFilter} />
        <AppearanceList events={getActiveAppearanceFilter(feed.events, filter) === 'all' ? feed.events : feed.events.filter((event) => event.category === getActiveAppearanceFilter(feed.events, filter))} delayed={delayed} showDescription />
      </Container>
    </Section>
  )
}
