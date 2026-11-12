import type { ReactNode } from 'react'
import Link from 'next/link'
import { ActionLink, Container, Photo, Section } from '@/components/ui'
import { selectedPhotos, shopEnabled, urls } from 'lib/constants'
import { getHomeImageSrcSet, homeDestinationImageSizes } from 'lib/content/home-images'
import { AppearancesSection } from '@/components/appearances'
import { HomeLiveBand } from './HomeLiveBand'
import { HomeLiveHero } from './HomeLiveHero'
import styles from './home.module.css'

export type HomeTemplateProps = {
  /** VIDEO supplies this after its NewsletterSection contract is integrated. */
  newsletterSection?: ReactNode
}

const [heroPhoto, aboutPhoto, portraitPhoto, pressPhoto] = selectedPhotos

const HomeTemplate = ({ newsletterSection }: HomeTemplateProps) => {
  return (
    <div id="home" className={styles.page}>
      <HomeLiveHero photo={heroPhoto} srcSet={getHomeImageSrcSet('hero', heroPhoto.dimensions.width)} />
      <AppearancesSection />
      <HomeLiveBand />

      <Section aria-labelledby="destinations-heading">
        <Container>
          <p className={styles.eyebrow}>Selected destinations</p>
          <h2 id="destinations-heading" className={styles.sectionHeading}>Meet the many sides of Daniel.</h2>
          <div className={styles.destinationGrid}>
            <Link className={styles.destinationCard} href="/about">
              <Photo
                src={aboutPhoto.originalPath}
                srcSet={getHomeImageSrcSet('about', aboutPhoto.dimensions.width)}
                alt={aboutPhoto.alt}
                width={aboutPhoto.dimensions.width}
                height={aboutPhoto.dimensions.height}
                sizes={homeDestinationImageSizes}
                objectPosition="50% 40%"
              />
              <span className={styles.cardCopy}>
                <span className={styles.cardTitle}>About Daniel</span>
                <span>Explore the story behind the familiar face.</span>
              </span>
            </Link>
            <Link className={styles.destinationCard} href="/modeling-gallery">
              <Photo
                src={portraitPhoto.originalPath}
                srcSet={getHomeImageSrcSet('portraits', portraitPhoto.dimensions.width)}
                alt={portraitPhoto.alt}
                width={portraitPhoto.dimensions.width}
                height={portraitPhoto.dimensions.height}
                sizes={homeDestinationImageSizes}
                objectPosition="50% 38%"
              />
              <span className={styles.cardCopy}>
                <span className={styles.cardTitle}>Portrait gallery</span>
                <span>See Daniel in focus, frame by frame.</span>
              </span>
            </Link>
            <Link className={styles.destinationCard} href="/press-kit">
              <Photo
                src={pressPhoto.originalPath}
                srcSet={getHomeImageSrcSet('press', pressPhoto.dimensions.width)}
                alt={pressPhoto.alt}
                width={pressPhoto.dimensions.width}
                height={pressPhoto.dimensions.height}
                crop="cover"
                sizes={homeDestinationImageSizes}
                objectPosition="68% 50%"
              />
              <span className={styles.cardCopy}>
                <span className={styles.cardTitle}>Press kit</span>
                <span>Find biographies, photography, and contacts.</span>
              </span>
            </Link>
          </div>
        </Container>
      </Section>

      <Section id="about" tone="paper" className={styles.aboutPreview} aria-labelledby="about-preview-heading">
        <Container className={styles.aboutGrid}>
          <div>
            <p className={styles.eyebrow}>A little more Daniel</p>
            <h2 id="about-preview-heading" className={styles.sectionHeading}>More than a familiar face.</h2>
          </div>
          <div className={styles.readingColumn}>
            <p>
              Daniel Franzese is an actor, comedian, writer, director, and activist known for bringing a big-hearted energy to every room. You may know him as Damian in Mean Girls, or from Bully, Looking, Recovery Road, and his live comedy.
            </p>
            <p>
              Read the full biography, selected screen work, and advocacy story on the About page.
            </p>
            <ActionLink href="/about">Read Daniel&apos;s story</ActionLink>
          </div>
        </Container>
      </Section>

      <Section id="cameo" tone="ink" className={styles.fanServices} aria-labelledby="cameo-heading">
        <Container className={styles.fanServicesInner}>
          <div>
            <p className={styles.eyebrow}>For fans</p>
            <h2 id="cameo-heading" className={styles.sectionHeading}>A message, just for you.</h2>
            <p>{shopEnabled ? 'Find personalized videos on Cameo and merch in the shop.' : 'Get a personalized video from Daniel on Cameo.'}</p>
          </div>
          <div className={styles.actions}>
            <ActionLink href={urls.CAMEO} variant="inverse">Find Daniel on Cameo</ActionLink>
            {shopEnabled ? <ActionLink href={urls.STORE} variant="inverse-text">Visit the shop</ActionLink> : null}
          </div>
        </Container>
      </Section>

      {newsletterSection ? <div className={styles.newsletterSlot}>{newsletterSection}</div> : null}
    </div>
  )
}

export default HomeTemplate
