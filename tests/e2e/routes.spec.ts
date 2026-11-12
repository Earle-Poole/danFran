import { expect, test } from '@playwright/test'
import { blockExternalRequests } from '../helpers/playwright-network'

test.beforeEach(async ({ page }) => {
  await blockExternalRequests(page)
})

test('home and legacy alias expose the baseline anchor targets', async ({ page }) => {
  const homeResponse = await page.goto('/')
  expect(homeResponse?.status()).toBe(200)

  for (const id of ['home', 'about', 'cameo', 'contact']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }

  const aliasResponse = await page.goto('/home')
  expect(aliasResponse?.status()).toBe(200)
  await expect(page.locator('#home')).toHaveCount(1)
})

test('returns a real 404 for an unknown route', async ({ page }) => {
  const response = await page.goto('/qa-route-that-does-not-exist')

  expect(response?.status()).toBe(404)
})

test('serves an original project photo as a same-origin asset', async ({ request }) => {
  const response = await request.get('/assets/about_me_photo1.webp')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('image/webp')
  expect((await response.body()).byteLength).toBeGreaterThan(0)
})

test('supports client navigation to an existing gallery route', async ({ page }) => {
  await page.goto('/')
  if (test.info().project.name === 'desktop-chrome') {
    await page.getByRole('button', { name: /^Work$/i }).click()
  } else {
    await page.getByRole('button', { name: 'Open navigation menu' }).click()
  }
  const portraits = test.info().project.name === 'desktop-chrome'
    ? page.locator('#work-navigation').getByRole('link', { name: 'Portraits' })
    : page.locator('#compact-navigation').getByRole('link', { name: 'Portraits' })
  await portraits.click()

  await expect(page).toHaveURL(/\/modeling-gallery$/)
  await expect(page.locator('main')).toHaveCount(1)
  await expect(page.locator('main h1')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'In focus.', level: 1 })).toBeVisible()
})
