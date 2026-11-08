'use client'

import type { MutableRefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { PhotoRecord } from 'lib/content'
import styles from './PhotoDialog.module.css'

const focusableSelector =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export type PhotoDialogProps = {
  photos: readonly PhotoRecord[]
  selectedId: string | null
  onClose: () => void
  onSelectionChange: (id: string) => void
  returnFocusRef?: MutableRefObject<HTMLElement | null>
}

export default function PhotoDialog({
  photos,
  selectedId,
  onClose,
  onSelectionChange,
  returnFocusRef,
}: PhotoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [loadedPhotoId, setLoadedPhotoId] = useState<string | null>(null)
  const [failedPhotoId, setFailedPhotoId] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const photo = photos.find((item) => item.id === selectedId)
  const index = photo ? photos.findIndex((item) => item.id === photo.id) : -1
  const previousPhoto = index > 0 ? photos[index - 1] : undefined
  const nextPhoto = index >= 0 && index < photos.length - 1 ? photos[index + 1] : undefined
  const imageState = !photo || failedPhotoId === photo.id ? 'error' : loadedPhotoId === photo.id ? 'loaded' : 'loading'

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (photo) {
      if (!dialog.open) {
        dialog.showModal()
        closeRef.current?.focus()
      }
      return
    }

    if (dialog.open) dialog.close()
    const trigger = returnFocusRef?.current
    if (trigger?.isConnected) trigger.focus({ preventScroll: true })
  }, [photo, returnFocusRef])

  const closeDialog = () => {
    if (dialogRef.current?.open) dialogRef.current.close()
    onClose()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeDialog()
      return
    }

    if (event.key === 'ArrowLeft' && previousPhoto) {
      event.preventDefault()
      onSelectionChange(previousPhoto.id)
      return
    }

    if (event.key === 'ArrowRight' && nextPhoto) {
      event.preventDefault()
      onSelectionChange(nextPhoto.id)
      return
    }

    if (event.key !== 'Tab') return
    const dialog = dialogRef.current
    if (!dialog) return
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="photo-dialog-title"
      aria-describedby="photo-dialog-status"
      onCancel={(event) => {
        event.preventDefault()
        closeDialog()
      }}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog()
      }}
    >
      {photo ? (
        <div className={styles.dialogBody}>
          <div className={styles.toolbar}>
            <div className={styles.toolbarGroup}>
              <button ref={closeRef} type="button" onClick={closeDialog}>
                Close photo
              </button>
              <button
                type="button"
                onClick={() => previousPhoto && onSelectionChange(previousPhoto.id)}
                disabled={!previousPhoto}
                aria-label="Previous photo"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => nextPhoto && onSelectionChange(nextPhoto.id)}
                disabled={!nextPhoto}
                aria-label="Next photo"
              >
                Next
              </button>
            </div>
            <a href={photo.originalPath} download>
              Download full photo
            </a>
          </div>

          <div className={styles.imageRegion}>
            <p id="photo-dialog-status" className={styles.visuallyHidden} aria-live="polite">
              {`Photo ${index + 1} of ${photos.length}: ${photo.alt}`}
            </p>
            {imageState === 'loading' ? (
              <div className={styles.loading} role="status">
                <p>Loading photo…</p>
              </div>
            ) : null}
            {imageState === 'error' ? (
              <div className={styles.error} role="alert">
                <p>Photo couldn’t load.</p>
                <div className={styles.errorActions}>
                  <button type="button" onClick={() => { setFailedPhotoId(null); setAttempt((value) => value + 1) }}>
                    Retry
                  </button>
                  <a href={photo.originalPath}>
                    Open original file
                  </a>
                </div>
              </div>
            ) : null}
            <img
              key={`${photo.id}-${attempt}`}
              className={styles.image}
              src={photo.originalPath}
              alt={photo.alt}
              width={photo.dimensions.width}
              height={photo.dimensions.height}
              hidden={imageState !== 'loaded'}
              onLoad={() => { setLoadedPhotoId(photo.id); setFailedPhotoId(null) }}
              onError={() => setFailedPhotoId(photo.id)}
            />
          </div>

          <div className={styles.captionBar}>
            <p className={styles.caption}>
              <strong id="photo-dialog-title">{photo.alt}</strong>
              {photo.caption ? <span>{photo.caption}</span> : null}
            </p>
            <span className={styles.visuallyHidden} aria-live="polite">
              {`Photo ${index + 1} of ${photos.length}`}
            </span>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}
