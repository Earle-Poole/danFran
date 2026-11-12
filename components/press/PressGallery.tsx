'use client'

import { useRef, useState } from 'react'
import { Container, Photo } from '@/components/ui'
import { pressPhotos, downloadById, type PhotoRecord } from 'lib/content'
import PhotoDialog from '@/components/gallery/PhotoDialog'
import styles from './PressGallery.module.css'
import { pressPreviewByDownloadId } from './pressPreviews'

const bytesLabel = (bytes: number) => `${new Intl.NumberFormat('en-US').format(bytes)} bytes`

const pressPhotoLabel = (photo: PhotoRecord) => downloadById(photo.downloadId)?.label ?? 'Press photo'
const artworkIds = ['download-press-yass', 'download-press-dan-fran', 'download-press-mean-girls'] as const

export default function PressGallery() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const openPhoto = (id: string, trigger: HTMLElement) => {
    returnFocusRef.current = trigger
    setSelectedId(id)
  }

  return (
    <>
      <section id="photography" className={styles.section} aria-labelledby="press-photography-heading">
        <Container>
          <h2 id="press-photography-heading" className={styles.heading}>Press photography</h2>
          <p className={styles.intro}>
            Browse the 20 press photographs in order, then choose an individual original download. Previews are lightweight representations; downloads always use the original source file.
          </p>
          <div className={styles.photoGrid}>
            {pressPhotos.map((photo, index) => {
              const download = downloadById(photo.downloadId)
              const preview = pressPreviewByDownloadId[photo.downloadId]
              return (
                <article key={photo.id} className={styles.photoCard}>
                  <button
                    type="button"
                    className={styles.photoButton}
                    aria-label={`Preview ${pressPhotoLabel(photo)}`}
                    onClick={(event) => openPhoto(photo.id, event.currentTarget)}
                  >
                    <Photo
                      src={preview?.previewPath ?? photo.previewPath ?? photo.originalPath}
                      alt=""
                      width={preview?.width ?? photo.dimensions.width}
                      height={preview?.height ?? photo.dimensions.height}
                      crop="contain"
                      sizes="(max-width: 30rem) 100vw, (max-width: 48rem) 50vw, 25vw"
                      loading="lazy"
                    />
                  </button>
                  <div className={styles.photoDetails}>
                    <p className={styles.photoLabel}>{pressPhotoLabel(photo)}</p>
                    <p className={styles.photoMetadata}>
                      {`Photo ${String(index + 1).padStart(2, '0')} · ${download ? bytesLabel(download.bytes) : 'File metadata unavailable'}`}
                    </p>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.previewLink}
                        onClick={(event) => openPhoto(photo.id, event.currentTarget)}
                      >
                        Preview
                      </button>
                      {download ? (
                        <a className={styles.downloadLink} href={download.path} download>
                          Download photo
                        </a>
                      ) : (
                        <span>File unavailable</span>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      <section id="promotional-materials" className={styles.section} aria-labelledby="promotional-materials-heading">
        <Container>
          <h2 id="promotional-materials-heading" className={styles.heading}>Promotional materials</h2>
          <p className={styles.intro}>
            Original promotional artwork is shown in full and remains historical source material. Verify currentness and usage rights before republishing.
          </p>
          <div className={styles.artworkGrid}>
            {artworkIds.map((id) => {
              const download = downloadById(id)
              const preview = pressPreviewByDownloadId[id]
              if (!download || !download.dimensions || download.dimensions.unit !== 'px') return null
              return (
                <article key={id} className={styles.artworkCard}>
                  <Photo
                    src={preview?.previewPath ?? download.path}
                    alt={`${download.label} promotional artwork`}
                    width={preview?.width ?? download.dimensions.width}
                    height={preview?.height ?? download.dimensions.height}
                    crop="contain"
                    loading="lazy"
                  />
                  <p className={styles.artworkText}>{`${download.label}. Historical promotional artwork; rights and currentness not reviewed.`}</p>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      <PhotoDialog
        photos={pressPhotos}
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
        onSelectionChange={setSelectedId}
        returnFocusRef={returnFocusRef}
      />
    </>
  )
}
