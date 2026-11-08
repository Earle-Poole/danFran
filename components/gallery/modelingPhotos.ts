import { modelingPhotos, selectedPhotos } from 'lib/content'

const selectedOpeningIds = [
  'modeling-03',
  'selected-about-2',
  'selected-about-me',
  'selected-home-cover',
] as const

const selectedById = new Map([...modelingPhotos, ...selectedPhotos].map((photo) => [photo.id, photo]))

const openingPhotos = selectedOpeningIds.flatMap((id) => {
  const photo = selectedById.get(id)
  return photo ? [photo] : []
})

const openingSourcePaths = new Set(openingPhotos.map((photo) => photo.originalPath))

/** One ordered list: the curated opening plus each remaining modeling original exactly once. */
export const orderedModelingGalleryPhotos = [
  ...openingPhotos,
  ...modelingPhotos.filter((photo) => !openingSourcePaths.has(photo.originalPath)),
] as const

export const curatedModelingGalleryIds = selectedOpeningIds
