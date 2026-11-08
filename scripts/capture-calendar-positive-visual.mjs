import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const baseURL = process.env.QA_VISUAL_BASE_URL ?? 'http://127.0.0.1:3181'
const outputDirectory = process.env.QA_VISUAL_OUTPUT ?? 'docs/reports/evidence'
const outputPrefix = process.env.QA_VISUAL_PREFIX ?? 'positive-post-live'
const referenceMatched = process.env.QA_VISUAL_REFERENCE_MATCHED === '1'
const genericEvents = [
  {
    id: 'event-chicago',
    title: 'Chicago Comedy Night',
    description: 'A verified comedy date.',
    location: 'The Vic Theatre, Chicago, IL',
    start: '2027-01-15T20:00:00.000Z',
    end: '2027-01-15T22:00:00.000Z',
    allDay: false,
    timeZone: 'America/Chicago',
    eventStatus: 'scheduled',
    ticketStatus: 'on-sale',
    ticketUrl: 'https://tickets.qa.test/chicago',
    waitlistUrl: null,
    ticketProvider: 'QA Tickets',
    category: 'comedy',
  },
  {
    id: 'event-austin',
    title: 'Austin Storytelling Talk',
    description: 'A verified speaking date.',
    location: 'Paramount Theatre, Austin, TX',
    start: '2027-02-10T01:00:00.000Z',
    end: '2027-02-10T03:00:00.000Z',
    allDay: false,
    timeZone: 'America/Chicago',
    eventStatus: 'scheduled',
    ticketStatus: 'presale',
    ticketUrl: 'https://tickets.qa.test/austin',
    waitlistUrl: null,
    ticketProvider: 'QA Tickets',
    category: 'speaking',
  },
  {
    id: 'event-new-york',
    title: 'New York Standup',
    description: 'A verified sold-out date.',
    location: 'The Bell House, Brooklyn, NY',
    start: '2027-03-20T23:00:00.000Z',
    end: '2027-03-21T01:00:00.000Z',
    allDay: false,
    timeZone: 'America/New_York',
    eventStatus: 'scheduled',
    ticketStatus: 'sold-out',
    ticketUrl: 'https://tickets.qa.test/new-york',
    waitlistUrl: 'https://tickets.qa.test/new-york/waitlist',
    ticketProvider: 'QA Tickets',
    category: 'comedy',
  },
  {
    id: 'event-los-angeles',
    title: 'Los Angeles Panel',
    description: 'A postponed date.',
    location: 'The Wiltern, Los Angeles, CA',
    start: '2027-04-08T02:00:00.000Z',
    end: '2027-04-08T04:00:00.000Z',
    allDay: false,
    timeZone: 'America/Los_Angeles',
    eventStatus: 'postponed',
    ticketStatus: 'on-sale',
    ticketUrl: 'https://tickets.qa.test/los-angeles',
    waitlistUrl: null,
    ticketProvider: 'QA Tickets',
    category: 'appearance',
  },
]
const referenceEvents = [
  {
    id: 'reference-los-angeles',
    title: 'Los Angeles, CA',
    description: '',
    location: 'The Marquee',
    start: '2026-11-07T04:00:00.000Z',
    end: '2026-11-07T06:00:00.000Z',
    allDay: false,
    timeZone: 'America/Los_Angeles',
    eventStatus: 'scheduled',
    ticketStatus: 'on-sale',
    ticketUrl: 'https://tickets.qa.test/reference-los-angeles',
    waitlistUrl: null,
    ticketProvider: 'QA Tickets',
    category: 'comedy',
  },
  {
    id: 'reference-chicago',
    title: 'Chicago, IL',
    description: '',
    location: 'The Palm Room',
    start: '2026-11-15T01:30:00.000Z',
    end: '2026-11-15T03:30:00.000Z',
    allDay: false,
    timeZone: 'America/Chicago',
    eventStatus: 'scheduled',
    ticketStatus: 'sold-out',
    ticketUrl: 'https://tickets.qa.test/reference-chicago',
    waitlistUrl: 'https://tickets.qa.test/reference-chicago/waitlist',
    ticketProvider: 'QA Tickets',
    category: 'comedy',
  },
  {
    id: 'reference-san-francisco',
    title: 'San Francisco, CA',
    description: '',
    location: 'Harbor Theatre',
    start: '2026-11-22T04:00:00.000Z',
    end: '2026-11-22T06:00:00.000Z',
    allDay: false,
    timeZone: 'America/Los_Angeles',
    eventStatus: 'scheduled',
    ticketStatus: 'coming-soon',
    ticketUrl: null,
    waitlistUrl: null,
    ticketProvider: null,
    category: 'comedy',
  },
  {
    id: 'reference-new-york',
    title: 'New York, NY',
    description: '',
    location: 'The Assembly',
    start: '2026-12-06T00:00:00.000Z',
    end: '2026-12-06T02:00:00.000Z',
    allDay: false,
    timeZone: 'America/New_York',
    eventStatus: 'scheduled',
    ticketStatus: 'presale',
    ticketUrl: 'https://tickets.qa.test/reference-new-york',
    waitlistUrl: null,
    ticketProvider: 'QA Tickets',
    category: 'speaking',
  },
]
const events = referenceMatched ? referenceEvents : genericEvents
const feed = {
  status: 'ready',
  events,
  fetchedAt: '2026-10-25T12:00:00.000Z',
  refreshAfterSeconds: 60,
}
const cases = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'mobile-390', width: 390, height: 844 },
]

await mkdir(outputDirectory, { recursive: true })
const browser = await chromium.launch({ headless: true })

try {
  for (const viewport of cases) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: 'reduce',
      locale: 'en-US',
    })
    const page = await context.newPage()
    await page.route('**/api/appearances', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(feed) }),
    )
    await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.evaluate(() => window.dispatchEvent(new Event('focus')))
    await page.locator('#appearances').waitFor({ state: 'visible' })
    await page.evaluate(async () => {
      await document.fonts?.ready
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y)
        await new Promise((resolve) => window.setTimeout(resolve, 40))
      }
      window.scrollTo(0, 0)
      await Promise.all(Array.from(document.images, async (image) => {
        if (image.complete) return
        await new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true })
          image.addEventListener('error', resolve, { once: true })
        })
      }))
      await document.fonts?.ready
    })
    await page.waitForTimeout(100)
    await page.screenshot({
      path: `${outputDirectory}/qa-visual-${outputPrefix}-${viewport.name}.png`,
      fullPage: true,
      style: 'nextjs-portal { visibility: hidden !important; }',
    })
    await context.close()
  }
} finally {
  await browser.close()
}
