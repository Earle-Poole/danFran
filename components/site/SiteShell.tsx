import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import { RouteFocusManager } from './RouteFocusManager'
import styles from './site.module.css'

export { findFragmentTarget } from 'lib/accessibility/focus'

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell} id="top">
      <RouteFocusManager />
      <a className={styles.skipLink} href="#main-content">Skip to main content</a>
      <Header />
      <main id="main-content" className={styles.main} tabIndex={-1} data-shell-focus-target="true">{children}</main>
      <Footer />
    </div>
  )
}
