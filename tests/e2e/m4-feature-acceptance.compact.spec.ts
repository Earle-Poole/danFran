import { expect, test } from '@playwright/test'
import { installM4Network, m4AcceptanceEnabled } from '../helpers/m4-acceptance'

test.skip(!m4AcceptanceEnabled, 'M4 acceptance is enabled only on the integrated M4 baseline')

test.beforeEach(async ({ page }) => {
  await installM4Network(page)
  await page.setViewportSize({ width: 320, height: 844 })
})

test.describe('M4 compact-only acceptance', () => {
  test('keeps compact navigation state truthful at 320px', async ({ page }) => {
    await page.goto('/')
    const panel = page.locator('#compact-navigation')
    const open = page.getByRole('button', { name: 'Open navigation' })
    await expect(open).toHaveAttribute('aria-expanded', 'false')
    await expect(panel).toBeHidden()
    await expect(panel.getByRole('link').first()).toBeHidden()
    await open.click()
    const close = page.getByRole('button', { name: 'Close navigation' })
    await expect(close).toHaveAttribute('aria-expanded', 'true')
    await expect(panel).toBeVisible()
    await expect(panel.getByRole('link').first()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused()
    await expect(panel).toBeHidden()
  })

  test('keeps the gallery dialog usable at compact width', async ({ page }) => {
    await page.goto('/modeling-gallery')
    const initiatingThumbnail = page.locator('main button:has(img)').first()
    await initiatingThumbnail.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('button', { name: /^close/i })).toBeFocused()
    await expect(dialog.getByRole('button', { name: /^previous/i })).toBeDisabled()
    await expect(dialog.getByRole('button', { name: /^next/i })).toBeEnabled()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(initiatingThumbnail).toBeFocused()
  })

  test.describe('M4 compact no-JavaScript fallback', () => {
    test.use({ javaScriptEnabled: false })

    test('keeps compact navigation and newsletter handoff visible', async ({ page }) => {
      await page.goto('/about')
      await expect(page.getByRole('heading', { name: 'More than a familiar face.', level: 1 })).toBeVisible()
      await page.goto('/')
      await expect(page.locator('#compact-navigation')).toBeVisible()
      await expect(page.locator('#compact-navigation').getByRole('link').first()).toBeVisible()
      const newsletter = page
        .getByRole('heading', { name: 'Stay in the loop.' })
        .locator('xpath=ancestor::section[1]')
      const form = newsletter.getByRole('textbox', { name: 'Email address' }).locator('xpath=ancestor::form[1]')
      await expect(form).toHaveAttribute('action', /^https?:\/\//)
    })
  })

  test('captures compact M4 page evidence', async ({ page }) => {
    for (const route of ['/', '/about', '/booking', '/press-kit', '/modeling-gallery', '/video-gallery']) {
      await page.goto(route)
      const name = route === '/' ? 'home' : route.slice(1).replaceAll('-', '_')
      await page.screenshot({
        path: 'docs/reports/QA-M4/visual/compact-chrome-' + name + '.png',
        fullPage: true,
      })
    }
  })
})
