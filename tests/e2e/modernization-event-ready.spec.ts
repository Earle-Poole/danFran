import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import { getClientJavaScriptBundles, getRawPage, htmlAttribute, htmlTags } from '../helpers/m3-acceptance'
import { blockExternalRequests } from '../helpers/playwright-network'
import { qaEventIds } from '../helpers/calendar-public-id'
import { normalizeRobotsDirectives } from '../helpers/robots'

const getJsonLdEntries = (html: string): Array<Record<string, unknown>> => {
  const blocks = Array.from(html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi))
  return blocks.flatMap(([, content]) => {
    const parsed = JSON.parse(content.trim()) as { '@graph'?: Array<Record<string, unknown>> } | Array<Record<string, unknown>>
    return Array.isArray(parsed) ? parsed : parsed['@graph'] ?? [parsed]
  })
}

const getJsonLdTypes = (entries: Array<Record<string, unknown>>): unknown[] => entries.flatMap((entry) =>
  Array.isArray(entry['@type']) ? entry['@type'] : [entry['@type']],
)

test.beforeEach(async ({ page }) => {
  await blockExternalRequests(page)
})

test('server renders real fixture events and links using opaque public IDs', async ({ page, request }) => {
  const home = await getRawPage(request, '/')
  expect(home.status).toBe(200)
  expect(home.body).toContain('Chicago QA Arts Night')
  expect(home.body).toContain(`/calendar/${qaEventIds.chicago}`)

  await page.goto('/')
  await expect(page.locator('#appearances')).toBeVisible()
  await expect(page.getByRole('link', { name: /Chicago QA Arts Night/i })).toHaveAttribute(
    'href',
    `/calendar/${qaEventIds.chicago}`,
  )

  const response = await page.goto('/calendar')
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: /Chicago QA Arts Night/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Austin QA Storytelling Talk/i })).toBeVisible()
  await expect(page.getByText('Sold out')).toBeVisible()
  await expect(page.getByText('Postponed')).toBeVisible()
  await expect(page.getByText('Cancelled', { exact: true }).first()).toBeVisible()
  if (['desktop-chrome', 'compact-chrome'].includes(test.info().project.name)) {
    const viewport = test.info().project.name === 'desktop-chrome' ? 'desktop' : 'compact'
    const screenshotPath = path.resolve(process.cwd(), `output/modernization/after/evidence/calendar-positive-${viewport}.png`)
    await mkdir(path.dirname(screenshotPath), { recursive: true })
    await page.screenshot({ path: screenshotPath, fullPage: true })
  }
  await page.getByRole('link', { name: 'Chicago QA Arts Night', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/calendar/${qaEventIds.chicago}$`))
  await expect(page.getByRole('heading', { name: 'Chicago QA Arts Night' })).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(/\/calendar$/)
  await page.goForward()
  await expect(page).toHaveURL(new RegExp(`/calendar/${qaEventIds.chicago}$`))

  const raw = await getRawPage(request, '/calendar')
  expect(raw.status).toBe(200)
  expect(raw.body).toContain('Chicago QA Arts Night')
  expect(raw.body).toContain('Austin QA Storytelling Talk')
  expect(raw.body).not.toContain('Ended QA Event Must Not Be Published')
  expect(raw.body).toContain(`/calendar/${qaEventIds.chicago}`)
  expect(raw.body).toContain(`/calendar/${qaEventIds.austin}`)
  expect(raw.body).not.toMatch(/organizer@qa\.invalid|private-attendee@qa\.invalid|qa-chicago-event-2027|googleapis|private_key/i)

  const api = await request.get('/api/appearances')
  expect(api.status()).toBe(200)
  expect(api.headers()['cache-control']).toBe('no-store')
  const publicFeed = await api.json() as { status: string; events: Array<{ id: string }> }
  expect(publicFeed.status).toBe('ready')
  expect(publicFeed.events.some((event) => event.id === qaEventIds.chicago)).toBe(true)
  expect(publicFeed.events.every((event) => /^[a-f0-9]{24}$/.test(event.id))).toBe(true)
  expect(JSON.stringify(publicFeed)).not.toMatch(/organizer|attendees|private_key|client_email|qa-chicago-event-2027/i)

  const invalidId = await request.get('/calendar/not-a-public-id')
  expect(invalidId.status()).toBe(404)
  const endedEvent = await request.get(`/calendar/${qaEventIds.ended}`)
  expect(endedEvent.status()).toBe(404)
  expect(qaEventIds.chicago).toMatch(/^[a-f0-9]{24}$/)
})

test('renders event detail metadata, address schema, and sitemap links from source facts', async ({ page, request }) => {
  const route = `/calendar/${qaEventIds.chicago}`
  const raw = await getRawPage(request, route)
  expect(raw.status).toBe(200)
  expect(raw.body).toContain('Chicago QA Arts Night')

  const head = raw.body.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? raw.body
  const titles = Array.from(head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi))
  const descriptions = htmlTags(head, 'meta').filter((tag) => htmlAttribute(tag, 'name')?.toLowerCase() === 'description')
  const canonicals = htmlTags(head, 'link').filter((tag) => htmlAttribute(tag, 'rel')?.toLowerCase() === 'canonical')
  const ogTitles = htmlTags(head, 'meta').filter((tag) => htmlAttribute(tag, 'property') === 'og:title')
  const ogUrls = htmlTags(head, 'meta').filter((tag) => htmlAttribute(tag, 'property') === 'og:url')
  const ogImages = htmlTags(head, 'meta').filter((tag) => htmlAttribute(tag, 'property') === 'og:image')
  const robots = htmlTags(head, 'meta').find((tag) => htmlAttribute(tag, 'name')?.toLowerCase() === 'robots')
  expect(titles).toHaveLength(1)
  expect(titles[0][1]).toContain('Chicago QA Arts Night')
  expect(descriptions).toHaveLength(1)
  expect(htmlAttribute(descriptions[0], 'content')).toBeTruthy()
  expect(canonicals).toHaveLength(1)
  expect(htmlAttribute(canonicals[0], 'href')).toBe(`https://qa.invalid${route}`)
  expect(ogTitles).toHaveLength(1)
  expect(htmlAttribute(ogTitles[0], 'content')).toContain('Chicago QA Arts Night')
  expect(ogUrls).toHaveLength(1)
  expect(htmlAttribute(ogUrls[0], 'content')).toBe(`https://qa.invalid${route}`)
  expect(ogImages).toHaveLength(1)
  expect(htmlAttribute(ogImages[0], 'content')).toMatch(/^https:\/\/qa\.invalid\/assets\//)
  expect(htmlTags(head, 'meta').filter((tag) => htmlAttribute(tag, 'name')?.toLowerCase() === 'robots')).toHaveLength(1)
  expect(normalizeRobotsDirectives(htmlAttribute(robots ?? '', 'content'))).toEqual(['follow', 'index'])

  const graphEntries = getJsonLdEntries(raw.body)
  const event = graphEntries.find((entry) => {
    const types = Array.isArray(entry['@type']) ? entry['@type'] : [entry['@type']]
    return types.includes('Event')
  })
  const graphTypes = getJsonLdTypes(graphEntries)
  expect(graphTypes).toEqual(expect.arrayContaining(['Person', 'WebSite', 'Event']))
  expect(event).toBeDefined()
  expect(event?.name).toBe('Chicago QA Arts Night')
  expect(event?.startDate).toBe('2027-01-16T02:00:00.000Z')
  expect(event?.endDate).toBe('2027-01-16T04:00:00.000Z')
  expect(event?.offers).toBeUndefined()
  expect(JSON.stringify(event)).toContain('999 QA Way')
  expect(JSON.stringify(event)).toContain('60601')

  const incompleteVenue = await getRawPage(request, `/calendar/${qaEventIds.austin}`)
  expect(incompleteVenue.status).toBe(200)
  expect(incompleteVenue.body).toContain('Austin QA Storytelling Talk')
  expect(getJsonLdTypes(getJsonLdEntries(incompleteVenue.body))).not.toContain('Event')

  const detailResponse = await request.get(route)
  expect(detailResponse.status()).toBe(200)
  const hydratedPage = await detailResponse.text()
  expect(hydratedPage).not.toMatch(/organizer@qa\.invalid|private-attendee@qa\.invalid|GOOGLE_SERVICE_ACCOUNT_JSON|private_key|qa-synthetic-access-token/i)
  const clientBundles = await getClientJavaScriptBundles(request, raw.body)
  expect(clientBundles.length).toBeGreaterThan(0)
  const providerImplementationPattern = /GOOGLE_SERVICE_ACCOUNT_JSON|private_key|client_email|oauth2\.googleapis\.com\/token|www\.googleapis\.com\/calendar\/v3\/calendars|CalendarUnavailableError/gi
  const providerImplementationMatches = clientBundles.flatMap(({ src, body }) =>
    Array.from(body.matchAll(providerImplementationPattern), ([match]) => `${src}: ${match}`),
  )
  expect(providerImplementationMatches, 'provider implementation and credential identifiers must remain server-side').toEqual([])
  const fixtureEventData = clientBundles.flatMap(({ src, body }) =>
    Array.from(body.matchAll(/Chicago QA Arts Night|Austin QA Storytelling Talk/g), ([match]) => `${src}: ${match}`),
  )
  expect(fixtureEventData, 'server fixture event records must not be embedded in client JavaScript').toEqual([])

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  const sitemapXml = await sitemap.text()
  expect(sitemapXml).toContain(`https://qa.invalid${route}`)
  expect(sitemapXml).toContain(`https://qa.invalid/calendar/${qaEventIds.cancelled}`)
  expect(sitemapXml).not.toContain(`https://qa.invalid/calendar/${qaEventIds.ended}`)

  await page.goto(route)
  await expect(page.getByRole('heading', { name: 'Chicago QA Arts Night' })).toBeVisible()
  await expect(page.getByText('QA Auditorium')).toBeVisible()
  await expect(page.getByText('No waitlist available')).toBeVisible()
  await expect(page.getByRole('link', { name: /ticket|waitlist/i })).toHaveCount(0)
  if (['desktop-chrome', 'compact-chrome'].includes(test.info().project.name)) {
    const viewport = test.info().project.name === 'desktop-chrome' ? 'desktop' : 'compact'
    const screenshotPath = path.resolve(process.cwd(), `output/modernization/after/evidence/event-detail-${viewport}.png`)
    await mkdir(path.dirname(screenshotPath), { recursive: true })
    await page.screenshot({ path: screenshotPath, fullPage: true })
  }

  const cancelledRoute = `/calendar/${qaEventIds.cancelled}`
  const cancelled = await getRawPage(request, cancelledRoute)
  expect(cancelled.status).toBe(200)
  expect(cancelled.body).toContain('Cancelled QA Festival Appearance')
  await page.goto(cancelledRoute)
  await expect(page.locator('[data-status="cancelled"]')).toContainText(/Cancelled/)
  await expect(page.getByText('No ticket action')).toBeVisible()
  await expect(page.getByRole('link', { name: /ticket|waitlist/i })).toHaveCount(0)
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('keeps event listings and detail content available with ordinary links', async ({ page }) => {
    await page.goto('/calendar')
    const eventLink = page.getByRole('link', { name: /Chicago QA Arts Night/i })
    await expect(eventLink).toHaveAttribute('href', `/calendar/${qaEventIds.chicago}`)
    await eventLink.click()
    await expect(page).toHaveURL(new RegExp(`/calendar/${qaEventIds.chicago}$`))
    await expect(page.getByRole('heading', { name: 'Chicago QA Arts Night' })).toBeVisible()
  })
})
