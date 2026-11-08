import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import { getRawPage, htmlAttribute, htmlTags } from '../helpers/m3-acceptance'
import { qaEventIds } from '../helpers/calendar-public-id'

test('reports provider failure on the event route without a false success or indexable metadata', async ({ request }) => {
  for (const route of ['/calendar', `/calendar/${qaEventIds.chicago}`]) {
    const response = await getRawPage(request, route)
    expect(response.status).toBe(503)
    expect(response.headers['cache-control']).toBe('no-store')
    expect(response.headers['x-robots-tag']).toBe('noindex, nofollow')
    expect(response.headers['retry-after']).toBe('60')
    expect(response.headers['content-type']).toMatch(/^text\/html; charset=utf-8/i)
    const headMarkup = response.body.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? response.body
    const robots = htmlTags(headMarkup, 'meta').find((tag) => htmlAttribute(tag, 'name')?.toLowerCase() === 'robots')
    expect(htmlAttribute(robots ?? '', 'content')).toBe('noindex, nofollow')
    expect(response.body).toContain('Event updates are temporarily unavailable')
    expect(response.body).toContain('href="/">Home</a>')
    expect(response.body).toContain('href="/calendar">Schedule</a>')
    expect(response.body).toContain('href="/booking">Booking</a>')
    expect(response.body).not.toMatch(/Chicago QA Arts Night|organizer@qa\.invalid|private-attendee@qa\.invalid|GOOGLE_SERVICE_ACCOUNT_JSON|private_key|ticket|waitlist|purchase/i)

    const head = await request.head(route)
    expect(head.status()).toBe(503)
    expect(head.headers()['cache-control']).toBe('no-store')
    expect(head.headers()['x-robots-tag']).toBe('noindex, nofollow')
    expect(head.headers()['retry-after']).toBe('60')
    expect(head.headers()['content-type']).toMatch(/^text\/html; charset=utf-8/i)
    expect(await head.body()).toHaveLength(0)
  }

  const api = await request.get('/api/appearances')
  expect(api.status()).toBe(503)
  expect(api.headers()['cache-control']).toBe('no-store')
  expect(await api.json()).toMatchObject({ status: 'unavailable', events: [] })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('renders honest unavailable states without event details or ticket actions', async ({ page }) => {
    const calendar = await page.goto('/calendar')
    expect(calendar?.status()).toBe(503)
    await expect(page.getByRole('heading', { name: 'Event updates are temporarily unavailable' })).toBeVisible()
    await expect(page.getByText(/Please check back soon/i)).toBeVisible()
    const recovery = page.getByLabel('Recovery links')
    await expect(recovery.getByRole('link', { name: 'Home', exact: true })).toBeVisible()
    await expect(recovery.getByRole('link', { name: 'Schedule', exact: true })).toBeVisible()
    await expect(recovery.getByRole('link', { name: 'Booking', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: /ticket|waitlist|buy|purchase/i })).toHaveCount(0)
    if (['desktop-chrome', 'compact-chrome'].includes(test.info().project.name)) {
      const viewport = test.info().project.name === 'desktop-chrome' ? 'desktop' : 'compact'
      const screenshotPath = path.resolve(process.cwd(), `output/modernization/after/evidence/calendar-unavailable-${viewport}.png`)
      await mkdir(path.dirname(screenshotPath), { recursive: true })
      await page.screenshot({ path: screenshotPath, fullPage: true })
    }

    const detail = await page.goto(`/calendar/${qaEventIds.chicago}`)
    expect(detail?.status()).toBe(503)
    await expect(page.getByRole('heading', { name: 'Event updates are temporarily unavailable' })).toBeVisible()
    await expect(page.getByText('Chicago QA Arts Night')).toHaveCount(0)
    await expect(page.getByLabel('Recovery links').getByRole('link', { name: 'Home', exact: true })).toBeVisible()
    await expect(page.getByLabel('Recovery links').getByRole('link', { name: 'Schedule', exact: true })).toBeVisible()
    await expect(page.getByLabel('Recovery links').getByRole('link', { name: 'Booking', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: /ticket|waitlist|buy|purchase/i })).toHaveCount(0)
  })
})
