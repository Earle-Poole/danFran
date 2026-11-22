'use client'

import { useRef, useState } from 'react'
import { Container, Photo } from '@/components/ui'
import type { PhotoRecord } from 'lib/content'
import { trackEvent } from 'lib/analytics'
import PhotoDialog from './PhotoDialog'
import styles from './PhotoGallery.module.css'

export type PhotoGalleryProps = {
  photos: readonly PhotoRecord[]
  heading?: string
  description?: string
  downloadLabel?: string
  id?: string
}

export default function PhotoGallery({
  photos,
  heading = 'The collection',
  description = 'Browse every original photograph in this ordered collection. Select a photo to view the uncropped source or download it.',
  downloadLabel = 'Download original',
  id = 'photo-collection',
}: PhotoGalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const openPhoto = (photo: PhotoRecord, trigger: HTMLElement) => {
    returnFocusRef.current = trigger
    setSelectedId(photo.id)
    trackEvent('gallery_photo_opened', { photo_id: photo.id, collection: photo.collection })
  }

  return (
    <section id={id} className={styles.gallerySection} aria-labelledby={`${id}-heading`} data-analytics-placement={id}>
      <Container>
        <div className={styles.galleryIntro}>
          <div>
            <h2 id={`${id}-heading`}>{heading}</h2>
            <p>{description}</p>
          </div>
          <p className={styles.count}>{photos.length} photos</p>
        </div>
        <div className={styles.grid}>
          {photos.map((photo, index) => (
            <article key={photo.id} className={styles.card}>
              <button
                type="button"
                className={styles.trigger}
                aria-label={`Open photo ${index + 1}: ${photo.alt}`}
                onClick={(event) => openPhoto(photo, event.currentTarget)}
              >
                <div className={styles.photoFrame}>
                  <Photo
                    src={photo.originalPath}
                    srcSet={photo.collection === 'headshots' && photo.previewPath
                      ? `${photo.previewPath} 640w, ${photo.originalPath} ${photo.dimensions.width}w`
                      : undefined}
                    alt=""
                    width={photo.dimensions.width}
                    height={photo.dimensions.height}
                    crop="contain"
                    objectPosition={`${photo.focal.wide.x * 100}% ${photo.focal.wide.y * 100}%`}
                    sizes="(max-width: 30rem) 100vw, (max-width: 48rem) 50vw, 33vw"
                    loading={index < 4 ? 'eager' : 'lazy'}
                  />
                </div>
              </button>
              <div className={styles.cardMeta} aria-hidden="true">
                <span>{photo.collection === 'headshots' ? 'Headshot' : photo.assetKind === 'press-photo' ? 'Press photo' : 'Portrait'}</span>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <a className={styles.downloadLink} href={photo.originalPath} download>
                {downloadLabel}
              </a>
            </article>
          ))}
        </div>
      </Container>
      <PhotoDialog
        photos={photos}
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
        onSelectionChange={setSelectedId}
        returnFocusRef={returnFocusRef}
      />
    </section>
  )
}
