'use client'

import { ActionLink, Button, Container, Section } from '@/components/ui'
import styles from '@/components/seo/seo.module.css'

export default function AppError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <Section aria-labelledby="error-title">
      <Container>
        <div className={styles.emptyState}>
          <p className={styles.eyebrow}>Daniel Franzese</p>
          <h1 id="error-title" data-route-heading>Something went wrong</h1>
          <p className={styles.message}>This page couldn’t load. Please try again.</p>
          <div className={styles.actions}>
            <Button type="button" onClick={retry}>Try again</Button>
            <ActionLink href="/" variant="secondary">Return home</ActionLink>
          </div>
        </div>
      </Container>
    </Section>
  )
}
