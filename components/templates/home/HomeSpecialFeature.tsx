import Link from 'next/link'
import { MiniDiscArtwork } from '@/components/special/MiniDiscArtwork'
import { HomepageSectionAnalytics } from '@/components/site/HomepageSectionAnalytics'
import { Container, Section } from '@/components/ui'
import styles from './HomeSpecialFeature.module.css'

export function HomeSpecialFeature() {
  return (
    <Section className={styles.feature} id="comedy-special" aria-labelledby="home-special-heading" data-analytics-placement="home-special-feature">
      <HomepageSectionAnalytics sectionId="comedy-special" />
      <Container>
        <div className={styles.card}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Daniel’s stand-up special</p>
            <h2 id="home-special-heading">It’s Not Easy</h2>
            <p className={styles.intro}>Dating, fame, and growing up with an Italian mom who has opinions.</p>
            <Link className={styles.watch} href="/special#opening-number">
              <span className={styles.play} aria-hidden="true" />
              Watch the teaser
            </Link>
            <details className={styles.peek} data-analytics-special-sleeve>
              <summary><span className={styles.peekIcon} aria-hidden="true" /> Peek inside the sleeve</summary>
              <p>Daniel mixes stand-up with two original songs and makes the case for why Pompeii scares him more than any horror movie.</p>
            </details>
          </div>
          <div className={styles.artwork} aria-hidden="true">
            <MiniDiscArtwork />
            <span className={styles.sparkles} />
          </div>
        </div>
      </Container>
    </Section>
  )
}
