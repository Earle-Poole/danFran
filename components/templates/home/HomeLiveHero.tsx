'use client'

import { ActionLink, Container, Photo, Section } from '@/components/ui'
import { useAppearanceFeed } from '@/components/appearances'
import type { PhotoRecord } from 'lib/content/types'
import styles from './home.module.css'

export function HomeLiveHero({ photo: heroPhoto }: { photo: PhotoRecord }) {
  const { feed } = useAppearanceFeed()
  const hasAppearances = feed?.status === 'ready' && feed.events.length > 0

  return (
    <Section className={`${styles.hero} ${hasAppearances ? styles.heroPositive : ''}`} aria-labelledby="home-heading">
      <Container className={`${styles.heroGrid} ${hasAppearances ? styles.heroGridPositive : ''}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Actor / Comedian / Activist</p>
          <h1 id="home-heading" data-route-heading className={styles.homeName}>
            {hasAppearances ? <>Daniel<br />Franzese</> : 'Daniel Franzese'}
          </h1>
          <p className={styles.tagline}>Big heart. Bigger personality.</p>
          <p className={styles.intro}>
            {hasAppearances ? 'From the screen to the stage. Come spend an evening with Daniel.' : 'From Mean Girls to the comedy stage. Meet the many sides of Daniel.'}
          </p>
          <div className={styles.actions}>
            {hasAppearances ? <ActionLink href="#appearances">See Daniel live <span aria-hidden="true">↘</span></ActionLink> : null}
            <ActionLink href="/video-gallery" variant={hasAppearances ? 'secondary' : 'primary'}>Watch Daniel</ActionLink>
            {!hasAppearances ? <ActionLink href="/booking" variant="secondary">Booking inquiries</ActionLink> : null}
          </div>
        </div>
        <Photo className={styles.heroPhoto} src={heroPhoto.originalPath} alt={heroPhoto.alt} width={heroPhoto.dimensions.width} height={heroPhoto.dimensions.height} crop="cover" frameRatio={hasAppearances ? '352 / 332' : undefined} objectPosition="50% 42%" sizes="(min-width: 64rem) 50vw, 100vw" loading="eager" caption={hasAppearances ? 'ACTOR. COMEDIAN. STORYTELLER.' : undefined} />
      </Container>
    </Section>
  )
}
