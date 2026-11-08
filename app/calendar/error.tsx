'use client'

import { ActionLink, Button, Container, Section } from '@/components/ui'
import styles from '@/components/seo/seo.module.css'

export default function CalendarError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <Section aria-labelledby="calendar-error-title">
      <Container>
        <div className={styles.emptyState}>
          <p className={styles.eyebrow}>Daniel Franzese / Appearances</p>
          <h1 id="calendar-error-title" data-route-heading>Event updates are temporarily unavailable</h1>
          <p className={styles.message}>Please check back soon or contact the booking team for a professional appearance inquiry.</p>
          <div className={styles.actions}>
            <Button type="button" onClick={retry}>Try again</Button>
            <ActionLink href="/#contact" variant="secondary">Booking inquiries</ActionLink>
          </div>
        </div>
      </Container>
    </Section>
  )
}
