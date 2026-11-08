import Link from 'next/link'
import { ActionLink, Container } from '@/components/ui'
import { contacts, downloadById } from 'lib/content'
import PressGallery from '@/components/press/PressGallery'
import PressResourceText from '@/components/press/PressResourceText'
import styles from './PressKitTemplate.module.css'

const bookingContact = contacts[0]
const resources = [
  { id: 'download-biography', textVersionId: 'biography-text-version' },
  { id: 'download-yass-description', textVersionId: 'tour-text-version' },
] as const

const formatLabel = (format: string) => format.toUpperCase()
const sizeLabel = (bytes: number) => `${new Intl.NumberFormat('en-US').format(bytes)} bytes`

const PressKitTemplate = () => {
  return (
    <div id="press-kit" className={styles.pressKit}>
      <Container className={styles.pageHeader}>
        <p className={styles.eyebrow}>Press resources</p>
        <h1 className={styles.title} data-route-heading="true">Press kit.</h1>
        <p className={styles.subtitle}>Biographies, photography &amp; booking contacts.</p>
      </Container>

      <section id="press-resources" className={styles.biography} aria-labelledby="press-resources-heading">
        <Container>
          <h2 id="press-resources-heading" className={styles.sectionHeading}>Start with the downloads.</h2>
          <ul className={styles.resourceList}>
            {resources.map(({ id, textVersionId }) => {
              const resource = downloadById(id)
              if (!resource) return null
              return (
                <li key={resource.id} className={styles.resourceRow}>
                  <div>
                    <strong>{resource.label}</strong>
                    <span>{`${formatLabel(resource.format)} · ${sizeLabel(resource.bytes)}`}</span>
                  </div>
                  <div className={styles.resourceActions}>
                    <a href={resource.path} target="_blank" rel="noreferrer">Preview {formatLabel(resource.format)}</a>
                    <a href={resource.path} download>Download {resource.format.toUpperCase()}</a>
                    <a href={`#${textVersionId}`}>Read text version</a>
                  </div>
                </li>
              )
            })}
          </ul>
          <p className={styles.resourceNote}>
            The original PDFs are historical source files; the HTML versions below provide a keyboard-readable alternative while preserving the original downloads.
          </p>
        </Container>
      </section>

      <PressResourceText />

      <section className={styles.biography} aria-labelledby="press-biography-heading">
        <Container className={styles.copy}>
          <h2 id="press-biography-heading" className={styles.sectionHeading}>Biography</h2>
          <p>
            Best known for playing Damian in <a href="https://www.imdb.com/title/tt0377092/">Mean Girls</a>, Daniel Franzese has also appeared in <a href="https://www.imdb.com/title/tt0242193/">Bully</a>, <a href="https://www.imdb.com/title/tt2581458/">Looking</a>, <a href="https://www.imdb.com/title/tt4144890/">Recovery Road</a> and <a href="https://www.imdb.com/title/tt5396572/">Conviction</a>. His work spans film, television, stand-up comedy and advocacy.
          </p>
          <p>
            Born in Brooklyn and raised in Fort Lauderdale, Daniel is a proponent and speaker for the LGBTQ+ community and an ambassador for The Elizabeth Taylor AIDS Foundation. His existing biography PDF carries the longer source material; see <Link href="/about">the About page</Link> for the readable site biography.
          </p>
        </Container>
      </section>

      <PressGallery />

      <section className={styles.contact} aria-labelledby="press-contact-heading">
        <Container>
          <h2 id="press-contact-heading" className={styles.sectionHeading}>Press inquiries</h2>
          <p className={styles.contactIntro}>For interviews, invites and press materials, contact the representation listed below. Current representation and usage rights should be confirmed before release.</p>
          <div className={styles.contactDetails}>
            <p><strong>{bookingContact.name}</strong></p>
            <p><a href={bookingContact.email.destination}>{bookingContact.email.visible}</a></p>
            {bookingContact.phones.map((phone) => <p key={phone.destination}><a href={phone.destination}>{phone.visible}</a></p>)}
            <ul className={styles.categories}>
              {bookingContact.inquiryCategories.map((category) => <li key={category}>{category}</li>)}
            </ul>
            <ActionLink href={`/booking#booking-details`} variant="secondary">Booking details</ActionLink>
          </div>
        </Container>
      </section>
      </div>
  );
}

export default PressKitTemplate
