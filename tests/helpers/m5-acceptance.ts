import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Page } from '@playwright/test'
import {
  extractAssetPath,
  imageAttributeValues,
  modelingOriginalPaths,
  originalAssetReferences,
  pressOriginalPaths,
} from './m4-acceptance'

export const m5AcceptanceEnabled = process.env.RUN_M5_ACCEPTANCE === '1'

export type M5PressPreviewManifestEntry = {
  id: string
  sourcePath: string
  sourceSha256: string
  sourceBytes: number
  sourceDimensions: { width: number; height: number }
  previewPath: string
  previewSha256: string
  previewBytes: number
  previewDimensions: { width: number; height: number }
  format: string
  quality: number
  resizeWidth: number
}

export function readM5PressPreviewManifest(): M5PressPreviewManifestEntry[] {
  const manifestPath = path.resolve(process.cwd(), 'tests/fixtures/press-previews-manifest.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { entries?: M5PressPreviewManifestEntry[] }
  if (!Array.isArray(manifest.entries)) throw new Error(`Press preview manifest has no entries: ${manifestPath}`)
  return manifest.entries
}

export const m5CanonicalRoutes = [
  '/',
  '/about',
  '/booking',
  '/press-kit',
  '/modeling-gallery',
  '/video-gallery',
] as const

export const m5ResponsiveViewports = [
  { name: '320x900', width: 320, height: 900 },
  { name: '390x844', width: 390, height: 844 },
  { name: '768x900', width: 768, height: 900 },
  { name: '1024x900', width: 1024, height: 900 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '844x390-short-landscape', width: 844, height: 390 },
] as const

export const m5ExpectedLocalOriginals: Record<(typeof m5CanonicalRoutes)[number], readonly string[]> = {
  '/': [
    '/assets/home_cover.webp',
    '/assets/about_me_photo1.webp',
    '/assets/about_photo_2.webp',
    '/assets/modelling_gallery/mg (3).webp',
  ],
  '/about': ['/assets/about_me_photo1.webp', '/assets/about_photo_2.webp'],
  '/booking': ['/assets/about_me_photo1.webp'],
  '/press-kit': pressOriginalPaths,
  '/modeling-gallery': [],
  '/video-gallery': [],
}

export const m5ExpectedModelingDownloads = modelingOriginalPaths

export const m5RouteHeadings: Record<(typeof m5CanonicalRoutes)[number], string> = {
  '/': 'Daniel Franzese',
  '/about': 'More than a familiar face.',
  '/booking': "Let's work together.",
  '/press-kit': 'Press kit.',
  '/modeling-gallery': 'In focus.',
  '/video-gallery': 'Press play.',
}

export async function settleLocalImages(page: Page): Promise<void> {
  const result = await page.evaluate(async () => {
    const deadline = performance.now() + 15_000
    const isLocalImage = (image: HTMLImageElement) => {
      const source = image.currentSrc || image.src
      if (source.includes('/assets/')) return true
      if (!source.includes('/_next/image')) return false
      const requested = new URL(source, window.location.href).searchParams.get('url') ?? ''
      return requested.startsWith('/assets/') || requested.startsWith(`${window.location.origin}/assets/`)
    }
    const localImages = Array.from(document.images).filter(isLocalImage)
    const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    const waitForLoadOrError = (image: HTMLImageElement, timeoutMs: number) => new Promise<void>((resolve) => {
      let settled = false
      const finish = () => {
        if (settled) return
        settled = true
        image.removeEventListener('load', finish)
        image.removeEventListener('error', finish)
        resolve()
      }
      image.addEventListener('load', finish, { once: true })
      image.addEventListener('error', finish, { once: true })
      window.setTimeout(finish, timeoutMs)
    })
    const outcomes = []

    for (const image of localImages) {
      image.scrollIntoView({ block: 'center', inline: 'nearest' })
      await nextFrame()
      const remainingMs = Math.max(0, deadline - performance.now())
      if (!image.complete && remainingMs > 0) await waitForLoadOrError(image, remainingMs)
      let decoded = image.complete && image.naturalWidth > 0
      const decodeRemainingMs = Math.max(0, deadline - performance.now())
      if (decoded && typeof image.decode === 'function') {
        if (decodeRemainingMs <= 0) {
          decoded = false
        } else {
          decoded = await Promise.race([
            image.decode().then(() => true).catch(() => false),
            new Promise<boolean>((resolve) => window.setTimeout(() => resolve(false), decodeRemainingMs)),
          ])
        }
      }
      outcomes.push({
        src: image.currentSrc || image.src,
        loading: image.loading,
        complete: image.complete,
        decoded,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        scrollY: window.scrollY,
      })
    }
    window.scrollTo(0, 0)
    return { total: outcomes.length, failed: outcomes.filter((image) => !image.complete || !image.decoded || image.naturalWidth <= 0 || image.naturalHeight <= 0), outcomes }
  })
  if (result.failed.length > 0) {
    throw new Error(`Settled local-image gate failed for ${result.failed.length}/${result.total}: ${JSON.stringify(result.failed)}`)
  }
}

export async function renderedAssetPaths(page: Page): Promise<string[]> {
  const attributes = await imageAttributeValues(page)
  return originalAssetReferences(attributes)
}

export async function downloadedAssetPaths(page: Page): Promise<string[]> {
  const hrefs = await page.locator('main a[download]').evaluateAll((links) =>
    links
      .map((link) => link.getAttribute('href'))
      .filter((href): href is string => Boolean(href)),
  )
  return originalAssetReferences(hrefs)
}

export async function gallerySourceDownloadPairs(page: Page): Promise<Array<{
  sourcePath: string | undefined
  downloadPath: string | undefined
}>> {
  return page.locator('main article').evaluateAll((cards) =>
    cards.map((card) => {
      const image = card.querySelector('img')
      const source = image?.currentSrc || image?.getAttribute('src') || undefined
      const download = card.querySelector<HTMLAnchorElement>('a[download]')?.getAttribute('href') || undefined
      return { sourcePath: source, downloadPath: download }
    }),
  )
}

export async function pressSourceDownloadPairs(page: Page): Promise<Array<{
  sourcePath: string | undefined
  srcSet: string
  downloadPath: string | undefined
  width: number
  height: number
}>> {
  return page.locator('main article:has(a[download])').evaluateAll((cards) =>
    cards.map((card) => {
      const image = card.querySelector('img')
      const source = image?.currentSrc || image?.getAttribute('src') || undefined
      const download = card.querySelector<HTMLAnchorElement>('a[download]')?.getAttribute('href') || undefined
      return {
        sourcePath: source,
        srcSet: image?.getAttribute('srcset') ?? '',
        downloadPath: download,
        width: image?.naturalWidth ?? 0,
        height: image?.naturalHeight ?? 0,
      }
    }),
  )
}

export async function visibleControlAudit(page: Page): Promise<Array<{
  tag: string
  name: string
  width: number
  height: number
}>> {
  return page.locator('main a:visible, main button:visible, main input:visible, main select:visible, main textarea:visible').evaluateAll((elements) =>
    elements.map((element) => {
      const ariaLabel = element.getAttribute('aria-label') ?? ''
      const ariaLabelledBy = element.getAttribute('aria-labelledby') ?? ''
      const referencedLabel = ariaLabelledBy
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent ?? '')
        .join(' ')
      const explicitLabel = element.id
        ? Array.from(document.querySelectorAll('label')).find((label) => label.htmlFor === element.id)?.textContent ?? ''
        : ''
      const title = element.getAttribute('title') ?? ''
      const value = element instanceof HTMLInputElement ? element.value : ''
      return {
        tag: element.tagName.toLowerCase(),
        name: (ariaLabel || referencedLabel || explicitLabel || element.textContent || title || value).trim(),
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
      }
    }),
  )
}

export function assetPathFromValue(value: string): string | undefined {
  return extractAssetPath(value)
}
