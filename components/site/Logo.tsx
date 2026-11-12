import Link from 'next/link'
import styles from './site.module.css'

export default function Logo() {
  return (
    <Link className={styles.identity} href="/" aria-label="DF. — Daniel Franzese Home">
      DF<span className={styles.identityDot}>.</span>
    </Link>
  )
}
