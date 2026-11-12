import { describe, expect, it } from 'vitest'
import { createSeoMetadata } from '../../../lib/seo/metadata'
import {
  getConfiguredOrigin,
  validateProductionOrigin,
} from '../../../lib/seo/origin'
import { resolveSeoRouteId } from '../../../lib/seo/routing'
import { buildSeoJsonLd, serializeJsonLd, validateSeoSchema } from '../../../lib/seo/schema'
import { buildSitemapXml, getSitemapEntries } from '../../../lib/seo/sitemap'
import { routes, selectIndexableRoutes } from '../../../lib/content/routes'
import type { RouteRecord } from '../../../lib/content/types'
import { emptyFeed, readyFeed, unavailableFeed } from '../../fixtures/calendar'

describe('SEO origin and deployment safety', () => {
  it('accepts public absolute web origins and rejects unsafe, private, or path-bearing values', () => {
    expect(getConfiguredOrigin({ value: 'https://example.invalid', environment: 'preview' })).toBe('https://example.invalid')
    expect(getConfiguredOrigin({ value: 'http://localhost:3000', environment: 'development' })).toBe('http://localhost:3000')
    expect(getConfiguredOrigin({ value: 'http://localhost:3000', environment: 'production' })).toBeNull()
    expect(getConfiguredOrigin({ value: 'http://127.0.0.1:3000', environment: 'production' })).toBeNull()
    expect(getConfiguredOrigin({ value: 'http://[::1]:3000', environment: 'production' })).toBeNull()
    expect(getConfiguredOrigin({ value: 'http://192.168.1.20', environment: 'production' })).toBeNull()
    expect(getConfiguredOrigin({ value: 'http://10.0.0.4', environment: 'production' })).toBeNull()
    expect(getConfiguredOrigin({ value: 'https://8.8.8.8', environment: 'production' })).toBeNull()
    expect(getConfiguredOrigin({ value: 'https://localhost.', environment: 'production' })).toBeNull()
    expect(getConfiguredOrigin({ value: 'https://example.invalid/path', environment: 'production' })).toBeNull()
    expect(getConfiguredOrigin({ value: 'javascript:alert(1)', environment: 'production' })).toBeNull()
    expect(() => validateProductionOrigin('')).toThrow(/NEXT_PUBLIC_SITE_URL/)
  })

  it('keeps local and preview pages noindex even with an explicit local origin', () => {
    const metadata = createSeoMetadata({
      routeId: 'home',
      origin: 'http://localhost:3000',
      environment: 'development',
    })
    expect(metadata.robots).toBe('noindex,nofollow')
    expect(metadata.indexable).toBe(false)
    expect(metadata.canonicalUrl).toBe('http://localhost:3000/')
    const productionLocal = createSeoMetadata({
      routeId: 'home',
      origin: 'http://localhost:3000',
      environment: 'production',
    })
    expect(productionLocal.indexable).toBe(false)
    expect(productionLocal.canonicalUrl).toBeNull()
  })
})

describe('SEO route resolution and canonicalization', () => {
  it('maps pathname/asPath aliases and strips query and fragment state', () => {
    expect(resolveSeoRouteId('/home', '/home#about')).toBe('legacy-home')
    expect(resolveSeoRouteId('/video-gallery', '/video-gallery?category=comedy&video=abc#selected')).toBe('videos')
    expect(resolveSeoRouteId('/missing-route', '/missing-route?x=1')).toBe('not-found')
    expect(createSeoMetadata({ routeId: 'legacy-home', origin: 'https://example.invalid', environment: 'production' }).canonicalUrl).toBe('https://example.invalid/')
  })
})

describe('truthful structured data', () => {
  it('allowlists supported schema input and safely serializes JSON-LD', () => {
    expect(validateSeoSchema({ type: 'Event', name: 'Invented event' })).toBeNull()
    expect(validateSeoSchema({ type: 'ProfilePage', name: 'About', mainEntity: { type: 'Person', name: 'Daniel Franzese' } })).toBeNull()
    expect(validateSeoSchema({ type: 'Person', name: 'Daniel Franzese', unsupported: true })).toBeNull()
    expect(validateSeoSchema({ type: 'Person', name: 'Daniel Franzese', imagePath: '/not-an-original.webp' })).toBeNull()
    expect(validateSeoSchema({ type: 'Person', name: 'Daniel Franzese', sameAs: ['https://example.invalid/social'] })).toBeNull()
    const jsonLd = buildSeoJsonLd({
      origin: 'https://example.invalid',
      schema: { type: 'Person', name: '</script><script>alert("&")</script>' },
    })
    const serialized = serializeJsonLd(jsonLd!)
    expect(serialized).not.toContain('<script')
    expect(serialized).toContain('\\u003c/script\\u003e')
    expect(serialized).toContain('\\u0026')
    expect(serialized).toContain('example.invalid/assets/about_me_photo1.webp')
  })
})

describe('sitemap and recovery metadata', () => {
  it('contains the six actual canonical routes and no legacy or incidental paths', () => {
    const entries = getSitemapEntries('https://example.invalid')
    expect(entries.map((entry) => entry.loc)).toEqual([
      'https://example.invalid/',
      'https://example.invalid/about',
      'https://example.invalid/press-kit',
      'https://example.invalid/modeling-gallery',
      'https://example.invalid/video-gallery',
      'https://example.invalid/booking',
    ])
    const xml = buildSitemapXml('https://example.invalid')
    expect(xml).toContain('<urlset')
    expect(xml).not.toContain('/home')
    expect(xml).not.toContain('/calendar')
    expect(xml).not.toContain('/404')
  })

  it('excludes planned routes when the DATA selector receives a planned fixture', () => {
    const plannedFixture: RouteRecord[] = routes.map((route) =>
      route.id === 'about' || route.id === 'booking'
        ? { ...route, availability: 'planned' }
        : route,
    )
    expect(selectIndexableRoutes(plannedFixture).map((route) => route.id)).toEqual([
      'home',
      'press-kit',
      'portraits',
      'videos',
    ])
  })

  it('omits URLs when no valid origin is configured', () => {
    expect(getSitemapEntries(undefined)).toEqual([])
    expect(getSitemapEntries('http://127.0.0.1:3132')).toEqual([])
    expect(buildSitemapXml('not-a-url')).not.toContain('<loc>')
    expect(createSeoMetadata({ routeId: 'calendar', environment: 'production' }).robots).toBe('noindex,nofollow')
    expect(createSeoMetadata({ routeId: 'not-found', origin: 'https://example.invalid', environment: 'production' }).canonicalUrl).toBeNull()
  })

  it('adds the calendar to production sitemap and metadata only for a positive ready feed', () => {
    const origin = 'https://qa.invalid'
    const positive = readyFeed()
    const empty = readyFeed([])

    expect(getSitemapEntries(origin, positive).map((entry) => entry.loc)).toContain(`${origin}/calendar`)
    expect(buildSitemapXml(origin, positive)).toContain(`<loc>${origin}/calendar</loc>`)
    expect(getSitemapEntries(origin, empty).map((entry) => entry.loc)).not.toContain(`${origin}/calendar`)
    expect(getSitemapEntries(origin, unavailableFeed).map((entry) => entry.loc)).not.toContain(`${origin}/calendar`)

    const positiveMetadata = createSeoMetadata({
      routeId: 'calendar',
      origin,
      environment: 'production',
      calendarFeed: positive,
    })
    expect(positiveMetadata.indexable).toBe(true)
    expect(positiveMetadata.robots).toBe('index,follow')
    expect(positiveMetadata.canonicalUrl).toBe(`${origin}/calendar`)

    for (const calendarFeed of [empty, unavailableFeed, emptyFeed]) {
      const metadata = createSeoMetadata({
        routeId: 'calendar',
        origin,
        environment: 'production',
        calendarFeed,
      })
      expect(metadata.indexable).toBe(false)
      expect(metadata.robots).toBe('noindex,nofollow')
      expect(metadata.canonicalUrl).toBeNull()
    }
  })
})
