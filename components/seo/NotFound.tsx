import { ActionLink, Container, Section } from '@/components/ui'
import styles from './seo.module.css'

export default function NotFound() {
  return (
    <Section aria-labelledby="not-found-title">
      <Container>
        <div className={styles.emptyState}>
          <p className={styles.eyebrow}>Daniel Franzese</p>
          <h1 id="not-found-title" data-route-heading>Page not found</h1>
          <p className={styles.message}>That page isn’t available, but there are useful places to continue.</p>
          <div className={styles.actions}>
            <ActionLink href="/" variant="primary">Home</ActionLink>
            <ActionLink href="/video-gallery" variant="secondary">Videos</ActionLink>
            <ActionLink href="/#contact" variant="secondary">Booking</ActionLink>
          </div>
        </div>
      </Container>
    </Section>
  )
}
