import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  contacts,
  downloads,
  mediaAssetInventory,
  photos,
  routes,
  selectIndexableRoutes,
  selectPhotosByCollection,
  validateContent,
  videos,
} from '../../../lib/content'
import type { InventoryAsset, PhotoRecord, RouteRecord, VideoRecord } from '../../../lib/content'

const mediaRoot = resolve(process.cwd(), 'public/assets')
const pressPreviewManifestPath = resolve(
  process.cwd(),
  'tests/fixtures/press-previews-manifest.json'
)

type PressPreviewManifestEntry = {
  readonly id: string
  readonly sourcePath: string
  readonly sourceSha256: string
  readonly sourceBytes: number
  readonly sourceDimensions: {
    readonly width: number
    readonly height: number
  }
  readonly previewPath: string
  readonly previewSha256: string
  readonly previewBytes: number
}

const readPressPreviewManifest = (): readonly PressPreviewManifestEntry[] => {
  if (!existsSync(pressPreviewManifestPath)) return []
  const manifest = JSON.parse(readFileSync(pressPreviewManifestPath, 'utf8')) as {
    readonly entries?: readonly PressPreviewManifestEntry[]
  }
  return manifest.entries ?? []
}

const sha256 = (path: string): string =>
  createHash('sha256').update(readFileSync(path)).digest('hex')

const walkMediaFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return walkMediaFiles(path)
    return /\.(webp|jpg|jpeg|png|pdf)$/i.test(entry.name) ? [path] : []
  })

const publicPath = (path: string): string => resolve(process.cwd(), 'public', `.${path}`)

describe('content contracts', () => {
  it('has no duplicate IDs, paths, missing assets, or unsupported metadata', () => {
    expect(validateContent()).toEqual([])
  })

  it('accounts for every image/PDF asset exactly once', () => {
    const actual = new Set(
      walkMediaFiles(mediaRoot).map((path) =>
        `/${relative(resolve(process.cwd(), 'public'), path).replaceAll('\\', '/')}`
      )
    )
    const inventory = new Set(mediaAssetInventory.map((asset) => asset.path))
    const previewEntries = readPressPreviewManifest()
    const derivedPaths = new Set(previewEntries.map((entry) => entry.previewPath))
    const nonPreviewAssets = new Set(
      Array.from(actual).filter((path) => !derivedPaths.has(path))
    )

    expect(inventory.size).toBe(mediaAssetInventory.length)
    expect(nonPreviewAssets).toEqual(inventory)
    expect(actual).toEqual(
      new Set([...Array.from(inventory), ...Array.from(derivedPaths)])
    )
  })

  it('verifies generated press previews against the exact manifest and source records', () => {
    const previewEntries = readPressPreviewManifest()
    const derivedRoot = resolve(process.cwd(), 'public/assets/derived/press')

    if (previewEntries.length === 0) {
      expect(existsSync(derivedRoot)).toBe(false)
      return
    }

    expect(previewEntries).toHaveLength(20)
    expect(new Set(previewEntries.map((entry) => entry.id)).size).toBe(20)
    expect(new Set(previewEntries.map((entry) => entry.previewPath)).size).toBe(20)

    previewEntries.forEach((entry) => {
      const source = publicPath(entry.sourcePath)
      const preview = publicPath(entry.previewPath)
      const sourceDownload = downloads.find((download) => download.id === entry.id)

      expect(sourceDownload).toBeDefined()
      expect(entry.sourcePath).toBe(sourceDownload?.path)
      expect(entry.sourceDimensions).toEqual({
        width: sourceDownload?.dimensions?.width,
        height: sourceDownload?.dimensions?.height,
      })
      expect(statSync(source).size).toBe(entry.sourceBytes)
      expect(sha256(source)).toBe(entry.sourceSha256)
      expect(statSync(preview).size).toBe(entry.previewBytes)
      expect(sha256(preview)).toBe(entry.previewSha256)
      expect(entry.previewPath).toBe(`/assets/derived/press/${entry.id}.webp`)
      expect(entry.sourceBytes).toBe(sourceDownload?.bytes)
    })
  })

  it('keeps modeling previews distinct from the 24 source records', () => {
    const modeling = selectPhotosByCollection('modeling')
    const originals = new Set(modeling.map((photo) => photo.originalPath))
    const previews = new Set(modeling.map((photo) => photo.previewPath))

    expect(modeling).toHaveLength(24)
    expect(originals).toHaveLength(24)
    expect(previews).toHaveLength(24)
    modeling.forEach((photo) => expect(photo.originalPath).not.toBe(photo.previewPath))
    modeling.forEach((photo) => {
      expect(photo.dimensions.unit).toBe('px')
      expect(photo.focal.compact.unit).toBe('fraction')
      expect(photo.focal.wide.unit).toBe('fraction')
      expect(photo.focal.compact.x).toBeGreaterThanOrEqual(0)
      expect(photo.focal.compact.x).toBeLessThanOrEqual(1)
      expect(photo.focal.compact.y).toBeGreaterThanOrEqual(0)
      expect(photo.focal.compact.y).toBeLessThanOrEqual(1)
    })
  })

  it('retains all press photos, both PDF downloads, and all ten video records', () => {
    expect(selectPhotosByCollection('press')).toHaveLength(20)
    expect(downloads.filter((download) => download.format === 'pdf')).toHaveLength(2)
    expect(videos).toHaveLength(10)
    videos.forEach((video) => {
      expect(video.thumbnailUrl).toContain(`/vi/${video.videoId}/`)
      expect(video.duration).toBeUndefined()
      expect(video.uploadDate).toBeUndefined()
      expect(video.captionStatus).toBe('not-reviewed')
      expect(video.descriptionStatus).toBe('not-reviewed')
      expect(video.transcriptStatus).toBe('not-reviewed')
    })
  })

  it('preserves truthful contact and route semantics', () => {
    expect(contacts[0].email.visible).toBe('Gary@AdvancedManagement.tv')
    expect(contacts[0].email.destination).toBe('mailto:Gary@AdvancedManagement.tv')
    expect(contacts[0].phones[0].destination).toBe('tel:+14243331500')
    expect(routes.find((route) => route.id === 'legacy-home')?.canonicalPath).toBe('/')
    expect(routes.find((route) => route.id === 'about')?.availability).toBe('available')
    expect(routes.find((route) => route.id === 'booking')?.availability).toBe('available')
    expect(routes.find((route) => route.id === 'not-found')?.availability).toBe('available')
    const indexableIds = selectIndexableRoutes().map((route) => route.id)
    expect(indexableIds).toEqual([
      'home',
      'about',
      'press-kit',
      'portraits',
      'videos',
      'booking',
    ])
    expect(indexableIds.filter((id) => id === 'about')).toHaveLength(1)
    expect(indexableIds.filter((id) => id === 'booking')).toHaveLength(1)
    expect(indexableIds).not.toContain('legacy-home')
    expect(indexableIds).not.toContain('calendar')
    expect(indexableIds).not.toContain('not-found')
    const plannedFixture: RouteRecord = {
      ...routes[0],
      id: routes[0].id,
      path: '/fixture-planned',
      label: 'Fixture planned route',
      availability: 'planned',
      indexable: true,
    }
    expect(selectIndexableRoutes([...routes, plannedFixture])).not.toContain(plannedFixture)
    expect(routes.find((route) => route.id === 'home')?.preservedFragments).toEqual([
      '#home',
      '#about',
      '#cameo',
      '#contact',
    ])
  })

  it('rejects bad paths, duplicate IDs, missing inventory, and invented video metadata', () => {
    const firstPhoto = photos[0]
    const firstVideo = videos[0]
    const duplicatePhoto: PhotoRecord = { ...firstPhoto, originalPath: '/assets/not-present.webp' }
    const invalidFocalPhoto: PhotoRecord = {
      ...firstPhoto,
      id: 'invalid-focal-photo',
      focal: {
        compact: { x: Number.NaN, y: 0.5, unit: 'fraction' },
        wide: { x: 1.1, y: 0.5, unit: 'fraction' },
      },
    }
    const inventedVideo: VideoRecord = { ...firstVideo, duration: '02:00' }
    const missingInventory: InventoryAsset[] = mediaAssetInventory.filter(
      (asset) => asset.path !== firstPhoto.originalPath
    )

    const issues = validateContent({
      routes,
      photos: [...photos, duplicatePhoto, invalidFocalPhoto],
      downloads,
      videos: [...videos, inventedVideo],
      inventory: missingInventory,
    })

    expect(issues.some((issue) => issue.code === 'duplicate-id')).toBe(true)
    expect(issues.some((issue) => issue.code === 'missing-asset')).toBe(true)
    expect(issues.some((issue) => issue.code === 'invented-metadata')).toBe(true)
    expect(issues.some((issue) => issue.code === 'invalid-focal')).toBe(true)
    expect(statSync(publicPath(firstPhoto.originalPath)).isFile()).toBe(true)
  })
})
