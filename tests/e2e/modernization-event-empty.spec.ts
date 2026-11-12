import path from 'node:path'
import { mkdir } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { getRawPage } from '../helpers/m3-acceptance'

test('keeps the empty homepage free of conditional appearance content and captures visual evidence', async ({ page, request }) => {
  const home = await getRawPage(request, '/')
  expect(home.status).toBe(200)
  expect(home.body).not.toMatch(/id=["']appearances["']|view full schedule|Upcoming comedy, speaking, and appearances/i)

  await page.goto('/')
  await expect(page.locator('#appearances')).toHaveCount(0)
  await expect(page.getByRole('link', { name: /full schedule/i })).toHaveCount(0)
  if (['desktop-chrome', 'compact-chrome'].includes(test.info().project.name)) {
    const viewport = test.info().project.name === 'desktop-chrome' ? 'desktop' : 'compact'
    const screenshotPath = path.resolve(process.cwd(), `output/modernization/after/evidence/home-empty-${viewport}.png`)
    await mkdir(path.dirname(screenshotPath), { recursive: true })
    await page.evaluate(async () => {
      const step = Math.max(240, Math.floor(window.innerHeight * 0.8))
      const maxScroll = document.documentElement.scrollHeight
      for (let y = 0; y < maxScroll; y += step) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(750)
    await page.screenshot({
      path: screenshotPath,
    })
  }

  const calendar = await getRawPage(request, '/calendar')
  expect(calendar.status).toBe(404)
  const missingEvent = await getRawPage(request, '/calendar/0123456789abcdef01234567')
  expect(missingEvent.status).toBe(404)

  const api = await request.get('/api/appearances')
  expect(api.status()).toBe(200)
  expect(api.headers()['cache-control']).toBe('no-store')
  expect(await api.json()).toMatchObject({ status: 'ready', events: [] })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('keeps the empty homepage and calendar 404 recovery visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Daniel Franzese', level: 1 })).toBeVisible()
    await expect(page.locator('#appearances')).toHaveCount(0)
    await expect(page.getByRole('link', { name: /full schedule/i })).toHaveCount(0)

    const calendar = await page.goto('/calendar')
    expect(calendar?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
    const recovery = page.locator('#main-content')
    await expect(recovery.getByRole('link', { name: 'Home', exact: true })).toBeVisible()
    await expect(recovery.getByRole('link', { name: 'Videos', exact: true })).toBeVisible()
    await expect(recovery.getByRole('link', { name: 'Booking', exact: true })).toBeVisible()
  })
})
