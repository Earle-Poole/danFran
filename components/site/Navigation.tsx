'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { routeById } from 'lib/content'
import { shopEnabled, urls } from 'lib/constants'
import styles from './site.module.css'
import { useAppearanceFeed } from '@/components/appearances'

type NavigationProps = { compact?: boolean; onNavigate?: () => void }

export type NavigationHandle = { close: () => void }

const workRoutes = [
  { id: 'videos' as const, label: 'Videos' },
  { id: 'portraits' as const, label: 'Portraits' },
]

const getRoutePath = (id: 'videos' | 'portraits') => routeById(id)?.path ?? '#'

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
}

const Navigation = forwardRef<NavigationHandle, NavigationProps>(function Navigation({ compact = false, onNavigate }, ref) {
  const pathname = usePathname() ?? '/'
  const [workOpen, setWorkOpen] = useState(false)
  const [hasHydrated, setHasHydrated] = useState(false)
  const [currentHash, setCurrentHash] = useState('')
  const { feed } = useAppearanceFeed()
  const workRef = useRef<HTMLLIElement>(null)
  const currentPath = pathname === '/home' ? '/' : pathname
  const workActive = workRoutes.some(({ id }) => isActivePath(currentPath, getRoutePath(id)))
  const aboutActive = currentPath === '/about' || (hasHydrated && currentPath === '/' && currentHash.includes('#about'))
  const pressPath = routeById('press-kit')?.path ?? '/press-kit'
  const pressActive = isActivePath(currentPath, pressPath)
  const bookingActive = currentPath === '/booking' || (hasHydrated && currentHash.includes('#contact'))
  const appearancesAvailable = feed?.status === 'ready' && feed.events.length > 0

  useImperativeHandle(ref, () => ({ close: () => setWorkOpen(false) }), [])

  useEffect(() => {
    setHasHydrated(true)
    const updateHash = () => setCurrentHash(window.location.hash)
    updateHash()
    window.addEventListener('hashchange', updateHash)
    window.addEventListener('popstate', updateHash)
    return () => {
      window.removeEventListener('hashchange', updateHash)
      window.removeEventListener('popstate', updateHash)
    }
  }, [])

  useEffect(() => {
    if (compact || !workOpen) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!workRef.current?.contains(event.target as Node)) setWorkOpen(false)
    }
    const handleFocusIn = (event: FocusEvent) => {
      if (!workRef.current?.contains(event.target as Node)) setWorkOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setWorkOpen(false)
        workRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [compact, workOpen])

  const navigate = () => {
    setWorkOpen(false)
    onNavigate?.()
  }

  if (compact) {
    return (
      <nav aria-label="Primary" className={styles.compactMenu}>
        <ul className={styles.compactNavList}>
          <li className={styles.workLabel}>Work</li>
          {workRoutes.map(({ id, label }) => {
            const href = getRoutePath(id)
            const active = isActivePath(currentPath, href)
            return <li key={id}><Link className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`} href={href} aria-current={active ? 'page' : undefined} onClick={navigate}>{label}</Link></li>
          })}
          <li><Link className={`${styles.navLink} ${aboutActive ? styles.navLinkActive : ''}`} href="/about" aria-current={aboutActive ? 'page' : undefined} onClick={navigate}>About</Link></li>
          {appearancesAvailable ? <li><Link className={styles.navLink} href="/calendar" onClick={navigate}>Live dates</Link></li> : null}
          <li><Link className={`${styles.navLink} ${pressActive ? styles.navLinkActive : ''}`} href={pressPath} aria-current={pressActive ? 'page' : undefined} onClick={navigate}>Press</Link></li>
          {shopEnabled ? <li><a className={styles.navLink} href={urls.STORE} onClick={navigate}>Shop</a></li> : null}
          <li><Link className={`${styles.navLink} ${bookingActive ? styles.navLinkActive : ''}`} href="/booking#booking-details" aria-current={bookingActive ? 'page' : undefined} onClick={navigate}>Book Daniel</Link></li>
        </ul>
      </nav>
    )
  }

  return (
    <nav aria-label="Primary" className={styles.desktopNav}>
      <ul className={styles.desktopNavList}>
        <li ref={workRef} className={styles.workItem}>
          <button type="button" className={`${styles.disclosureButton} ${workActive ? styles.navLinkActive : ''}`} aria-expanded={workOpen} aria-controls="work-navigation" onClick={() => setWorkOpen((open) => !open)}>Work <span aria-hidden="true">⌄</span></button>
          <ul id="work-navigation" className={`${styles.workList} ${workOpen ? styles.workListOpen : ''}`}>
            {workRoutes.map(({ id, label }) => {
              const href = getRoutePath(id)
              const active = isActivePath(currentPath, href)
              return <li key={id}><Link className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`} href={href} aria-current={active ? 'page' : undefined} onClick={navigate}>{label}</Link></li>
            })}
            <li><Link className={styles.navLink} href="/about#selected-work" onClick={navigate}>Selected screen work</Link></li>
          </ul>
        </li>
        <li><Link className={`${styles.navLink} ${aboutActive ? styles.navLinkActive : ''}`} href="/about" aria-current={aboutActive ? 'page' : undefined} onClick={navigate}>About</Link></li>
        {appearancesAvailable ? <li><Link className={styles.navLink} href="/calendar" onClick={navigate}>Live dates</Link></li> : null}
        <li><Link className={`${styles.navLink} ${pressActive ? styles.navLinkActive : ''}`} href={pressPath} aria-current={pressActive ? 'page' : undefined} onClick={navigate}>Press</Link></li>
        {shopEnabled ? <li><a className={styles.navLink} href={urls.STORE} onClick={navigate}>Shop</a></li> : null}
        <li><Link className={`${styles.bookLink} ${bookingActive ? styles.navLinkActive : ''}`} href="/booking#booking-details" aria-current={bookingActive ? 'page' : undefined} onClick={navigate}>Book Daniel</Link></li>
      </ul>
    </nav>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation
