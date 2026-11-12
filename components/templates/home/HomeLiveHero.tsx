'use client'

import { ActionLink, Container, Photo, Section } from '@/components/ui'
import { useAppearanceFeed } from '@/components/appearances'
import type { PhotoRecord } from 'lib/content/types'
import styles from './home.module.css'

const homeHeroImageSizes = [
  '(min-width: 80rem) 35.5rem',
  '(min-width: 64rem) calc((100vw - 9rem) / 2)',
  '(min-width: 48rem) calc((100vw - 7rem) / 2)',
  'calc(100vw - 2rem)',
].join(', ')

// The compact live hero crops the square portrait to a taller frame.
const liveHeroImageSizes = '(max-width: 22.5rem) 128px, (max-width: 48rem) 155px, (max-width: 64rem) 300px, 352px'

export function HomeLiveHero({ photo: heroPhoto, srcSet }: { photo: PhotoRecord; srcSet: string }) {
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
        <Photo
          className={styles.heroPhoto}
          src={heroPhoto.originalPath}
          srcSet={srcSet}
          alt={heroPhoto.alt}
          width={heroPhoto.dimensions.width}
          height={heroPhoto.dimensions.height}
          crop="cover"
          frameRatio={hasAppearances ? '352 / 332' : undefined}
          objectPosition="50% 42%"
          sizes={hasAppearances ? liveHeroImageSizes : homeHeroImageSizes}
          loading="eager"
          fetchPriority="high"
          caption={hasAppearances ? 'ACTOR. COMEDIAN. STORYTELLER.' : undefined}
        />
      </Container>
    </Section>
  )
}
