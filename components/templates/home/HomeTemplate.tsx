import type { ReactNode } from 'react'
import Link from 'next/link'
import { ActionLink, Container, Photo, Section } from '@/components/ui'
import { selectedPhotos, shopEnabled, urls } from 'lib/constants'
import { cameoProfile } from 'lib/content/contacts'
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
              <span className={styles.cardTitle}>About Daniel</span>
              <span className={styles.cardDescription}>Explore the story behind the familiar face.</span>
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
              <span className={styles.cardTitle}>Portrait gallery</span>
              <span className={styles.cardDescription}>See Daniel in focus, frame by frame.</span>
            </Link>
            <Link className={styles.destinationCard} href="/press-kit">
              <Photo
                src={pressPhoto.originalPath}
                srcSet={getHomeImageSrcSet('press', pressPhoto.dimensions.width)}
                alt={pressPhoto.alt}
                width={pressPhoto.dimensions.width}
                height={pressPhoto.dimensions.height}
                sizes={homeDestinationImageSizes}
                objectPosition="68% 50%"
              />
              <span className={styles.cardTitle}>Press kit</span>
              <span className={styles.cardDescription}>Find biographies, photography, and contacts.</span>
            </Link>
          </div>
        </Container>
      </Section>

      <Section id="about" tone="paper" className={styles.aboutPreview} aria-labelledby="about-preview-heading">
        <Container className={styles.aboutGrid}>
          <div>
            <p className={styles.eyebrow}>Actor, writer, director, comedian &amp; activist</p>
            <h2 id="about-preview-heading" className={styles.sectionHeading}>More than a familiar face.</h2>
          </div>
          <div className={styles.readingColumn}>
            <p>
              Hi, I’m Daniel Franzese! (That’s Fran-ZAY-see, thankyouverymuch.) I’m best known as Damian, the gay bestie you always wanted, in Tina Fey’s cult classic “Mean Girls,” and as Eddie in HBO’s “Looking.”
            </p>
            <p>
              I’ve taken my stand-up all over the country and created “Jersey Shoresical: A Frickin’ Rock Opera!” My newest is the stand-up special “It’s Not Easy,” all about dating, fame, and growing up with my outspoken Italian mother.
            </p>
            <ActionLink href="/about">Read my full story</ActionLink>
          </div>
        </Container>
      </Section>

      <Section id="cameo" tone="ink" className={styles.fanServices} aria-labelledby="cameo-heading">
        <Container className={styles.fanServicesInner}>
          <div>
            <p className={styles.eyebrow}>For fans</p>
            <h2 id="cameo-heading" className={styles.sectionHeading}>A message, just for them.</h2>
            <p>{cameoProfile.giftCopy}</p>
          </div>
          <div className={styles.actions}>
            <ActionLink href={urls.CAMEO} variant="inverse">{cameoProfile.giftLabel}</ActionLink>
            {shopEnabled ? <ActionLink href={urls.STORE} variant="inverse-text">Visit the shop</ActionLink> : null}
          </div>
        </Container>
      </Section>

      {newsletterSection ? <div className={styles.newsletterSlot}>{newsletterSection}</div> : null}
    </div>
  )
}

export default HomeTemplate
