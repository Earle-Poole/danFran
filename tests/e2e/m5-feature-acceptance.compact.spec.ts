import { expect, test } from '@playwright/test'
import { installM4Network } from '../helpers/m4-acceptance'
import {
  m5AcceptanceEnabled,
  m5CanonicalRoutes,
  m5RouteHeadings,
  visibleControlAudit,
} from '../helpers/m5-acceptance'

test.skip(!m5AcceptanceEnabled, 'M5 acceptance is enabled only after the integrated M5 handoff')

test.describe('M5 compact keyboard, preferences and zoom distinctions', () => {
  test('keeps named controls and content usable under compact media preferences', async ({ page }) => {
    await installM4Network(page)

    for (const viewport of [
      { width: 320, height: 900 },
      { width: 390, height: 844 },
      { width: 844, height: 390 },
    ]) {
      await page.setViewportSize(viewport)
      await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
      for (const route of m5CanonicalRoutes) {
        await test.step(`${route} @ ${viewport.width}x${viewport.height}`, async () => {
          await page.goto(route)
          await expect(page.locator('main h1').first()).toHaveText(m5RouteHeadings[route])
          const state = await page.evaluate(() => ({
            forcedColors: window.matchMedia('(forced-colors: active)').matches,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
            viewport: window.innerWidth,
            documentWidth: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
          }))
          expect(state.forcedColors).toBe(true)
          expect(state.reducedMotion).toBe(true)
          expect(state.scrollBehavior).toBe('auto')
          expect(state.documentWidth).toBeLessThanOrEqual(state.viewport)

          const controls = await visibleControlAudit(page)
          expect(controls.length, `${route} @ ${viewport.width}x${viewport.height} should expose visible main controls`).toBeGreaterThan(0)
          expect(controls.every(({ name, width, height }) => name.length > 0 && width > 0 && height > 0)).toBe(true)
          await page.keyboard.press('Tab')
          await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY')
        })
      }
    }
  })

  test('distinguishes root-font scaling from real browser zoom', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ forcedColors: 'none', reducedMotion: 'no-preference' })
    await page.goto('/about')
    const before = await page.evaluate(() => ({
      rootFontSize: getComputedStyle(document.documentElement).fontSize,
      viewport: window.innerWidth,
      documentWidth: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
    }))
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    const after = await page.evaluate(() => ({
      rootFontSize: getComputedStyle(document.documentElement).fontSize,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      viewport: window.innerWidth,
      documentWidth: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
    }))

    expect(after.rootFontSize).not.toBe(before.rootFontSize)
    expect(after.reducedMotion).toBe(true)
    expect(after.viewport).toBe(before.viewport)
    expect(after.documentWidth).toBeLessThanOrEqual(after.viewport)
    testInfo.annotations.push({
      type: 'manual-gap',
      description: 'Real browser UI zoom is not emulated by this Playwright check and remains a manual release check.',
    })
  })
})
