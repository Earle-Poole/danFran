import type { DownloadRecord, InventoryAsset } from './types'

const imageDownload = (
  id: string,
  path: `/${string}`,
  label: string,
  bytes: number,
  width: number,
  height: number,
  format: 'jpg' | 'webp'
): DownloadRecord => ({
  id,
  path,
  label,
  mimeType: format === 'jpg' ? 'image/jpeg' : 'image/webp',
  format,
  bytes,
  dimensions: { width, height, unit: 'px' },
  availability: 'available',
  verification: 'source-confirmed',
})

const pdfDownload = (
  id: string,
  path: `/${string}`,
  previewPath: `/${string}`,
  label: string,
  bytes: number
): DownloadRecord => ({
  id,
  path,
  label,
  mimeType: 'application/pdf',
  format: 'pdf',
  bytes,
  dimensions: { width: 612, height: 792, unit: 'pt' },
  previewPath,
  availability: 'available',
  verification: 'source-confirmed',
})

export const downloads = [
  imageDownload('download-about-me-photo', '/assets/about_me_photo1.jpg', 'About portrait source', 585125, 800, 800, 'jpg'),
  imageDownload('download-about-photo-2', '/assets/about_photo_2.jpg', 'About portrait source', 79293, 800, 800, 'jpg'),
  imageDownload('download-home-cover', '/assets/home_cover.jpg', 'Home cover portrait source', 1572873, 1918, 1080, 'jpg'),
  imageDownload('download-modeling-01', '/assets/modelling_gallery/mg (1).webp', 'Portrait 01', 106730, 2119, 1412, 'webp'),
  imageDownload('download-modeling-02', '/assets/modelling_gallery/mg (2).webp', 'Portrait 02', 235788, 1200, 1800, 'webp'),
  imageDownload('download-modeling-03', '/assets/modelling_gallery/mg (3).webp', 'Portrait 03', 373246, 1200, 1800, 'webp'),
  imageDownload('download-modeling-04', '/assets/modelling_gallery/mg (4).webp', 'Portrait 04', 43190, 1456, 1456, 'webp'),
  imageDownload('download-modeling-05', '/assets/modelling_gallery/mg (5).webp', 'Portrait 05', 100522, 2113, 1409, 'webp'),
  imageDownload('download-modeling-06', '/assets/modelling_gallery/mg (6).webp', 'Portrait 06', 78696, 968, 1452, 'webp'),
  imageDownload('download-modeling-07', '/assets/modelling_gallery/mg (7).webp', 'Portrait 07', 62786, 1066, 1416, 'webp'),
  imageDownload('download-modeling-08', '/assets/modelling_gallery/mg (8).webp', 'Portrait 08', 262640, 1367, 2048, 'webp'),
  imageDownload('download-modeling-09', '/assets/modelling_gallery/mg (9).webp', 'Portrait 09', 554186, 1367, 2048, 'webp'),
  imageDownload('download-modeling-10', '/assets/modelling_gallery/mg (10).webp', 'Portrait 10', 295440, 1367, 2048, 'webp'),
  imageDownload('download-modeling-11', '/assets/modelling_gallery/mg (11).webp', 'Portrait 11', 574634, 2785, 4506, 'webp'),
  imageDownload('download-modeling-12', '/assets/modelling_gallery/mg (12).webp', 'Portrait 12', 344844, 4608, 3072, 'webp'),
  imageDownload('download-modeling-13', '/assets/modelling_gallery/mg (13).webp', 'Portrait 13', 467324, 4608, 3072, 'webp'),
  imageDownload('download-modeling-14', '/assets/modelling_gallery/mg (14).webp', 'Portrait 14', 562038, 5616, 3744, 'webp'),
  imageDownload('download-modeling-15', '/assets/modelling_gallery/mg (15).webp', 'Portrait 15', 393426, 3744, 5616, 'webp'),
  imageDownload('download-modeling-16', '/assets/modelling_gallery/mg (16).webp', 'Portrait 16', 1560040, 4480, 6720, 'webp'),
  imageDownload('download-modeling-17', '/assets/modelling_gallery/mg (17).webp', 'Portrait 17', 339188, 6720, 4480, 'webp'),
  imageDownload('download-modeling-18', '/assets/modelling_gallery/mg (18).webp', 'Portrait 18', 701606, 3840, 5760, 'webp'),
  imageDownload('download-modeling-19', '/assets/modelling_gallery/mg (19).webp', 'Portrait 19', 21932, 500, 667, 'webp'),
  imageDownload('download-modeling-20', '/assets/modelling_gallery/mg (20).webp', 'Portrait 20', 157982, 2550, 3300, 'webp'),
  imageDownload('download-modeling-21', '/assets/modelling_gallery/mg (21).webp', 'Portrait 21', 996780, 3739, 4985, 'webp'),
  imageDownload('download-modeling-22', '/assets/modelling_gallery/mg (22).webp', 'Portrait 22', 1282268, 2848, 4245, 'webp'),
  imageDownload('download-modeling-23', '/assets/modelling_gallery/mg (23).webp', 'Portrait 23', 898188, 4380, 6570, 'webp'),
  imageDownload('download-modeling-24', '/assets/modelling_gallery/mg (24).webp', 'Portrait 24', 477330, 3456, 5184, 'webp'),
  imageDownload('download-press-dan-fran', '/assets/press_kit/pressPhotos/DanFranPress_DanFran.webp', 'Press photo: DanFranPress_DanFran', 8278, 854, 138, 'webp'),
  imageDownload('download-press-dan-fran-1', '/assets/press_kit/pressPhotos/DanFranPress_DanFran1.webp', 'Press photo: DanFranPress_DanFran1', 6614, 854, 138, 'webp'),
  imageDownload('download-press-mean-girls', '/assets/press_kit/pressPhotos/DanFranPress_MeanGirls.webp', 'Press photo: DanFranPress_MeanGirls', 21472, 800, 127, 'webp'),
  imageDownload('download-press-yass', '/assets/press_kit/pressPhotos/DanFranPress_YASS_comedyTour.webp', 'Press photo: DanFranPress_YASS_comedyTour', 220264, 3300, 2550, 'webp'),
  imageDownload('download-press-pk-01', '/assets/press_kit/pressPhotos/pk1.webp', 'Press photo 01', 4256710, 4016, 6016, 'webp'),
  imageDownload('download-press-pk-02', '/assets/press_kit/pressPhotos/pk2.webp', 'Press photo 02', 26326, 1024, 683, 'webp'),
  imageDownload('download-press-pk-03', '/assets/press_kit/pressPhotos/pk3.webp', 'Press photo 03', 17926, 542, 540, 'webp'),
  imageDownload('download-press-pk-04', '/assets/press_kit/pressPhotos/pk4.webp', 'Press photo 04', 396914, 3840, 5760, 'webp'),
  imageDownload('download-press-pk-05', '/assets/press_kit/pressPhotos/pk5.webp', 'Press photo 05', 478038, 3824, 5168, 'webp'),
  imageDownload('download-press-pk-06', '/assets/press_kit/pressPhotos/pk6.webp', 'Press photo 06', 116568, 1334, 2000, 'webp'),
  imageDownload('download-press-pk-07', '/assets/press_kit/pressPhotos/pk7.webp', 'Press photo 07', 2689480, 6016, 4016, 'webp'),
  imageDownload('download-press-pk-08', '/assets/press_kit/pressPhotos/pk8.webp', 'Press photo 08', 94202, 1334, 2000, 'webp'),
  imageDownload('download-press-pk-09', '/assets/press_kit/pressPhotos/pk9.webp', 'Press photo 09', 70964, 1024, 683, 'webp'),
  imageDownload('download-press-pk-10', '/assets/press_kit/pressPhotos/pk10.webp', 'Press photo 10', 94022, 1125, 1687, 'webp'),
  imageDownload('download-press-pk-11', '/assets/press_kit/pressPhotos/pk11.webp', 'Press photo 11', 135546, 1000, 1000, 'webp'),
  imageDownload('download-press-pk-12', '/assets/press_kit/pressPhotos/pk12.webp', 'Press photo 12', 1690376, 3833, 5743, 'webp'),
  imageDownload('download-press-pk-13', '/assets/press_kit/pressPhotos/pk13.webp', 'Press photo 13', 12422, 418, 450, 'webp'),
  imageDownload('download-press-pk-14', '/assets/press_kit/pressPhotos/pk14.webp', 'Press photo 14', 959770, 3840, 5760, 'webp'),
  imageDownload('download-press-pk-15', '/assets/press_kit/pressPhotos/pk15.webp', 'Press photo 15', 2090046, 6260, 4178, 'webp'),
  imageDownload('download-press-pk-16', '/assets/press_kit/pressPhotos/pk16.webp', 'Press photo 16', 1019658, 2848, 4288, 'webp'),
  pdfDownload('download-biography', '/assets/press_kit/df-biography.pdf', '/assets/press_kit/df-biographyThumbnail.webp', 'Daniel Franzese biography', 150045),
  pdfDownload('download-yass-description', '/assets/press_kit/yass-comedy-tour-description.pdf', '/assets/press_kit/yass-comedy-tour-description-Thumbnail.webp', 'YASS comedy tour description', 94248),
] as const satisfies readonly DownloadRecord[]

export const downloadById = (id: string): DownloadRecord | undefined =>
  downloads.find((download) => download.id === id)

export const qrCodePath = '/assets/qr/daniel-franzese-qr.png'

export const mediaAssetInventory = [
  { path: '/assets/about_me_photo1.webp', kind: 'photo-original', ownerId: 'selected-about-me' },
  { path: '/assets/about_me_photo1.jpg', kind: 'download', ownerId: 'download-about-me-photo' },
  { path: '/assets/about_photo_2.webp', kind: 'photo-original', ownerId: 'selected-about-2' },
  { path: '/assets/about_photo_2.jpg', kind: 'download', ownerId: 'download-about-photo-2' },
  { path: '/assets/home_cover.webp', kind: 'photo-original', ownerId: 'selected-home-cover' },
  { path: '/assets/home_cover.jpg', kind: 'download', ownerId: 'download-home-cover' },
  { path: '/assets/dot-light.png', kind: 'decorative' },
  { path: '/assets/dot-light.webp', kind: 'decorative' },
  { path: '/assets/logo.png', kind: 'decorative' },
  { path: '/assets/logo.webp', kind: 'decorative' },
  { path: qrCodePath, kind: 'qr-code' },
  ...Array.from({ length: 24 }, (_, index) => ({
    path: `/assets/modelling_gallery/mg (${index + 1}).webp` as `/${string}`,
    kind: 'download' as const,
    ownerId: `download-modeling-${String(index + 1).padStart(2, '0')}`,
  })),
  ...Array.from({ length: 24 }, (_, index) => ({
    path: `/assets/modelling_gallery/thumbnails/mg thumb (${index + 1}).webp` as `/${string}`,
    kind: 'photo-preview' as const,
    ownerId: `modeling-${String(index + 1).padStart(2, '0')}`,
  })),
  ...downloads
    .filter((download) => download.id.startsWith('download-press-'))
    .map((download) => ({ path: download.path, kind: 'download' as const, ownerId: download.id })),
  { path: '/assets/press_kit/df-biography.pdf', kind: 'download', ownerId: 'download-biography' },
  { path: '/assets/press_kit/df-biographyThumbnail.webp', kind: 'download-preview', ownerId: 'download-biography' },
  { path: '/assets/press_kit/yass-comedy-tour-description.pdf', kind: 'download', ownerId: 'download-yass-description' },
  { path: '/assets/press_kit/yass-comedy-tour-description-Thumbnail.webp', kind: 'download-preview', ownerId: 'download-yass-description' },
] as const satisfies readonly InventoryAsset[]
