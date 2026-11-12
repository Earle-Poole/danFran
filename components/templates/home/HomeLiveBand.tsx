'use client'

import { ActionLink, Container, Section } from '@/components/ui'
import { useAppearanceFeed } from '@/components/appearances'
import styles from './home.module.css'

export function HomeLiveBand() {
  const { feed } = useAppearanceFeed()
  const hasAppearances = feed?.status === 'ready' && feed.events.length > 0

  return hasAppearances ? (
    <Section tone="ink" className={styles.updatesBand} aria-labelledby="updates-heading">
      <Container className={styles.updatesInner}>
        <div>
          <p className={styles.eyebrow}>Don&apos;t miss your next night out</p>
          <h2 id="updates-heading" className={styles.updatesHeading}>Your city. His next stop.</h2>
          <p className={styles.updatesCopy}>Get new appearance announcements and updates from Daniel.</p>
        </div>
        <ActionLink href="#home-newsletter" variant="inverse">Keep me in the loop <span aria-hidden="true">→</span></ActionLink>
      </Container>
    </Section>
  ) : (
    <Section tone="pink" className={styles.identityBand} aria-labelledby="identity-heading">
      <Container>
        <h2 id="identity-heading" className={styles.bandHeading}>Actor. Comedian. Storyteller. Advocate.</h2>
      </Container>
    </Section>
  )
}
