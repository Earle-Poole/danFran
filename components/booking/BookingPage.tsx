import { ActionLink, Container, Photo, Section } from '@/components/ui'
import { contactById, selectedPhotos, urls } from 'lib/constants'
import { BookingContactActions } from './BookingContactActions'
import styles from './booking.module.css'

const bookingContact = contactById('advanced-management-booking')
const bookingPhoto = selectedPhotos[0]

export default function BookingPage() {
  const phone = bookingContact?.phones[0]

  if (!bookingContact || !phone) return null

  return (
    <div className={styles.page}>
      <Section aria-labelledby="booking-heading">
        <Container className={styles.introGrid}>
          <div>
            <p className={styles.eyebrow}>Professional inquiries</p>
            <h1 id="booking-heading" data-route-heading className={styles.pageHeading}>Let&apos;s work together.</h1>
            <p className={styles.introCopy}>
              For appearances, speaking engagements, and press invitations, reach Daniel&apos;s booking contact directly.
            </p>
            <p className={styles.introNote}>An inquiry starts a conversation; it does not reserve a date.</p>
          </div>
          <Photo
            src={bookingPhoto.originalPath}
            alt={bookingPhoto.alt}
            width={bookingPhoto.dimensions.width}
            height={bookingPhoto.dimensions.height}
            sizes="(min-width: 48rem) 50vw, 100vw"
            objectPosition="50% 42%"
            loading="eager"
          />
        </Container>
      </Section>

      <Section id="booking-details" className={styles.contactSection} aria-labelledby="booking-details-heading">
        <Container className={styles.contactGrid}>
          <div>
            <p className={styles.eyebrow}>Booking details</p>
            <h2 id="booking-details-heading" className={styles.sectionHeading}>Tell us what you&apos;re planning.</h2>
            <p className={styles.contactIntro}>Include the event or project type, date, location, and a short description in your message.</p>
          </div>
          <div className={styles.contactCard}>
            <p className={styles.contactName}>{bookingContact.name}</p>
            <BookingContactActions
              email={bookingContact.email.visible}
              emailHref={bookingContact.email.destination}
              phone={phone.visible}
              phoneHref={phone.destination}
              className={styles.contactActions}
              statusClassName={styles.copyStatus}
              linkClassName={styles.contactLink}
            />
          </div>
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="inquiries-heading">
        <Container className={styles.inquiriesGrid}>
          <div>
            <p className={styles.eyebrow}>Good to know</p>
            <h2 id="inquiries-heading" className={styles.sectionHeading}>What can we help with?</h2>
          </div>
          <ul className={styles.categoryList}>
            {bookingContact.inquiryCategories.map((category) => <li key={category}>{category}</li>)}
          </ul>
        </Container>
      </Section>

      <Section tone="ink" aria-labelledby="cameo-booking-heading">
        <Container className={styles.cameoBlock}>
          <div>
            <p className={styles.eyebrow}>A different kind of hello</p>
            <h2 id="cameo-booking-heading" className={styles.sectionHeading}>Looking for a personalized video?</h2>
            <p>That is a fan-service request, separate from professional booking.</p>
          </div>
          <ActionLink href={urls.CAMEO} variant="inverse">Find Daniel on Cameo</ActionLink>
        </Container>
      </Section>
    </div>
  )
}
