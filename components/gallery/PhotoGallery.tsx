'use client'

import { useRef, useState } from 'react'
import { Container, Photo } from '@/components/ui'
import type { PhotoRecord } from 'lib/content'
import PhotoDialog from './PhotoDialog'
import styles from './PhotoGallery.module.css'

export type PhotoGalleryProps = {
  photos: readonly PhotoRecord[]
  heading?: string
  description?: string
  featuredIds?: readonly string[]
  id?: string
}

export default function PhotoGallery({
  photos,
  heading = 'The collection',
  description = 'Browse every original photograph in this ordered collection. Select a photo to view the uncropped source or download it.',
  featuredIds = [],
  id = 'photo-collection',
}: PhotoGalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const featured = new Set(featuredIds)

  const openPhoto = (id: string, trigger: HTMLElement) => {
    returnFocusRef.current = trigger
    setSelectedId(id)
  }

  return (
    <section id={id} className={styles.gallerySection} aria-labelledby={`${id}-heading`}>
      <Container>
        <div className={styles.galleryIntro}>
          <div>
            <h2 id={`${id}-heading`}>{heading}</h2>
            <p>{description}</p>
          </div>
          <p className={styles.count}>{photos.length} original photos</p>
        </div>
        <div className={styles.grid}>
          {photos.map((photo, index) => (
            <article key={photo.id} className={`${styles.card} ${featured.has(photo.id) ? styles.cardFeatured : ''}`}>
              <button
                type="button"
                className={styles.trigger}
                aria-label={`Open photo ${index + 1}: ${photo.alt}`}
                onClick={(event) => openPhoto(photo.id, event.currentTarget)}
              >
                <div className={styles.photoFrame}>
                  <Photo
                    src={photo.previewPath ?? photo.originalPath}
                    alt=""
                    width={photo.dimensions.width}
                    height={photo.dimensions.height}
                    crop="contain"
                    objectPosition={`${photo.focal.wide.x * 100}% ${photo.focal.wide.y * 100}%`}
                    sizes="(max-width: 30rem) 100vw, (max-width: 48rem) 50vw, 25vw"
                    loading={index < 4 ? 'eager' : 'lazy'}
                  />
                </div>
              </button>
              <div className={styles.cardMeta} aria-hidden="true">
                <span>{photo.assetKind === 'press-photo' ? 'Press photo' : 'Portrait'}</span>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <a className={styles.downloadLink} href={photo.originalPath} download>
                Download original
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
