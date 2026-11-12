import { downloads, mediaAssetInventory } from './downloads'
import { photos } from './photos'
import { routes } from './routes'
import { videos } from './videos'
import type { DownloadRecord, InventoryAsset, PhotoRecord, RouteRecord, VideoRecord } from './types'

export type ContentIssue = {
  readonly code:
  | 'duplicate-id'
  | 'duplicate-path'
  | 'missing-asset'
  | 'missing-download'
  | 'invented-metadata'
  | 'invalid-focal'
  | 'invalid-video'
  readonly record: string
  readonly message: string
}

const duplicateIssues = (values: readonly string[], code: ContentIssue['code'], record: string): ContentIssue[] => {
  const seen = new Set<string>()
  const issues: ContentIssue[] = []
  values.forEach((value) => {
    if (seen.has(value)) {
      issues.push({ code, record, message: `Duplicate value: ${value}` })
    }
    seen.add(value)
  })
  return issues
}

export const validateContent = (input: {
  readonly routes: readonly RouteRecord[]
  readonly photos: readonly PhotoRecord[]
  readonly downloads: readonly DownloadRecord[]
  readonly videos: readonly VideoRecord[]
  readonly inventory: readonly InventoryAsset[]
} = { routes, photos, downloads, videos, inventory: mediaAssetInventory }): readonly ContentIssue[] => {
  const issues: ContentIssue[] = [
    ...duplicateIssues(input.routes.map((route) => route.id), 'duplicate-id', 'routes'),
    ...duplicateIssues(input.routes.map((route) => route.path), 'duplicate-path', 'routes'),
    ...duplicateIssues(input.photos.map((photo) => photo.id), 'duplicate-id', 'photos'),
    ...duplicateIssues(input.downloads.map((download) => download.id), 'duplicate-id', 'downloads'),
    ...duplicateIssues(input.videos.map((video) => video.id), 'duplicate-id', 'videos'),
    ...duplicateIssues(input.videos.map((video) => video.videoId), 'duplicate-id', 'videos'),
    ...duplicateIssues(input.inventory.map((asset) => asset.path), 'duplicate-path', 'asset-inventory'),
  ]

  const inventoryPaths = new Set(input.inventory.map((asset) => asset.path))
  const downloadIds = new Set(input.downloads.map((download) => download.id))

  input.photos.forEach((photo) => {
    if (!inventoryPaths.has(photo.originalPath)) {
      issues.push({ code: 'missing-asset', record: photo.id, message: `Original path is not inventoried: ${photo.originalPath}` })
    }
    if (photo.previewPath && !inventoryPaths.has(photo.previewPath)) {
      issues.push({ code: 'missing-asset', record: photo.id, message: `Preview path is not inventoried: ${photo.previewPath}` })
    }
    if (!downloadIds.has(photo.downloadId)) {
      issues.push({ code: 'missing-download', record: photo.id, message: `Download record is missing: ${photo.downloadId}` })
    }
    if (photo.dimensions.unit !== 'px') {
      issues.push({ code: 'invalid-focal', record: photo.id, message: 'Photo dimensions must be expressed in pixels.' })
    }
    for (const position of [photo.focal.compact, photo.focal.wide]) {
      if (
        position.unit !== 'fraction' ||
        !Number.isFinite(position.x) ||
        !Number.isFinite(position.y) ||
        position.x < 0 ||
        position.x > 1 ||
        position.y < 0 ||
        position.y > 1
      ) {
        issues.push({ code: 'invalid-focal', record: photo.id, message: 'Focal coordinates must be normalized fractions from 0 through 1.' })
      }
    }
    if (photo.credit && photo.verification.credit !== 'source-confirmed') {
      issues.push({ code: 'invented-metadata', record: photo.id, message: 'A photo credit is present without source confirmation.' })
    }
  })

  input.downloads.forEach((download) => {
    if (!inventoryPaths.has(download.path)) {
      issues.push({ code: 'missing-asset', record: download.id, message: `Download path is not inventoried: ${download.path}` })
    }
    if (download.previewPath && !inventoryPaths.has(download.previewPath)) {
      issues.push({ code: 'missing-asset', record: download.id, message: `Download preview is not inventoried: ${download.previewPath}` })
    }
  })

  input.videos.forEach((video) => {
    if (!video.videoId || !video.thumbnailUrl.includes(`/vi/${video.videoId}/`)) {
      issues.push({ code: 'invalid-video', record: video.id, message: 'Video provider ID and thumbnail URL do not agree.' })
    }
    if (video.captionStatus === 'not-reviewed' && video.duration) {
      issues.push({ code: 'invented-metadata', record: video.id, message: 'A duration is present while video metadata remains not-reviewed.' })
    }
    if (video.captionStatus === 'not-reviewed' && video.uploadDate) {
      issues.push({ code: 'invented-metadata', record: video.id, message: 'An upload date is present while video metadata remains not-reviewed.' })
    }
  })

  return issues
}

export const contentIssues = validateContent()
