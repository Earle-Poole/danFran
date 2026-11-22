'use client'

import { useLayoutEffect, useSyncExternalStore } from 'react'
import Script from 'next/script'
import { analyticsDomains, flushAnalyticsEvents, isAnalyticsHost, trackEvent } from 'lib/analytics'

const siteRoutes = new Set([
  '/', '/home', '/about', '/booking', '/calendar', '/modeling-gallery',
  '/press-kit', '/video-gallery', '/special', '/qr', '/qr/share',
])

const siteSections = new Set([
  '#about', '#advocacy-heading', '#appearances', '#booking-details', '#cameo', '#comedy-special',
  '#contact', '#current-headshots', '#home', '#home-newsletter', '#main-content', '#modeling-collection',
  '#opening-number', '#press-resources', '#selected-work', '#biography-text-version', '#tour-text-version',
])

const campaignParameters = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'])
const subscribeToHostname = () => () => {}
const analyticsEnabledOnServer = () => false
type UmamiPayload = { url?: string; referrer?: string; name?: string }
type AnalyticsWindow = Window & { filterDanFranAnalytics?: (type: string, payload: UmamiPayload) => UmamiPayload | false }

function parseUrl(value: string) {
  try {
    return new URL(value, window.location.href)
  } catch {
    return null
  }
}

function cleanUrl(value: string, keepCampaign: boolean) {
  const url = parseUrl(value)
  if (!url) return ''
  url.hash = ''
  const tags = new URLSearchParams()
  if (keepCampaign) {
    url.searchParams.forEach((value, key) => {
      if (campaignParameters.has(key)) tags.append(key, value)
    })
  }
  url.search = tags.toString()
  return url.href
}

function placementFor(element: Element) {
  return element.closest<HTMLElement>('[data-analytics-placement]')?.dataset.analyticsPlacement
    ?? (element.closest('footer') ? 'footer' : element.closest('header') ? 'header' : 'page')
}

function trackLink(event: MouseEvent) {
  if (event.type === 'auxclick' && event.button !== 1) return
  if (!(event.target instanceof Element)) return
  const link = event.target.closest<HTMLAnchorElement>('a[href]')
  if (!link || link.getAttribute('aria-disabled') === 'true') return
  const url = parseUrl(link.href)
  if (!url) return

  const placement = placementFor(link)
  const { analyticsTicketId, analyticsTicketStatus, analyticsReleaseAction, analyticsVideoId } = link.dataset

  if (analyticsTicketId && analyticsTicketStatus) {
    trackEvent('ticket_link_clicked', { event_id: analyticsTicketId, ticket_status: analyticsTicketStatus, placement })
  } else if (analyticsReleaseAction) {
    trackEvent('special_release_clicked', { action: analyticsReleaseAction })
  } else if (analyticsVideoId) {
    const provider = url.hostname.endsWith('vimeo.com') ? 'vimeo' : 'youtube'
    trackEvent('external_video_clicked', { video_id: analyticsVideoId, provider, placement })
  } else if (url.protocol === 'mailto:' || url.protocol === 'tel:') {
    trackEvent('booking_contact_clicked', { method: url.protocol === 'mailto:' ? 'email' : 'phone', placement })
  } else if (url.protocol === 'https:' || url.protocol === 'http:') {
    const domain = url.hostname.replace(/^www\./, '')
    if (analyticsDomains.includes(url.hostname)) {
      const path = url.pathname.replace(/\/$/, '') || '/'
      if (path === '/special' && window.location.pathname !== '/special') {
        trackEvent('special_link_clicked', { placement })
      } else if (path.startsWith('/assets/')) {
        trackEvent(link.hasAttribute('download') ? 'asset_download_clicked' : 'asset_preview_clicked', { asset: path, placement })
      } else if (siteRoutes.has(path) || /^\/calendar\/[a-f0-9]{24}$/.test(path)) {
        const section = siteSections.has(url.hash) ? url.hash : ''
        trackEvent('navigation_clicked', { destination: `${path}${section}`, placement })
      }
    } else if (domain === 'cameo.com') {
      trackEvent('cameo_clicked', { placement })
    } else {
      trackEvent('outbound_link_clicked', { destination: domain, placement })
    }
  }
}

function trackFormSubmission(event: SubmitEvent) {
  const form = event.target
  if (form instanceof HTMLFormElement && form.hasAttribute('data-analytics-newsletter')) {
    trackEvent('newsletter_submitted', { placement: placementFor(form) })
  }
}

function trackDisclosure(event: Event) {
  const details = event.target
  if (details instanceof HTMLDetailsElement && details.open && details.hasAttribute('data-analytics-special-sleeve')) {
    trackEvent('special_sleeve_opened')
  }
}

export function SiteAnalytics() {
  const enabled = useSyncExternalStore(subscribeToHostname, isAnalyticsHost, analyticsEnabledOnServer)

  useLayoutEffect(() => {
    if (!enabled) return

    const browser = window as AnalyticsWindow
    let lastViewedPath = ''
    browser.filterDanFranAnalytics = (type, payload) => {
      const url = payload.url ? cleanUrl(payload.url, true) : ''
      if (type === 'event' && !payload.name && url) {
        const path = new URL(url).pathname
        // Query-only UI changes already have their own events.
        if (path === lastViewedPath) return false
        lastViewedPath = path
      }
      return { ...payload, url, referrer: payload.referrer ? cleanUrl(payload.referrer, false) : '' }
    }
    // Observe native actions without delaying navigation, handling form data, or overriding controls.
    document.addEventListener('click', trackLink, true)
    document.addEventListener('auxclick', trackLink, true)
    document.addEventListener('submit', trackFormSubmission, true)
    document.addEventListener('toggle', trackDisclosure, true)
    return () => {
      delete browser.filterDanFranAnalytics
      document.removeEventListener('click', trackLink, true)
      document.removeEventListener('auxclick', trackLink, true)
      document.removeEventListener('submit', trackFormSubmission, true)
      document.removeEventListener('toggle', trackDisclosure, true)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      strategy="afterInteractive"
      data-website-id="8471c1a8-46e3-418a-9cf2-363986d5d075"
      data-domains={analyticsDomains.join(',')}
      data-exclude-hash="true"
      data-before-send="filterDanFranAnalytics"
      onReady={flushAnalyticsEvents}
    />
  )
}
