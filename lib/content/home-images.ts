import sources from './home-image-sources.json'

type HomeImage = keyof typeof sources

export const homeDestinationImageSizes = [
  '(min-width: 80rem) 23.667rem',
  '(min-width: 64rem) calc((100vw - 9rem) / 3)',
  '(min-width: 48rem) calc((100vw - 5.5rem) / 2)',
  'calc(100vw - 2rem)',
].join(', ')

const homeImagePreviewPath = (image: string, width: number) =>
  `/assets/derived/home/${image}-${width}.webp`

export function getHomeImageSrcSet(image: HomeImage, originalWidth: number) {
  const { originalPath, widths } = sources[image]
  return [
    ...widths.map((width) => `${homeImagePreviewPath(image, width)} ${width}w`),
    `${encodeURI(originalPath)} ${originalWidth}w`,
  ].join(', ')
}

export const homeImagePreviewSources = new Map(
  Object.entries(sources).flatMap(([image, { originalPath, widths }]) =>
    widths.map((width) => [homeImagePreviewPath(image, width), originalPath] as const),
  ),
)
