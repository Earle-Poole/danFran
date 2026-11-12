export type VerificationStatus =
  | 'source-confirmed'
  | 'verified'
  | 'not-reviewed'
  | 'unavailable'

export type RecordAvailability = 'available' | 'planned' | 'unavailable'

export type RouteId =
  | 'home'
  | 'legacy-home'
  | 'about'
  | 'press-kit'
  | 'portraits'
  | 'videos'
  | 'booking'
  | 'calendar'
  | 'not-found'

export type RouteRecord = {
  readonly id: RouteId
  readonly path: `/${string}`
  readonly label: string
  readonly title: string
  readonly description: string
  readonly canonicalPath: `/${string}`
  readonly indexable: boolean
  readonly availability: RecordAvailability
  readonly verification: VerificationStatus
  readonly preservedFragments?: readonly string[]
}

export type InquiryCategory =
  | 'Theatrical & Public Appearances'
  | 'College & Speaking Engagements'
  | 'Press & Invites'

export type ContactPhone = {
  readonly label: string
  readonly visible: string
  readonly destination: `tel:${string}`
}

export type SocialLink = {
  readonly id: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'imdb'
  readonly label: string
  readonly url: `https://${string}`
  readonly verification: VerificationStatus
}

export type ContactRecord = {
  readonly id: string
  readonly name: string
  readonly email: {
    readonly visible: string
    readonly destination: `mailto:${string}`
  }
  readonly phones: readonly ContactPhone[]
  readonly inquiryCategories: readonly InquiryCategory[]
  readonly verification: VerificationStatus
  readonly socialLinks: readonly SocialLink[]
}

export type PhotoCollection = 'selected' | 'modeling' | 'press'
export type PhotoAssetKind = 'portrait' | 'press-photo' | 'poster'
export type Aspect = 'portrait' | 'landscape' | 'square'

export type ImageDimensions = {
  readonly width: number
  readonly height: number
  readonly unit: 'px'
}

export type DocumentDimensions = {
  readonly width: number
  readonly height: number
  readonly unit: 'pt'
}

export type FocalPosition = {
  /** Normalized object-position coordinates; x/y are fractions from 0 through 1. */
  readonly x: number
  readonly y: number
  readonly unit: 'fraction'
}

export type PhotoRecord = {
  readonly id: string
  readonly collection: PhotoCollection
  readonly assetKind: PhotoAssetKind
  readonly originalPath: `/${string}`
  readonly previewPath?: `/${string}`
  readonly downloadId: string
  readonly dimensions: ImageDimensions
  readonly alt: string
  readonly aspect: Aspect
  readonly focal: {
    readonly compact: FocalPosition
    readonly wide: FocalPosition
  }
  readonly caption?: string
  readonly credit?: string
  readonly verification: {
    readonly source: VerificationStatus
    readonly alt: VerificationStatus
    readonly crop: VerificationStatus
    readonly credit: VerificationStatus
    readonly license: VerificationStatus
    readonly accessibility: VerificationStatus
  }
}

export type VideoCategory = 'comedy' | 'interviews-press'
export type MediaReviewStatus = VerificationStatus

export type VideoRecord = {
  readonly id: string
  readonly provider: 'youtube'
  readonly videoId: string
  readonly title: string
  readonly category: VideoCategory
  readonly thumbnailUrl: `https://${string}`
  readonly watchUrl: `https://${string}`
  readonly embedUrl: `https://${string}`
  readonly availability: RecordAvailability
  readonly verification: VerificationStatus
  readonly duration?: string
  readonly uploadDate?: string
  readonly captionStatus: MediaReviewStatus
  readonly descriptionStatus: MediaReviewStatus
  readonly transcriptStatus: MediaReviewStatus
}

export type DownloadRecord = {
  readonly id: string
  readonly path: `/${string}`
  readonly label: string
  readonly mimeType: 'image/jpeg' | 'image/webp' | 'application/pdf'
  readonly format: 'jpg' | 'webp' | 'pdf'
  readonly bytes: number
  readonly dimensions?: ImageDimensions | DocumentDimensions
  readonly previewPath?: `/${string}`
  readonly availability: RecordAvailability
  readonly verification: VerificationStatus
}

export type InventoryAssetKind =
  | 'photo-original'
  | 'photo-preview'
  | 'download'
  | 'download-preview'
  | 'decorative'
  | 'qr-code'

export type InventoryAsset = {
  readonly path: `/${string}`
  readonly kind: InventoryAssetKind
  readonly ownerId?: string
}
