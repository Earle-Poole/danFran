import Link from 'next/link'
import { contacts, routeById, socialLinks } from 'lib/content'
import { shopEnabled, urls } from 'lib/constants'
import styles from './site.module.css'
import { AppearancesFooterLink } from './AppearancesFooterLink'

const bookingContact = contacts[0]

export default function Footer() {
  const year = new Date().getFullYear()
  const pressPath = routeById('press-kit')?.path ?? '/press-kit'

  return (
    <footer className={styles.footer}>
      <section className={styles.bookingBand} id="contact" aria-labelledby="footer-booking-heading">
        <div>
          <h2 className={styles.footerHeading} id="footer-booking-heading">Let’s make a scene.</h2>
          <p className={styles.footerCopy}>For appearances, speaking and creative collaborations.</p>
        </div>
        <div className={styles.footerActions}>
          <Link className={styles.inverseButton} href="/booking#booking-details">Book Daniel</Link>
          <Link className={styles.inverseTextLink} href={pressPath}>Press kit</Link>
          <a className={styles.inverseTextLink} href={bookingContact.email.destination}>Email booking contact</a>
        </div>
      </section>
      <nav className={styles.footerUtility} aria-label="Footer">
        <Link href="/about">About</Link>
        <AppearancesFooterLink />
        <Link href={routeById('videos')?.path ?? '/video-gallery'}>Videos</Link>
        <Link href={routeById('portraits')?.path ?? '/modeling-gallery'}>Portraits</Link>
        <Link href={pressPath}>Press kit</Link>
        {shopEnabled ? <a href={urls.STORE}>Shop</a> : null}
        <a href={urls.CAMEO}>Cameo</a>
        {socialLinks.map((social) => <a key={social.id} href={social.url}>{social.label}</a>)}
      </nav>
      <div className={styles.footerCredit}>
        <p>© {year} Daniel Franzese. All Rights Reserved.</p>
        <p>Website by <a href="https://github.com/margarita-poole">Margarita Poole</a></p>
      </div>
    </footer>
  )
}
