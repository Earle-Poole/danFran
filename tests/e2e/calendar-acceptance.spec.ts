import { expect, test } from '@playwright/test'
import { blockExternalRequests } from '../helpers/playwright-network'
import { appearanceEvents, emptyFeed, readyEmptyFeed, readyFeed } from '../fixtures/calendar'
import { calendarClientFixtureIds } from '../helpers/calendar-public-id'

const enabled = process.env.RUN_CALENDAR_ACCEPTANCE === '1'

test.describe('calendar appearances acceptance', () => {
  test.skip(!enabled, 'Calendar acceptance is gated until the integrated deterministic server slot is granted')

  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page)
  })

  test('keeps the empty homepage unchanged, exposes a real calendar 404, and returns a safe empty API feed', async ({ page, request }) => {
    const home = await page.goto('/')
    expect(home?.status()).toBe(200)
    await expect(page.locator('#appearances')).toHaveCount(0)
    await expect(page.getByRole('link', { name: /full schedule/i })).toHaveCount(0)
    expect(await page.locator('body').innerText()).not.toMatch(/view full schedule|upcoming comedy, speaking, and appearances/i)

    const calendar = await request.get('/calendar')
    expect(calendar.status()).toBe(404)

    const api = await request.get('/api/appearances')
    expect(api.status()).toBe(200)
    expect(api.headers()['cache-control']).toBe('no-store')
    expect(await api.json()).toEqual(emptyFeed)
  })

  test('adds the next four events after a visible refresh and preserves status/action honesty', async ({ page }) => {
    await page.route('**/api/appearances', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(readyFeed()) }),
    )
    await page.goto('/')
    await page.evaluate(() => window.dispatchEvent(new Event('focus')))

    const section = page.locator('#appearances')
    await expect(section).toBeVisible()
    await expect(section.locator('[class*="eventRow"]')).toHaveCount(4)
    await expect(section.getByText('Chicago Comedy Night')).toBeVisible()
    await expect(section.getByText('Austin Storytelling Talk')).toBeVisible()
    await expect(section.getByText('New York Standup')).toBeVisible()
    await expect(section.getByText('Los Angeles Panel')).toBeVisible()
    await expect(section.getByRole('link', { name: 'Get tickets: Chicago Comedy Night' })).toHaveAttribute(
      'href',
      'https://tickets.qa.test/chicago',
    )
    await expect(section.getByRole('link', { name: 'View presale: Austin Storytelling Talk' })).toBeVisible()
    await expect(section.getByRole('link', { name: 'Join waitlist: New York Standup' })).toBeVisible()
    await expect(section.getByText('Postponed')).toBeVisible()
    await expect(section.getByRole('link', { name: 'Los Angeles Panel', exact: true })).toHaveAttribute(
      'href',
      `/calendar/${calendarClientFixtureIds.losAngeles}`,
    )
    await expect(section.getByRole('link', { name: 'Get tickets: Los Angeles Panel' })).toHaveCount(0)
    await expect(section.getByRole('link', { name: 'Chicago Comedy Night', exact: true })).toHaveAttribute(
      'href',
      `/calendar/${calendarClientFixtureIds.chicago}`,
    )
    await expect(section.getByRole('link', { name: /view full schedule/i })).toHaveAttribute('href', '/calendar')
    await page.screenshot({
      path: `docs/reports/evidence/calendar-positive-${test.info().project.name}.png`,
      fullPage: true,
    })
  })

  test('removes the module and conditional schedule link when the last event disappears', async ({ page }) => {
    await page.clock.install({ time: new Date('2027-01-01T00:00:00Z') })
    let feed = readyFeed([appearanceEvents[0]])
    let calls = 0
    await page.route('**/api/appearances', (route) =>
      {
        calls += 1
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(feed) })
      },
    )
    await page.goto('/')
    await page.evaluate(() => window.dispatchEvent(new Event('focus')))
    await expect(page.locator('#appearances')).toBeVisible()
    await expect.poll(() => calls).toBe(1)

    feed = readyEmptyFeed
    await page.clock.fastForward(1001)
    await page.evaluate(() => window.dispatchEvent(new Event('focus')))
    await expect.poll(() => calls).toBe(2)
    await expect(page.locator('#appearances')).toHaveCount(0)
    await expect(page.getByRole('link', { name: /full schedule/i })).toHaveCount(0)
  })

  test('refreshes at 60 seconds and removes ticket actions when a successful poll returns empty', async ({ page }) => {
    await page.clock.install({ time: new Date('2027-01-01T00:00:00Z') })
    let calls = 0
    await page.route('**/api/appearances', (route) => {
      calls += 1
      const body = calls === 1 ? readyFeed([appearanceEvents[0]]) : emptyFeed
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
    })
    await page.goto('/')
    await page.evaluate(() => window.dispatchEvent(new Event('focus')))
    await expect(page.locator('#appearances')).toBeVisible()
    await expect.poll(() => calls).toBe(1)

    await page.clock.fastForward(60_000)
    await expect.poll(() => calls).toBe(2)
    await expect(page.locator('#appearances')).toHaveCount(0)
  })

  test('does not ship server credentials, raw Google fields, or provider implementation in browser output', async ({ page }) => {
    await page.goto('/')
    const browserText = await page.locator('body').innerText()
    const scripts = await page.locator('script').evaluateAll((elements) => elements.map((element) => element.textContent ?? '').join('\n'))
    expect(`${browserText}\n${scripts}`).not.toMatch(/GOOGLE_SERVICE_ACCOUNT_JSON|private_key|client_email|attendees|organizer|googleapis|node:crypto/i)
  })
})
