import type { APIRequestContext, Page } from '@playwright/test'
import { getRawPage } from './m3-acceptance'

export const m4AcceptanceEnabled = process.env.RUN_M4_ACCEPTANCE === '1'
export const m4FixtureOrigin = process.env.M4_SITE_ORIGIN ?? process.env.M3_SITE_ORIGIN ?? 'https://qa.invalid'

export const modelingOriginalPaths = Array.from(
  { length: 24 },
  (_, index) => '/assets/modelling_gallery/mg (' + (index + 1) + ').webp',
)

export const pressOriginalPaths = [
  '/assets/press_kit/pressPhotos/DanFranPress_DanFran.webp',
  '/assets/press_kit/pressPhotos/DanFranPress_DanFran1.webp',
  '/assets/press_kit/pressPhotos/DanFranPress_MeanGirls.webp',
  '/assets/press_kit/pressPhotos/DanFranPress_YASS_comedyTour.webp',
  ...Array.from(
    { length: 16 },
    (_, index) => '/assets/press_kit/pressPhotos/pk' + (index + 1) + '.webp',
  ),
]

export const videoTitles = [
  'Shit Italian Moms Say #1',
  'Shit Italian Moms Say #2',
  'Shit Italian Moms Say #3',
  'Stand Up Comedy Act',
  'Italian MOMster: Danny Scares Mom!',
  'Italian Mom: Embarrassing Family Stories',
  'Daniel Franzese Hosts the Voice Awards',
  'Daniel Franzese on Hey Queen',
  "15 Things You Didn't Know About Daniel Franzese",
  'Daniel Franzese Interview on Pop Trigger',
] as const

export type M4NetworkOptions = {
  failGalleryPath?: string
  failNewsletter?: boolean
  failVideoProvider?: boolean
  failVideoThumbnailId?: string
  allowVideoThumbnails?: boolean
}

const isLocalUrl = (url: URL): boolean =>
  url.hostname === '127.0.0.1' || url.hostname === 'localhost'

const decodedUrl = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export async function installM4Network(
  page: Page,
  options: M4NetworkOptions = {},
): Promise<string[]> {
  const externalRequests: string[] = []
  await page.route('**/*', async (route) => {
    const requestUrl = route.request().url()
    const url = new URL(requestUrl)
    if (isLocalUrl(url)) {
      if (options.failGalleryPath && decodedUrl(requestUrl).includes(options.failGalleryPath)) {
        await route.fulfill({
          status: 503,
          contentType: 'text/plain',
          body: 'qa-fixture-gallery-failure',
        })
        return
      }
      await route.continue()
      return
    }

    externalRequests.push(requestUrl)
    const isVideoProvider = url.hostname === 'www.youtube.com' || url.hostname === 'img.youtube.com'
    const isVideoThumbnail = url.hostname === 'img.youtube.com' && /\/vi\/[^/]+\/0\.jpg/.test(url.pathname)
    if (options.failVideoThumbnailId && isVideoThumbnail && url.pathname.includes('/vi/' + options.failVideoThumbnailId + '/')) {
      await route.fulfill({
        status: 503,
        contentType: 'text/plain',
        body: 'qa-fixture-video-thumbnail-failure',
      })
      return
    }
    if (options.allowVideoThumbnails && isVideoThumbnail) {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
          'base64',
        ),
      })
      return
    }
    if (options.failVideoProvider && isVideoProvider) {
      await route.fulfill({
        status: 503,
        contentType: 'text/plain',
        body: 'qa-fixture-video-provider-failure',
      })
      return
    }

    if (options.failNewsletter && route.request().method() === 'POST') {
      await route.fulfill({
        status: 503,
        contentType: 'text/plain',
        body: 'qa-fixture-newsletter-failure',
      })
      return
    }

    await route.abort('blockedbyclient')
  })
  return externalRequests
}

export async function getM4RawPage(
  request: APIRequestContext,
  pathname: string,
) {
  return getRawPage(request, pathname)
}

export function extractAssetPath(value: string): string | undefined {
  try {
    const url = new URL(value, 'https://qa.invalid')
    if (url.pathname === '/_next/image') {
      return url.searchParams.get('url') ?? undefined
    }
    return url.pathname.startsWith('/assets/') ? decodeURIComponent(url.pathname) : undefined
  } catch {
    return undefined
  }
}

export function originalAssetReferences(values: readonly string[]): string[] {
  return values.flatMap((value) =>
    (() => {
      const directPath = extractAssetPath(value)
      if (directPath) return [directPath]
      return value
        .split(/\s+/)
        .map((candidate) => extractAssetPath(candidate))
        .filter((path): path is string => Boolean(path))
    })(),
  )
}

export async function imageAttributeValues(page: Page): Promise<string[]> {
  return page.locator('main img').evaluateAll((images) =>
    images.flatMap((image) =>
      ['src', 'srcset', 'data-src', 'data-original'].flatMap((attribute) => {
        const value = image.getAttribute(attribute)
        return value ? [value] : []
      }),
    ),
  )
}
