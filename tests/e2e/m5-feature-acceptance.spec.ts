import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import { homeImagePreviewSources } from '../../lib/content/home-images'
import { installM4Network, pressOriginalPaths } from '../helpers/m4-acceptance'
import {
  m5AcceptanceEnabled,
  m5CanonicalRoutes,
  m5ExpectedLocalOriginals,
  m5ExpectedModelingDownloads,
  pressSourceDownloadPairs,
  readM5PressPreviewManifest,
  m5ResponsiveViewports,
  m5RouteHeadings,
  assetPathFromValue,
  downloadedAssetPaths,
  gallerySourceDownloadPairs,
  renderedAssetPaths,
  settleLocalImages,
} from '../helpers/m5-acceptance'

test.skip(!m5AcceptanceEnabled, 'M5 acceptance is enabled only after the integrated M5 handoff')

const routeFileName = (route: (typeof m5CanonicalRoutes)[number]) =>
  route === '/' ? 'home' : route.slice(1).replaceAll('-', '_')

test.describe('M5 settled media and source fidelity', () => {
  test('serves every Press original and derived preview with manifest hashes', async ({ request }) => {
    const pressManifest = readM5PressPreviewManifest()
    expect(pressManifest.length).toBe(pressOriginalPaths.length)
    expect(new Set(pressManifest.map((entry) => entry.id)).size).toBe(pressOriginalPaths.length)
    expect(new Set(pressManifest.map((entry) => entry.sourcePath)).size).toBe(pressOriginalPaths.length)
    expect(new Set(pressManifest.map((entry) => entry.previewPath)).size).toBe(pressOriginalPaths.length)

    for (const entry of pressManifest) {
      expect(pressOriginalPaths, `${entry.id} manifest source`).toContain(entry.sourcePath)
      const originalResponse = await request.get(entry.sourcePath)
      expect(originalResponse.ok(), `${entry.id} original should be served`).toBe(true)
      expect(createHash('sha256').update(await originalResponse.body()).digest('hex'), `${entry.id} original SHA-256`).toBe(entry.sourceSha256)
      const previewResponse = await request.get(entry.previewPath)
      expect(previewResponse.ok(), `${entry.id} preview should be served`).toBe(true)
      expect(previewResponse.headers()['content-type'], `${entry.id} preview content type`).toMatch(/^image\/webp/i)
      expect(createHash('sha256').update(await previewResponse.body()).digest('hex'), `${entry.id} preview SHA-256`).toBe(entry.previewSha256)
    }
  })

  for (const viewport of m5ResponsiveViewports) {
    for (const route of m5CanonicalRoutes) {
      test(`${route} @ ${viewport.name} settles local images and preserves source identity`, async ({ page }) => {
        await installM4Network(page)
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto(route, { waitUntil: 'networkidle' })
        await expect(page.locator('main h1').first()).toBeVisible()
        await expect(page.locator('main h1').first()).toHaveText(m5RouteHeadings[route])
        await settleLocalImages(page)

        const renderedPaths = new Set(await renderedAssetPaths(page))
        if (route === '/press-kit') {
          const pressManifest = readM5PressPreviewManifest()
          const manifestByPreviewPath = new Map(pressManifest.map((entry) => [entry.previewPath, entry]))
          for (const entry of pressManifest) {
            expect(renderedPaths.has(entry.previewPath), `${route} @ ${viewport.name} should render ${entry.previewPath}`).toBe(true)
          }

          const pairs = await pressSourceDownloadPairs(page)
          expect(pairs.length, `${route} @ ${viewport.name} should expose 20 downloadable photo cards`).toBe(pressOriginalPaths.length)
          for (const { sourcePath, srcSet, downloadPath, width, height } of pairs) {
            const source = sourcePath ? assetPathFromValue(sourcePath) : undefined
            const download = downloadPath ? assetPathFromValue(downloadPath) : undefined
            const entry = source ? manifestByPreviewPath.get(source) : undefined
            expect(entry, `${route} @ ${viewport.name} rendered source ${source} must be a manifest preview`).toBeDefined()
            expect(download, `${route} @ ${viewport.name} preview ${source} must keep its original download`).toBe(entry?.sourcePath)
            expect(source, `${route} @ ${viewport.name} preview/download identity must not use the original`).not.toBe(download)
            expect(srcSet, `${route} @ ${viewport.name} uses one derived preview per stable ID; no srcSet variants are claimed`).toBe('')
            expect(width, `${route} @ ${viewport.name} decoded width for ${source}`).toBe(entry?.previewDimensions.width)
            expect(height, `${route} @ ${viewport.name} decoded height for ${source}`).toBe(entry?.previewDimensions.height)
          }
        } else {
          const renderedOriginals = route === '/'
            ? new Set(Array.from(renderedPaths, (assetPath) => homeImagePreviewSources.get(assetPath) ?? assetPath))
            : renderedPaths
          for (const expectedPath of m5ExpectedLocalOriginals[route]) {
            expect(renderedOriginals.has(expectedPath), `${route} @ ${viewport.name} should render ${expectedPath} or its responsive copy`).toBe(true)
          }
        }
        expect(Array.from(renderedPaths).some((assetPath) => assetPath.includes('/output/') || assetPath.includes('concept'))).toBe(false)

        if (route === '/modeling-gallery') {
          const downloadPaths = new Set(await downloadedAssetPaths(page))
          expect(downloadPaths.size).toBeGreaterThanOrEqual(m5ExpectedModelingDownloads.length)
          for (const expectedPath of m5ExpectedModelingDownloads) {
            expect(downloadPaths.has(expectedPath), `${route} @ ${viewport.name} should download ${expectedPath}`).toBe(true)
          }
          const thumbnailPaths = Array.from(renderedPaths).filter((assetPath) => assetPath.includes('/modelling_gallery/thumbnails/mg thumb ('))
          expect(thumbnailPaths.length, `${route} @ ${viewport.name} should render 24 thumbnails`).toBe(24)

          const pairs = await gallerySourceDownloadPairs(page)
          expect(pairs.length, `${route} @ ${viewport.name} should expose one card per gallery item`).toBe(27)
          for (const { sourcePath, downloadPath } of pairs) {
            const source = sourcePath ? assetPathFromValue(sourcePath) : undefined
            const download = downloadPath ? assetPathFromValue(downloadPath) : undefined
            const thumbnailMatch = source?.match(/^\/assets\/modelling_gallery\/thumbnails\/mg thumb \((\d+)\)\.webp$/)
            if (thumbnailMatch) {
              const expectedOriginal = `/assets/modelling_gallery/mg (${thumbnailMatch[1]}).webp`
              expect(download, `${route} @ ${viewport.name} thumbnail ${source} should map to its original`).toBe(expectedOriginal)
              expect(source, `${route} @ ${viewport.name} must not use the original as its thumbnail`).not.toBe(download)
            } else {
              expect(source, `${route} @ ${viewport.name} direct source/download identity`).toBe(download)
            }
          }
        }

        fs.mkdirSync(path.resolve(process.cwd(), 'docs/reports/QA-M5/visual'), { recursive: true })
        await page.screenshot({
          path: path.resolve(process.cwd(), 'docs/reports/QA-M5/visual', `${viewport.name}-${routeFileName(route)}.png`),
          fullPage: true,
        })
      })
    }
  }
})
