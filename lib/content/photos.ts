import { downloadById } from './downloads'
import type { Aspect, PhotoRecord } from './types'

const focal = (x = 0.5, y = 0.5) => ({ x, y, unit: 'fraction' as const })

const photo = (
  record: Omit<PhotoRecord, 'verification'>,
  crop: 'source-confirmed' | 'not-reviewed' = 'not-reviewed',
  alt: 'source-confirmed' | 'not-reviewed' = 'source-confirmed'
): PhotoRecord => ({
  ...record,
  verification: {
    source: 'source-confirmed',
    alt,
    crop,
    credit: 'not-reviewed',
    license: 'not-reviewed',
    accessibility: 'not-reviewed',
  },
})

export const selectedPhotos = [
  photo(
    {
      id: 'selected-about-me',
      collection: 'selected',
      assetKind: 'portrait',
      originalPath: '/assets/about_me_photo1.webp',
      downloadId: 'download-about-me-photo',
      dimensions: { width: 800, height: 800, unit: 'px' },
      alt: 'Daniel Franzese in a blue jacket under pink and blue lighting',
      aspect: 'square',
      focal: { compact: focal(0.5, 0.38), wide: focal(0.5, 0.42) },
    },
    'source-confirmed'
  ),
  photo(
    {
      id: 'selected-about-2',
      collection: 'selected',
      assetKind: 'portrait',
      originalPath: '/assets/about_photo_2.webp',
      downloadId: 'download-about-photo-2',
      dimensions: { width: 800, height: 800, unit: 'px' },
      alt: 'Daniel Franzese in a white shirt reaching toward the camera',
      aspect: 'square',
      focal: { compact: focal(0.46, 0.36), wide: focal(0.48, 0.4) },
    },
    'source-confirmed'
  ),
  photo(
    {
      id: 'selected-modeling-03',
      collection: 'selected',
      assetKind: 'portrait',
      originalPath: '/assets/modelling_gallery/mg (3).webp',
      previewPath: '/assets/modelling_gallery/thumbnails/mg thumb (3).webp',
      downloadId: 'download-modeling-03',
      dimensions: { width: 1200, height: 1800, unit: 'px' },
      alt: 'Daniel Franzese in a dark sweater with one arm raised behind his head',
      aspect: 'portrait',
      focal: { compact: focal(0.5, 0.32), wide: focal(0.52, 0.4) },
    },
    'source-confirmed'
  ),
  photo(
    {
      id: 'selected-home-cover',
      collection: 'selected',
      assetKind: 'portrait',
      originalPath: '/assets/home_cover.webp',
      downloadId: 'download-home-cover',
      dimensions: { width: 1918, height: 1080, unit: 'px' },
      alt: 'Daniel Franzese in a hat with one visible eye and a hand at the brim',
      aspect: 'landscape',
      focal: { compact: focal(0.7, 0.5), wide: focal(0.68, 0.5) },
    },
    'source-confirmed'
  ),
] as const satisfies readonly PhotoRecord[]

const aspectFor = (width: number, height: number): Aspect => {
  if (width === height) return 'square'
  return width > height ? 'landscape' : 'portrait'
}

export const modelingPhotos = Array.from({ length: 24 }, (_, index) => {
  const number = index + 1
  const serial = String(number).padStart(2, '0')
  const download = downloadById(`download-modeling-${serial}`)
  if (!download?.dimensions || download.dimensions.unit !== 'px') {
    throw new Error(`Missing pixel dimensions for modeling photo ${serial}`)
  }

  return photo({
    id: `modeling-${serial}`,
    collection: 'modeling',
    assetKind: 'portrait',
    originalPath: download.path,
    previewPath: `/assets/modelling_gallery/thumbnails/mg thumb (${number}).webp`,
    downloadId: download.id,
    dimensions: download.dimensions,
    alt: `Daniel Franzese portrait from the modeling collection, image ${number}`,
    aspect: aspectFor(download.dimensions.width, download.dimensions.height),
    focal: { compact: focal(), wide: focal() },
  })
})

const pressPhotoIds = [
  'download-press-dan-fran',
  'download-press-dan-fran-1',
  'download-press-mean-girls',
  'download-press-yass',
  ...Array.from({ length: 16 }, (_, index) => `download-press-pk-${String(index + 1).padStart(2, '0')}`),
] as const

export const pressPhotos = pressPhotoIds.map((downloadId, index) => {
  const download = downloadById(downloadId)
  if (!download?.dimensions || download.dimensions.unit !== 'px') {
    throw new Error(`Missing pixel dimensions for press photo ${downloadId}`)
  }

  return photo({
    id: `press-${String(index + 1).padStart(2, '0')}`,
    collection: 'press',
    assetKind: 'press-photo',
    originalPath: download.path,
    downloadId: download.id,
    dimensions: download.dimensions,
    alt: `Daniel Franzese press photo from the press kit collection, image ${index + 1}`,
    aspect: aspectFor(download.dimensions.width, download.dimensions.height),
    focal: { compact: focal(), wide: focal() },
  })
})

export const photos = [...selectedPhotos, ...modelingPhotos, ...pressPhotos] as const

export const photoById = (id: string): PhotoRecord | undefined =>
  photos.find((photoRecord) => photoRecord.id === id)

export const selectPhotosByCollection = (
  collection: PhotoRecord['collection']
): readonly PhotoRecord[] => photos.filter((photoRecord) => photoRecord.collection === collection)

export const isPhotoPath = (path: string): boolean =>
  photos.some((photoRecord) => photoRecord.originalPath === path || photoRecord.previewPath === path)
