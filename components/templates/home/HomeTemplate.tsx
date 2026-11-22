import type { ReactNode } from 'react'
import Link from 'next/link'
import { ActionLink, Container, Photo, Section } from '@/components/ui'
import { shopEnabled, urls } from 'lib/constants'
import { featuredHeadshots, headshotPhotos } from 'lib/content/photos'
import { cameoProfile } from 'lib/content/contacts'
import { getHomeImageSrcSet, homeDestinationImageSizes } from 'lib/content/home-images'
import { AppearancesSection } from '@/components/appearances'
import { HomepageSectionAnalytics } from '@/components/site/HomepageSectionAnalytics'
import { HomeLiveBand } from './HomeLiveBand'
import { HomeLiveHero } from './HomeLiveHero'
import { HomeSpecialFeature } from './HomeSpecialFeature'
import { HomeSpotlight } from './HomeSpotlight'
import styles from './home.module.css'

export type HomeTemplateProps = {
  /** VIDEO supplies this after its NewsletterSection contract is integrated. */
  newsletterSection?: ReactNode
}

const { hero: heroPhoto, about: aboutPhoto, portraits: portraitPhoto, press: pressPhoto } = featuredHeadshots
const spotlightImages = {
  about: { photo: aboutPhoto, srcSet: getHomeImageSrcSet('about', aboutPhoto.dimensions.width) },
  portraits: { photo: portraitPhoto, srcSet: getHomeImageSrcSet('portraits', portraitPhoto.dimensions.width) },
  press: { photo: pressPhoto, srcSet: getHomeImageSrcSet('press', pressPhoto.dimensions.width) },
}

const destinations = [
  {
    href: '/about',
    title: 'About Daniel',
    description: 'Explore the story behind the familiar face.',
    photo: headshotPhotos[3],
    image: 'card-about',
    position: '50% 50%',
  },
  {
    href: '/modeling-gallery',
    title: 'Portrait gallery',
    description: 'See Daniel in focus, frame by frame.',
    photo: headshotPhotos[2],
    image: 'card-portraits',
    position: '47% 50%',
  },
  {
    href: '/press-kit',
    title: 'Press kit',
    description: 'Find biographies, photography, and contacts.',
    photo: headshotPhotos[5],
    image: 'card-press',
    position: '50% 22%',
  },
] as const

const HomeTemplate = ({ newsletterSection }: HomeTemplateProps) => {
  return (
    <div id="home" className={styles.page}>
      <HomeLiveHero photo={heroPhoto} srcSet={getHomeImageSrcSet('hero', heroPhoto.dimensions.width)} />
      <AppearancesSection />
      <HomeLiveBand />
      <HomeSpecialFeature />

      <Section aria-labelledby="destinations-heading">
        <Container>
          <h2 id="destinations-heading" className={styles.sectionHeading}>Meet the many sides of Daniel.</h2>
          <HomeSpotlight images={spotlightImages} />
          <div className={styles.destinationGrid} data-analytics-placement="home-photo-cards">
            {destinations.map(({ href, title, description, photo, image, position }) => (
              <Link className={styles.destinationCard} href={href} key={href}>
                <Photo
                  src={photo.originalPath}
                  srcSet={getHomeImageSrcSet(image, photo.dimensions.width)}
                  alt={photo.alt}
                  width={photo.dimensions.width}
                  height={photo.dimensions.height}
                  sizes={homeDestinationImageSizes}
                  frameRatio="5 / 4"
                  objectPosition={position}
                />
                <span className={styles.cardTitle}>{title}</span>
                <span className={styles.cardDescription}>{description}</span>
              </Link>
            ))}
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
            <ActionLink href="/about" data-analytics-placement="home-about">Read my full story</ActionLink>
          </div>
        </Container>
      </Section>

      <Section id="cameo" tone="ink" className={styles.fanServices} aria-labelledby="cameo-heading">
        <HomepageSectionAnalytics sectionId="cameo" />
        <Container className={styles.fanServicesInner}>
          <div>
            <p className={styles.eyebrow}>For fans</p>
            <h2 id="cameo-heading" className={styles.sectionHeading}>A message, just for them.</h2>
            <p>{cameoProfile.giftCopy}</p>
          </div>
          <div className={styles.actions} data-analytics-placement="home-fan-services">
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
