'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Logo from './Logo'
import Navigation, { NavigationHandle } from './Navigation'
import styles from './site.module.css'

export type HeaderHandle = { closeMenus: () => void }

const Header = forwardRef<HeaderHandle>(function Header(_, ref) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const workNavigationRef = useRef<NavigationHandle>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useImperativeHandle(ref, () => ({ closeMenus: () => { setMenuOpen(false); workNavigationRef.current?.close?.() } }), [])

  useEffect(() => {
    const closeMenus = () => {
      setMenuOpen(false)
      workNavigationRef.current?.close()
    }
    closeMenus()
    window.addEventListener('hashchange', closeMenus)
    return () => window.removeEventListener('hashchange', closeMenus)
  }, [pathname])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const media = window.matchMedia?.('(min-width: 48rem)')
    const handleBreakpoint = (event: MediaQueryListEvent) => {
      const active = document.activeElement as HTMLElement | null
      if (event.matches) {
        if (active?.closest('#compact-navigation')) {
          document.querySelector<HTMLButtonElement>('button[aria-controls="work-navigation"]')?.focus()
        }
        setMenuOpen(false)
        workNavigationRef.current?.close()
      } else {
        if (active?.closest('#work-navigation') || active?.matches('button[aria-controls="work-navigation"]')) {
          menuButtonRef.current?.focus()
        }
        workNavigationRef.current?.close()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    media?.addEventListener?.('change', handleBreakpoint)
    if (media && !media.addEventListener) media.addListener?.(handleBreakpoint)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      media?.removeEventListener?.('change', handleBreakpoint)
      if (media && !media.removeEventListener) media.removeListener?.(handleBreakpoint)
    }
  }, [menuOpen])

  return (
    <header className={styles.header} data-site-header>
      <div className={styles.headerInner}>
        <Logo />
        <div className={styles.headerActions}>
          <Link className={styles.bookLink} href="/booking#booking-details" onClick={() => setMenuOpen(false)}>Book Daniel</Link>
          <button ref={menuButtonRef} type="button" className={styles.menuButton} aria-expanded={menuOpen} aria-controls="compact-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? 'Close' : 'Menu'}
            <span className={`${styles.menuIcon} ${menuOpen ? styles.menuIconOpen : ''}`} aria-hidden="true"><span /></span>
          </button>
        </div>
        <Navigation ref={workNavigationRef} />
      </div>
      <div id="compact-navigation" data-open={menuOpen || undefined}>
        <Navigation compact onNavigate={() => setMenuOpen(false)} />
      </div>
    </header>
  )
})

export default Header
