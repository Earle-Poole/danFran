import path from 'node:path'
import { expect, test } from '@playwright/test'
import {
  canonicalPath,
  getRawPage,
  htmlAttribute,
  htmlTags,
  htmlText,
  m3AcceptanceEnabled,
  m3FixtureOrigin,
} from '../helpers/m3-acceptance'
import { blockExternalRequests } from '../helpers/playwright-network'
import { normalizeRobotsDirectives } from '../helpers/robots'

const shellRoutes = [
  '/',
  '/home',
  '/press-kit',
  '/modeling-gallery',
  '/video-gallery',
]
const metadataRoutes = ['/', '/home', '/press-kit', '/modeling-gallery', '/video-gallery']
const m3Deployment = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV ?? 'development'

test.describe('M3 shared shell acceptance', () => {
  test.skip(!m3AcceptanceEnabled, 'M3 acceptance is gated until SHELL and SEO packets are integrated')

  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page)
  })

  test('renders exactly one shared header, main landmark and footer on every route', async ({ page }) => {
    for (const route of shellRoutes) {
      await page.goto(route)
      await expect(page.locator('header')).toHaveCount(1)
      await expect(page.locator('main')).toHaveCount(1)
      await expect(page.locator('footer')).toHaveCount(1)
    }
  })

  test('provides a first-focus skip link that reaches the main target', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: /skip to main content/i })
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toHaveAttribute('href', '#main-content')
    await page.keyboard.press('Enter')
    const main = page.locator('#main-content')
    await expect(main).toBeFocused()
    for (const delay of [5, 25, 100]) {
      await page.waitForTimeout(delay)
      await expect(main).toBeFocused()
    }
  })

  test('keeps the wide Work disclosure keyboard-operable and dismissible', async ({ page }) => {
    await page.goto('/')
    const work = page.getByRole('button', { name: /^Work$/i })
    await expect(work).toHaveAttribute('aria-expanded', 'false')
    await work.click()
    await expect(work).toHaveAttribute('aria-expanded', 'true')
    const workPortraits = page.locator('#work-navigation').getByRole('link', { name: 'Portraits' })
    await expect(workPortraits).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(work).toBeFocused()
    await work.click()
    await workPortraits.click()
    await expect(page).toHaveURL(/\/modeling-gallery$/)
    await expect(page.getByRole('button', { name: /^Work$/i })).toHaveAttribute('aria-expanded', 'false')
  })

  test('moves focus to the route target after client navigation', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Press(?: Kit)?/i }).first().click()
    await expect(page).toHaveURL(/\/press-kit$/)
    const routeTarget = page.locator('main [data-shell-focus-target="true"]').first()
    await expect(routeTarget).toBeVisible()
    await expect(routeTarget).toBeFocused()
  })

  test('focuses valid fragments and preserves Back/Forward usability', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Press(?: Kit)?/i }).first().click()
    await expect(page).toHaveURL(/\/press-kit$/)
    await page.goBack()
    await expect(page).toHaveURL(/\/$/)
    await page.goForward()
    await expect(page).toHaveURL(/\/press-kit$/)

    await page.goto('/home#about')
    const aboutTarget = page.locator('#about')
    const aboutHeading = aboutTarget.locator('h2#about-preview-heading')
    await expect(aboutTarget).toBeVisible()
    await expect(aboutTarget).toHaveAttribute('aria-labelledby', 'about-preview-heading')
    await expect(aboutHeading).toBeVisible()
    await expect(aboutHeading).toBeFocused()

    await page.goBack()
    await expect(page).toHaveURL(/\/press-kit$/)
    await page.goForward()
    await expect(page).toHaveURL(/\/home#about$/)
  })

  test('keeps malformed fragments from crashing the shell', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
    await page.goto('/home#%E0%A4%A')
    await expect(page.locator('main')).toBeVisible()
    expect(pageErrors).toEqual([])
  })

  test('does not report a hydration mismatch on direct alias-fragment entry', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    await page.route('**/_vercel/insights/script.js', (route) =>
      route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* QA telemetry stub */' }),
    )
    await page.goto('/home#about')
    await expect(page.locator('#about')).toBeVisible()
    const hydrationMismatch = consoleErrors.filter((message) =>
      message.startsWith('A tree hydrated but some attributes of the server rendered HTML did not match'),
    )
    expect(hydrationMismatch).toEqual([])
    const unexpectedErrors = consoleErrors.filter(
      (message) =>
        message !== 'Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector' &&
        !message.includes('/_vercel/insights/script.js'),
    )
    expect(unexpectedErrors).toEqual([])
  })

  test('moves focus out of a hidden compact panel when the breakpoint changes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Open navigation menu' }).click()
    await page.locator('#compact-navigation').getByRole('link', { name: /Press(?: Kit)?/i }).focus()
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect
      .poll(() =>
        page.evaluate(() => {
          const active = document.activeElement
          return Boolean(active && active.getClientRects().length && !active.closest('[aria-hidden="true"]'))
        }),
      )
      .toBe(true)
  })

  test('remains usable at compact width and 200% text scaling', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 })
    await page.goto('/')
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    const dimensions = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }))
    expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport)
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport)
    await expect(page.getByRole('heading', { name: 'Daniel Franzese' })).toBeVisible()
  })

  test('keeps shell controls distinguishable under forced colors and live reduced motion', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
    const media = await page.evaluate(() => ({
      forcedColors: window.matchMedia('(forced-colors: active)').matches,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      transition: getComputedStyle(document.querySelector('header')!).transitionDuration,
      controls: Array.from(document.querySelectorAll('a, button, input'))
        .filter((element) => Boolean(element.getClientRects().length))
        .map((element) => {
        const style = getComputedStyle(element)
        return {
          color: style.color,
          background: style.backgroundColor,
          border: style.borderTopColor,
          visible: Boolean(element.getClientRects().length),
        }
        }),
    }))
    expect(media.forcedColors).toBe(true)
    expect(media.reducedMotion).toBe(true)
    expect(Number.parseFloat(media.transition)).toBeLessThanOrEqual(0.01)
    expect(media.controls.length).toBeGreaterThan(0)
    expect(media.controls.every(({ visible }) => visible)).toBe(true)
    await expect(page.locator('header').getByRole('link', { name: /Press(?: Kit)?/i }).first()).toBeVisible()
  })

  test('captures wide and compact shared-shell evidence', async ({ page }) => {
    await page.goto('/')
    await page.screenshot({
      path: path.resolve(process.cwd(), 'docs/reports/QA-M3/visual/shell-desktop.png'),
      fullPage: true,
    })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.screenshot({
      path: path.resolve(process.cwd(), 'docs/reports/QA-M3/visual/shell-compact.png'),
      fullPage: true,
    })
  })
})

test.describe('M3 no-JavaScript navigation fallback', () => {
  test.skip(!m3AcceptanceEnabled, 'M3 acceptance is gated until SHELL and SEO packets are integrated')
  test.use({ javaScriptEnabled: false })

  test('keeps content, shell navigation and ordinary route links available without JavaScript', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header')).toHaveCount(1)
    await expect(page.locator('main')).toHaveCount(1)
    await expect(page.locator('footer')).toHaveCount(1)
    const pressLink = page.locator('header').getByRole('link', { name: /Press(?: Kit)?/i }).first()
    await expect(pressLink).toBeVisible()
    await pressLink.click()
    await expect(page).toHaveURL(/\/press-kit$/)
    await expect(page.locator('main')).toBeVisible()
  })
})

test.describe('M3 raw HTML SEO and recovery acceptance', () => {
  test.skip(!m3AcceptanceEnabled, 'M3 acceptance is gated until SHELL and SEO packets are integrated')

  test('emits one complete metadata set per indexable direct entry with the fixture origin', async ({ request }) => {
    const seenTitles = new Set<string>()
    for (const route of metadataRoutes) {
      const raw = await getRawPage(request, route)
      expect(raw.status, route).toBe(200)
      const head = raw.body.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? raw.body
      const titles = htmlText(head, 'title')
      const descriptions = htmlTags(head, 'meta').filter(
        (tag) => htmlAttribute(tag, 'name')?.toLowerCase() === 'description',
      )
      const canonicals = htmlTags(head, 'link').filter(
        (tag) => htmlAttribute(tag, 'rel')?.toLowerCase() === 'canonical',
      )
      const ogTitle = htmlTags(head, 'meta').filter((tag) => htmlAttribute(tag, 'property') === 'og:title')
      const ogImage = htmlTags(head, 'meta').filter((tag) => htmlAttribute(tag, 'property') === 'og:image')
      const robots = htmlTags(head, 'meta').find(
        (tag) => htmlAttribute(tag, 'name')?.toLowerCase() === 'robots',
      )
      expect(titles).toHaveLength(1)
      expect(titles[0].length).toBeGreaterThan(10)
      if (route !== '/home') {
        expect(seenTitles.has(titles[0]), `duplicate title on ${route}`).toBe(false)
        seenTitles.add(titles[0])
      }
      expect(descriptions).toHaveLength(1)
      expect(htmlAttribute(descriptions[0], 'content')).toBeTruthy()
      expect(canonicals).toHaveLength(1)
      const canonical = htmlAttribute(canonicals[0], 'href')
      expect(canonical).toBe(`${m3FixtureOrigin}${canonicalPath(route)}`)
      expect(ogTitle).toHaveLength(1)
      expect(ogImage).toHaveLength(1)
      const shouldIndex = m3Deployment === 'production' && route !== '/home'
      expect(normalizeRobotsDirectives(htmlAttribute(robots ?? '', 'content'))).toEqual(
        shouldIndex ? ['follow', 'index'] : ['nofollow', 'noindex'],
      )
      expect(raw.body).not.toMatch(/localhost|127\.0\.0\.1/i)
    }
  })

  test('serves a truthful JSON-LD set without unsupported media or review claims', async ({ request }) => {
    const raw = await getRawPage(request, '/')
    const scripts = htmlTags(raw.body, 'script').filter(
      (tag) => htmlAttribute(tag, 'type') === 'application/ld+json',
    )
    expect(scripts.length).toBeGreaterThan(0)
    const jsonBlocks = Array.from(raw.body.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi))
    const types = jsonBlocks.flatMap(([, content]) => {
      const value = JSON.parse(content.trim()) as
        | Array<{ '@graph'?: Array<{ '@type'?: string | string[] }>; '@type'?: string | string[] }>
        | { '@graph'?: Array<{ '@type'?: string | string[] }>; '@type'?: string | string[] }
      const entries = Array.isArray(value) ? value : value['@graph'] ?? [value]
      return entries.flatMap((entry) => entry['@type'] ?? [])
    })
    expect(types).toEqual(expect.arrayContaining(['Person', 'WebSite']))
    expect(types).not.toEqual(expect.arrayContaining(['VideoObject', 'Event', 'Review', 'AggregateRating']))
  })

  test('serves a valid sitemap and environment-safe robots policy', async ({ request }) => {
    const sitemap = await getRawPage(request, '/sitemap.xml')
    expect(sitemap.status).toBe(200)
    expect(sitemap.headers['content-type']).toMatch(/xml/i)
    const locations = Array.from(sitemap.body.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)).map(
      ([, location]) => location,
    )
    expect(locations).toHaveLength(6)
    for (const route of ['/', '/about', '/press-kit', '/modeling-gallery', '/video-gallery', '/booking']) {
      expect(locations).toContain(`${m3FixtureOrigin}${route}`)
    }
    expect(locations).not.toContain(`${m3FixtureOrigin}/home`)
    expect(locations).not.toContain(`${m3FixtureOrigin}/calendar`)
    expect(locations).not.toContain(`${m3FixtureOrigin}/404`)

    const robots = await getRawPage(request, '/robots.txt')
    expect(robots.status).toBe(200)
    expect(robots.headers['content-type']).toMatch(/text\/plain/i)
    expect(robots.body).not.toMatch(/localhost|127\.0\.0\.1/i)
    if (m3Deployment === 'production') {
      expect(robots.body).toContain(`Sitemap: ${m3FixtureOrigin}/sitemap.xml`)
      expect(robots.body).toContain('Allow: /')
    } else {
      expect(robots.body).not.toContain('Sitemap:')
      expect(robots.body).toContain('Disallow: /')
    }
  })

  test('keeps an empty calendar as a real 404 and unknown routes genuinely recoverable 404s', async ({ request }) => {
    const calendar = await getRawPage(request, '/calendar')
    expect(calendar.status).toBe(404)
    expect(htmlText(calendar.body, 'h1')).toContain('Page not found')

    const missing = await getRawPage(request, '/m3-route-that-does-not-exist')
    expect(missing.status).toBe(404)
    expect(htmlText(missing.body, 'h1')).toContain('Page not found')
    expect(missing.body).toMatch(/Home/i)
    expect(missing.body).toMatch(/Videos/i)
    expect(missing.body).toMatch(/Booking/i)
  })
})
