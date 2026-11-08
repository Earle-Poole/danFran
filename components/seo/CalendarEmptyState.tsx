import { ActionLink, Container, Section } from '../ui'
import styles from './seo.module.css'

export function CalendarEmptyState() {
  return (
    <Section aria-labelledby="calendar-title">
      <Container>
        <div className={styles.emptyState}>
          <p className={styles.eyebrow}>Daniel Franzese / Appearances</p>
          <h1 id="calendar-title">Appearances</h1>
          <p className={styles.message}>Event listings aren’t available here yet.</p>
          <p>
            For updates, return to the home page. For professional appearance or speaking inquiries, contact the
            booking team.
          </p>
          <div className={styles.actions}>
            <ActionLink href="/#home" variant="primary">
              Home and updates
            </ActionLink>
            <ActionLink href="/#contact" variant="secondary">
              Booking inquiries
            </ActionLink>
          </div>
        </div>
      </Container>
    </Section>
  )
}
