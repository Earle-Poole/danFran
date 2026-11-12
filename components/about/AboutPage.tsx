import { ActionLink, Container, Photo, Section } from '@/components/ui'
import { downloadById, selectedPhotos } from 'lib/constants'
import styles from './about.module.css'

const biographyDownload = downloadById('download-biography')
const [blueJacket, whiteShirt] = selectedPhotos

const screenWork = [
  { title: 'Mean Girls', detail: 'Damian', href: 'https://www.imdb.com/title/tt0377092/' },
  { title: 'Bully', detail: 'Lead role', href: 'https://www.imdb.com/title/tt0242193/' },
  { title: 'I Spit On Your Grave', detail: 'Film', href: 'https://www.imdb.com/title/tt1242432/' },
  { title: 'Looking', detail: 'Eddie', href: 'https://www.imdb.com/title/tt2581458/' },
  { title: 'Looking: The Movie', detail: 'Eddie', href: 'https://www.imdb.com/title/tt4552118/' },
  { title: 'Recovery Road', detail: 'Vern Testaverde', href: 'https://www.imdb.com/title/tt4144890/' },
  { title: 'Conviction', detail: 'Jackson Morrison', href: 'https://www.imdb.com/title/tt5396572/' },
  { title: "RuPaul's Secret Celebrity Drag Race", detail: 'Donna Bellissima', href: 'https://www.imdb.com/title/tt11187480/' },
] as const

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <Section aria-labelledby="about-heading">
        <Container className={styles.introGrid}>
          <div>
            <p className={styles.eyebrow}>Meet Daniel Franzese</p>
            <h1 id="about-heading" data-route-heading className={styles.pageHeading}>More than a familiar face.</h1>
            <p className={styles.introCopy}>
              Actor, comedian, writer, director, and activist, Daniel Franzese brings warmth, wit, and a singular point of view to the screen and stage.
            </p>
            <ActionLink href="#selected-work">Explore his work</ActionLink>
          </div>
          <Photo
            src={whiteShirt.originalPath}
            alt={whiteShirt.alt}
            width={whiteShirt.dimensions.width}
            height={whiteShirt.dimensions.height}
            sizes="(min-width: 48rem) 50vw, 100vw"
            objectPosition="48% 40%"
            loading="eager"
          />
        </Container>
      </Section>

      <Section tone="pink" className={styles.identityBand} aria-labelledby="about-identity-heading">
        <Container>
          <h2 id="about-identity-heading" className={styles.bandHeading}>A life in front of and beyond the camera.</h2>
        </Container>
      </Section>

      <Section aria-labelledby="biography-heading">
        <Container className={styles.readingLayout}>
          <div>
            <p className={styles.eyebrow}>The biography</p>
            <h2 id="biography-heading" className={styles.sectionHeading}>You might know him as Damian.</h2>
          </div>
          <div className={styles.prose}>
            <p>
              Best known for his role as Damian in{' '}
              <a href="https://www.imdb.com/title/tt0377092/">Mean Girls</a>, Daniel Franzese was also the lead of other indie cult classics, such as{' '}
              <a href="https://www.imdb.com/title/tt0242193/">Bully</a> and{' '}
              <a href="https://www.imdb.com/title/tt1242432/">I Spit On Your Grave</a>.
            </p>
            <p>
              He later starred as Eddie in HBO&apos;s <a href="https://www.imdb.com/title/tt2581458/">Looking</a>, including <a href="https://www.imdb.com/title/tt4552118/">Looking: The Movie</a>, before becoming a series regular as Vern Testaverde in the Freeform series <a href="https://www.imdb.com/title/tt4144890/">Recovery Road</a> and appearing as Jackson Morrison in ABC&apos;s legal drama <a href="https://www.imdb.com/title/tt5396572/">Conviction</a>.
            </p>
            <p>
              In 2022, he competed as Donna Bellissima on <a href="https://www.imdb.com/title/tt11187480/">RuPaul&apos;s Secret Celebrity Drag Race</a>. Born in Brooklyn and raised in Fort Lauderdale, Daniel has become a well-known proponent and speaker for the LGBTQ+ community, as well as an ambassador for The Elizabeth Taylor AIDS Foundation.
            </p>
            <p>
              A self-proclaimed momma&apos;s boy, his upbeat, high-energy stand-up comedy act, &apos;Yass! You&apos;re Amazing!&apos; captures his quirky life in the entertainment industry and hilarious stories about his New York parents.
            </p>
          </div>
        </Container>
      </Section>

      <Section id="selected-work" className={styles.selectedWork} aria-labelledby="selected-work-heading">
        <Container className={styles.readingLayout}>
          <div>
            <p className={styles.eyebrow}>Selected screen work</p>
            <h2 id="selected-work-heading" className={styles.sectionHeading}>Roles with range.</h2>
          </div>
          <ul className={styles.workList}>
            {screenWork.map((work) => (
              <li key={work.title}>
                <a href={work.href}>
                  <span className={styles.workTitle}>{work.title}</span>
                  <span className={styles.workDetail}>{work.detail}</span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section aria-labelledby="advocacy-heading">
        <Container className={styles.advocacyGrid}>
          <Photo
            src={blueJacket.originalPath}
            alt={blueJacket.alt}
            width={blueJacket.dimensions.width}
            height={blueJacket.dimensions.height}
            sizes="(min-width: 48rem) 50vw, 100vw"
            objectPosition="50% 42%"
          />
          <div>
            <p className={styles.eyebrow}>Advocacy & speaking</p>
            <h2 id="advocacy-heading" className={styles.sectionHeading}>A voice beyond the screen.</h2>
            <p className={styles.proseLead}>
              Daniel is a proponent and speaker for the LGBTQ+ community and an ambassador for The Elizabeth Taylor AIDS Foundation. His speaking and community work are part of the same open, energetic perspective he brings to entertainment.
            </p>
            <div className={styles.actions}>
              <ActionLink href="/booking#booking-details">Speaking & appearances</ActionLink>
              {biographyDownload ? <ActionLink href={biographyDownload.path} variant="secondary" download>Download biography</ActionLink> : null}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
