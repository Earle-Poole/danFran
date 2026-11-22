'use client'

import type { MutableRefObject, PointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { PhotoRecord } from 'lib/content'
import { trackEvent } from 'lib/analytics'
import styles from './PhotoDialog.module.css'

const focusableSelector =
  'button:not([disabled]):not([tabindex="-1"]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export type PhotoDialogProps = {
  photos: readonly PhotoRecord[]
  selectedId: string | null
  onClose: () => void
  onSelectionChange: (id: string) => void
  returnFocusRef?: MutableRefObject<HTMLElement | null>
  getThumbnail?: (photo: PhotoRecord) => string | undefined
}

export default function PhotoDialog({
  photos,
  selectedId,
  onClose,
  onSelectionChange,
  returnFocusRef,
  getThumbnail,
}: PhotoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const swipeStart = useRef<{ pointerId: number; x: number; y: number } | null>(null)
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

  useEffect(() => {
    const strip = stripRef.current
    const selected = strip?.querySelector('[aria-pressed="true"]')
    if (!strip || !selected) return

    const { left, right } = selected.getBoundingClientRect()
    const bounds = strip.getBoundingClientRect()
    if (left < bounds.left + 8) strip.scrollLeft += left - bounds.left - 12
    if (right > bounds.right - 8) strip.scrollLeft += right - bounds.right + 12
  }, [index])

  const closeDialog = () => {
    if (dialogRef.current?.open) dialogRef.current.close()
    onClose()
  }

  const selectPhoto = (target: PhotoRecord, method: 'button' | 'keyboard' | 'swipe' | 'thumbnail') => {
    if (target.id === selectedId) return
    onSelectionChange(target.id)
    trackEvent('gallery_photo_changed', { photo_id: target.id, method })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeDialog()
      return
    }

    const fromThumbnail = event.target instanceof HTMLElement && event.target.hasAttribute('data-photo-thumbnail')
    let targetIndex: number | undefined
    if (event.key === 'ArrowLeft') targetIndex = index - 1
    if (event.key === 'ArrowRight') targetIndex = index + 1
    if (fromThumbnail && event.key === 'Home') targetIndex = 0
    if (fromThumbnail && event.key === 'End') targetIndex = photos.length - 1
    if (targetIndex !== undefined) {
      event.preventDefault()
      const target = photos[targetIndex]
      if (target) {
        selectPhoto(target, 'keyboard')
        if (fromThumbnail) stripRef.current?.querySelectorAll('button')[targetIndex]?.focus({ preventScroll: true })
      }
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

  const startSwipe = (event: PointerEvent<HTMLImageElement>) => {
    if (event.pointerType !== 'touch' || !event.isPrimary) return
    swipeStart.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY }
  }

  const endSwipe = (event: PointerEvent<HTMLImageElement>) => {
    const start = swipeStart.current
    if (!start || start.pointerId !== event.pointerId) return
    swipeStart.current = null
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return

    const target = dx < 0 ? nextPhoto : previousPhoto
    if (target) selectPhoto(target, 'swipe')
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      data-analytics-placement="photo-dialog"
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
                onClick={() => previousPhoto && selectPhoto(previousPhoto, 'button')}
                disabled={!previousPhoto}
                aria-label="Previous photo"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => nextPhoto && selectPhoto(nextPhoto, 'button')}
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
              draggable={false}
              onPointerDown={startSwipe}
              onPointerUp={endSwipe}
              onPointerCancel={() => { swipeStart.current = null }}
              onLoad={() => { setLoadedPhotoId(photo.id); setFailedPhotoId(null) }}
              onError={() => setFailedPhotoId(photo.id)}
            />
          </div>

          {photos.length > 1 && (
            <div ref={stripRef} className={styles.contactSheet} role="group" aria-label="Photo thumbnails">
              {photos.map((item, position) => (
                <button
                  key={item.id}
                  type="button"
                  data-photo-thumbnail
                  className={styles.thumbnail}
                  aria-label={`Select photo ${position + 1}: ${item.alt}`}
                  aria-pressed={position === index}
                  tabIndex={position === index ? 0 : -1}
                  onClick={() => selectPhoto(item, 'thumbnail')}
                >
                  <Image src={getThumbnail?.(item) ?? item.previewPath ?? item.originalPath} alt="" width={66} height={50} loading="lazy" decoding="async" />
                  <span aria-hidden="true">{String(position + 1).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          )}

          <div className={styles.captionBar}>
            <p className={styles.caption}>
              <strong id="photo-dialog-title">{photo.alt}</strong>
              {photo.caption ? <span>{photo.caption}</span> : null}
            </p>
            <span className={styles.counter} aria-hidden="true">
              {`Photo ${index + 1} of ${photos.length}`}
            </span>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}
