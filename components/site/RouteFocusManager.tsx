'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { findFragmentTarget } from 'lib/accessibility/focus'

const focusElement = (element: HTMLElement, preventScroll = false) => {
  if (!element.matches('a,button,input,select,textarea,[tabindex]')) {
    element.tabIndex = -1
    element.dataset.shellFocusTarget = 'true'
  }
  element.focus({ preventScroll })
}

const getHeadingTarget = () =>
  document.querySelector<HTMLElement>('main [data-route-heading], main h1, main h2') ??
  document.getElementById('main-content')

export function RouteFocusManager() {
  const pathname = usePathname() ?? '/'
  const mainRef = useRef<HTMLElement | null>(null)
  const previousPathRef = useRef<string | null>(null)
  const isPopStateRef = useRef(false)

  useEffect(() => {
    mainRef.current = document.getElementById('main-content')
    const updateAnchorOffset = () => {
      const header = document.querySelector<HTMLElement>('[data-site-header]')
      if (!header) return
      const offset = header.getBoundingClientRect().height + 16
      document.documentElement.style.setProperty('--shell-anchor-offset', `${offset}px`)
      document.documentElement.style.scrollPaddingTop = `${offset}px`
    }
    updateAnchorOffset()
    window.addEventListener('resize', updateAnchorOffset)
    return () => {
      window.removeEventListener('resize', updateAnchorOffset)
      document.documentElement.style.removeProperty('--shell-anchor-offset')
      document.documentElement.style.removeProperty('scroll-padding-top')
    }
  }, [])

  useEffect(() => {
    let fragmentObserver: MutationObserver | null = null
    let fragmentFrame: number | null = null
    let pendingFragmentPath: string | null = null
    let pendingFragmentHash: string | null = null

    const cancelPendingFragmentFocus = () => {
      fragmentObserver?.disconnect()
      fragmentObserver = null
      if (fragmentFrame !== null) window.cancelAnimationFrame(fragmentFrame)
      fragmentFrame = null
      pendingFragmentPath = null
      pendingFragmentHash = null
    }

    const queueFragmentFocus = (hash: string, expectedPath = pathname) => {
      cancelPendingFragmentFocus()
      pendingFragmentPath = expectedPath
      pendingFragmentHash = hash

      const attempt = (): 'done' | 'wait' => {
        if (window.location.pathname !== expectedPath || window.location.hash !== hash) return 'done'
        const target = findFragmentTarget(hash)
        if (!target) return 'wait'

        target.scrollIntoView({ block: 'start', behavior: 'auto' })
        focusElement(target, true)
        fragmentObserver?.disconnect()
        fragmentObserver = null

        // Native fragment restoration and hydration can both happen after the
        // first commit. Reassert focus once the browser has painted that commit.
        fragmentFrame = window.requestAnimationFrame(() => {
          fragmentFrame = null
          if (
            window.location.pathname === expectedPath &&
            window.location.hash === hash &&
            target.isConnected &&
            document.activeElement !== target
          ) {
            focusElement(target, true)
          }
        })
        return 'done'
      }

      fragmentFrame = window.requestAnimationFrame(() => {
        fragmentFrame = null
        if (attempt() === 'done') return

        fragmentObserver = new MutationObserver(() => {
          if (attempt() === 'done') cancelPendingFragmentFocus()
        })
        fragmentObserver.observe(document.documentElement, { childList: true, subtree: true })
        // Close the gap between the first lookup and observer registration.
        if (attempt() === 'done') cancelPendingFragmentFocus()
      })
    }

    const handlePopState = () => {
      isPopStateRef.current = true
      if (window.location.hash) queueFragmentFocus(window.location.hash, window.location.pathname)
      else cancelPendingFragmentFocus()
      window.requestAnimationFrame(() => { isPopStateRef.current = false })
    }
    const handleHashChange = () => {
      if (window.location.hash) queueFragmentFocus(window.location.hash, window.location.pathname)
      else cancelPendingFragmentFocus()
      isPopStateRef.current = false
    }
    const handleAnchorClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest<HTMLAnchorElement>('a[href]')
      if (!anchor) return
      const destination = new URL(anchor.href, window.location.href)
      if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || !destination.hash) return
      queueFragmentFocus(destination.hash, destination.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handleHashChange)
    document.addEventListener('click', handleAnchorClick)

    const previousPath = previousPathRef.current
    previousPathRef.current = pathname
    if (previousPath === null) {
      // `usePathname()` can still be settling during the first hydration pass.
      // Resolve a direct-entry fragment against the browser's actual URL.
      if (window.location.hash) queueFragmentFocus(window.location.hash, window.location.pathname)
      return () => {
        // React Strict Mode replays mount effects in development. Preserve a
        // still-current initial fragment intent across that same-URL cleanup.
        if (window.location.pathname !== pendingFragmentPath || window.location.hash !== pendingFragmentHash) {
          cancelPendingFragmentFocus()
        }
        window.removeEventListener('popstate', handlePopState)
        window.removeEventListener('hashchange', handleHashChange)
        document.removeEventListener('click', handleAnchorClick)
      }
    }

    if (previousPath !== pathname) {
      if (window.location.hash) {
        queueFragmentFocus(window.location.hash, pathname)
        isPopStateRef.current = false
      } else if (isPopStateRef.current) {
        if (document.activeElement === document.body) mainRef.current?.focus({ preventScroll: true })
        isPopStateRef.current = false
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        const heading = getHeadingTarget()
        if (heading) focusElement(heading)
        else mainRef.current?.focus()
      }
    }

    return () => {
      if (window.location.pathname !== pendingFragmentPath || window.location.hash !== pendingFragmentHash) {
        cancelPendingFragmentFocus()
      }
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handleHashChange)
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [pathname])

  return null
}
