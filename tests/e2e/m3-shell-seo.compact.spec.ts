import { expect, test } from '@playwright/test'
import { m3AcceptanceEnabled } from '../helpers/m3-acceptance'
import { blockExternalRequests } from '../helpers/playwright-network'

test.describe('M3 compact navigation acceptance', () => {
  test.skip(!m3AcceptanceEnabled, 'M3 acceptance is gated until SHELL and SEO packets are integrated')

  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page)
  })

  test('opens and dismisses the compact menu with named controls and restored focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const menu = page.getByRole('button', { name: 'Open navigation' })
    await expect(menu).toHaveCount(1)
    await menu.click()
    await expect(page.getByRole('button', { name: 'Close navigation' })).toBeVisible()
    await expect(page.locator('#compact-navigation').getByRole('link', { name: /Press(?: Kit)?/i })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused()
  })
})
