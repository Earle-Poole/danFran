'use client'

import { useEffect } from 'react'
import { isAnalyticsHost, trackEvent } from 'lib/analytics'

export function HomepageSectionAnalytics({ sectionId }: { sectionId: string }) {
  useEffect(() => {
    if (!isAnalyticsHost() || !('IntersectionObserver' in window)) return
    const section = document.getElementById(sectionId)
    if (!section) return

    let reported = false
    const observer = new IntersectionObserver(([entry]) => {
      if (reported || document.hidden || entry.intersectionRatio < 0.25) return
      reported = true
      trackEvent('homepage_section_viewed', { section: sectionId })
      observer.disconnect()
    }, { threshold: 0.25 })

    const checkWhenVisible = () => {
      if (reported || document.hidden) return
      observer.unobserve(section)
      observer.observe(section)
    }

    observer.observe(section)
    document.addEventListener('visibilitychange', checkWhenVisible)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', checkWhenVisible)
    }
  }, [sectionId])

  return null
}
