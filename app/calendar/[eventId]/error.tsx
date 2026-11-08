'use client'

import { Container, Section } from '@/components/ui'
import styles from '@/components/appearances/event-detail.module.css'

export default function AppearanceEventError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <Section className={styles.eventSection}>
      <Container>
        <p className={styles.eyebrow}>Daniel Franzese / Appearances</p>
        <h1 className={styles.heading}>Schedule update unavailable</h1>
        <p className={styles.copy} role="status">We can’t confirm this event’s current details. Please check back soon.</p>
        <button className={styles.retryButton} type="button" onClick={retry}>Try again</button>
      </Container>
    </Section>
  )
}
