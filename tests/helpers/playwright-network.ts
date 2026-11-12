import type { Page, Route } from '@playwright/test'

const localHosts = new Set(['127.0.0.1', 'localhost'])

function isLocalRequest(route: Route): boolean {
  try {
    return localHosts.has(new URL(route.request().url()).hostname)
  } catch {
    return false
  }
}

/** Keep browser checks deterministic and prevent real provider traffic. */
export async function blockExternalRequests(page: Page): Promise<void> {
  await page.route('**/*', (route) => {
    if (isLocalRequest(route)) {
      return route.continue()
    }

    return route.abort('blockedbyclient')
  })
}

/** Fulfill an external provider request with a local fixture response. */
export async function fulfillExternalRequest(
  page: Page,
  urlPattern: string,
  body: string,
  status = 200,
  contentType = 'application/json'
): Promise<void> {
  await page.route(urlPattern, (route) =>
    route.fulfill({
      status,
      contentType,
      body,
    })
  )
}

/** Exercise a provider error state without contacting the provider. */
export async function failExternalRequest(
  page: Page,
  urlPattern: string,
  status = 503
): Promise<void> {
  await page.route(urlPattern, (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'qa-fixture-provider-failure' }),
    })
  )
}
