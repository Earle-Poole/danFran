import type { Metadata } from 'next'
import Image from 'next/image'
import { ActionLink, Container, Section } from '@/components/ui'
import { urls } from 'lib/constants'
import { specialTeaserPosterPath } from 'lib/content/downloads'
import { getConfiguredOrigin, getDeploymentEnvironment } from 'lib/seo/origin'
import { CopySpecialLink } from './CopySpecialLink'
import { TeaserPlayer } from './TeaserPlayer'
import styles from './special.module.css'

const title = 'It’s Not Easy | Daniel Franzese'
const description = 'Watch the opening number from It’s Not Easy, a comedy special by Daniel Franzese.'
const specialUrl = 'https://www.whatsupdanny.com/special'
const vimeoUrl = 'https://vimeo.com/1232382902/2668cca1d1'
const vimeoPlayerUrl = 'https://player.vimeo.com/video/1232382902?h=2668cca1d1&autoplay=1'
const origin = getConfiguredOrigin()

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: getDeploymentEnvironment() === 'production' },
  ...(origin && {
    alternates: { canonical: `${origin}/special` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${origin}/special`,
      images: [{ url: `${origin}${specialTeaserPosterPath}`, width: 1280, height: 720, alt: 'It’s Not Easy, a comedy special by Daniel Franzese' }],
    },
  }),
}

function publicLink(value: string | undefined) {
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null
  } catch {
    return null
  }
}

export default function SpecialPage() {
  const youtubeUrl = publicLink(process.env.SPECIAL_YOUTUBE_URL)
  const signupUrl = publicLink(process.env.SPECIAL_SIGNUP_URL)
  const photosUrl = publicLink(process.env.SPECIAL_PHOTOS_URL)

  return (
    <>
      <section className={styles.hero} aria-labelledby="special-title">
        <Container className={styles.heroLayout}>
          <div>
            <p className={`${styles.overline} ${styles.heroOverline}`}>A comedy special by Daniel Franzese</p>
            <h1 id="special-title" className={styles.title} data-route-heading>
              It’s Not <span className="block text-pink">Easy</span>
            </h1>
            <p className="mt-4 font-editorial text-tagline">You found the mini CD.</p>
            <p className="mt-2 max-w-[26rem] text-[#eee3e9]">
              Thanks for celebrating with me. Here’s a first look at my new comedy special, starting with the opening number.
            </p>
            <a className={styles.teaserLink} href="#opening-number">
              Watch the teaser
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className="shrink-0">
                <path d="M12 4v15m-6-6 6 6 6-6" />
              </svg>
            </a>
          </div>
          <div className={styles.portrait}>
            <picture>
              <source media="(max-width: 24rem)" srcSet="/assets/derived/home/hero-320.webp" />
              <Image className={styles.portraitImage} src="/assets/derived/home/hero-600.webp" width={600} height={600} loading="eager" fetchPriority="high" alt="Daniel Franzese in a blue suit, lit in pink and blue" />
            </picture>
          </div>
        </Container>
      </section>

      <Section id="opening-number" className={`${styles.screening} !pb-0 !pt-[clamp(2.6rem,5.5vw,4.75rem)]`} aria-labelledby="opening-number-title">
        <Container>
          <h2 id="opening-number-title" className="font-display text-section uppercase leading-tight">The Opening Number</h2>
          <p className="mb-6 mt-2 text-muted">Your first look at <i>It’s Not Easy</i>.</p>
          <div className={styles.screeningLayout}>
            <TeaserPlayer embedUrl={vimeoPlayerUrl} watchUrl={vimeoUrl}>
              <Image src={specialTeaserPosterPath} alt="" width={1280} height={720} className="aspect-video w-full object-cover" />
            </TeaserPlayer>

            <aside className={styles.releaseCard} aria-labelledby="release-title">
              <p className={`${styles.overline} text-raspberry`}>{youtubeUrl ? 'Now on YouTube' : 'Coming to YouTube'}</p>
              <h3 id="release-title" className="mb-2 mt-3 font-display text-[clamp(1.9rem,3vw,2.75rem)] leading-tight">
                {youtubeUrl ? 'Watch the full special' : signupUrl ? 'Get the release link' : 'The full special'}
              </h3>
              {youtubeUrl ? (
                <ActionLink className="mt-3 self-start" href={youtubeUrl}>Watch on YouTube</ActionLink>
              ) : signupUrl ? (
                <>
                  <p className="text-muted">Get an email when the full special is available to watch.</p>
                  <ActionLink className="mt-4 self-start" href={signupUrl}>Notify me</ActionLink>
                </>
              ) : (
                <p className="text-muted">Check back here for the link to watch.</p>
              )}
              <CopySpecialLink url={youtubeUrl ?? specialUrl} label={youtubeUrl ? 'Copy video link' : 'Copy page link'} />
            </aside>
          </div>
        </Container>
      </Section>

      <Container className="my-[clamp(2.5rem,5vw,4.25rem)]">
        <div className="grid divide-y divide-rule border-y border-rule medium:grid-cols-2 medium:divide-x medium:divide-y-0">
          <section className="py-6 medium:pr-6" aria-labelledby="photos-title">
            <h2 id="photos-title" className={styles.extraTitle}>Premiere Photos</h2>
            {photosUrl ? (
              <ActionLink className="mt-1" variant="text" href={photosUrl}>View the LA premiere photos</ActionLink>
            ) : (
              <p className="mt-2 text-muted">Check back for photos from the LA red carpet.</p>
            )}
          </section>
          <section className="py-6 medium:pl-8" aria-labelledby="cameo-title">
            <h2 id="cameo-title" className={styles.extraTitle}>Make Someone’s Day</h2>
            <p className="mt-2 text-muted">Send someone a personalized video from Daniel.</p>
            <ActionLink variant="text" href={urls.CAMEO}>Find Daniel on Cameo</ActionLink>
          </section>
        </div>
      </Container>
    </>
  )
}
