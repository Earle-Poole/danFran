import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PhotoDialog } from '@/components/gallery'
import { curatedModelingGalleryIds, orderedModelingGalleryPhotos } from '@/components/gallery/modelingPhotos'
import PressResourceText from '@/components/press/PressResourceText'
import PressKitTemplate from '@/components/templates/press-kit/PressKitTemplate'
import { modelingPhotos, pressPhotos } from 'lib/content'

const dialogPrototype = typeof HTMLDialogElement === 'undefined' ? null : HTMLDialogElement.prototype
const originalShowModal = dialogPrototype?.showModal
const originalClose = dialogPrototype?.close

const installDialogPolyfill = () => {
  if (!dialogPrototype) return
  dialogPrototype.showModal = function showModal() {
    this.open = true
  }
  dialogPrototype.close = function close() {
    this.open = false
  }
}

afterEach(() => {
  if (!dialogPrototype) return
  if (originalShowModal) dialogPrototype.showModal = originalShowModal
  if (originalClose) dialogPrototype.close = originalClose
})

describe('MEDIA ordered collections', () => {
  it('uses the curated opening without duplicating any modeling original', () => {
    const sourcePaths = orderedModelingGalleryPhotos.map((photo) => photo.originalPath)
    expect(orderedModelingGalleryPhotos).toHaveLength(27)
    expect(new Set(sourcePaths)).toHaveLength(27)
    expect(modelingPhotos).toHaveLength(24)
    expect(new Set(modelingPhotos.map((photo) => photo.originalPath))).toHaveLength(24)
    expect(curatedModelingGalleryIds).toEqual([
      'modeling-03',
      'selected-about-2',
      'selected-about-me',
      'selected-home-cover',
    ])
    expect(modelingPhotos.every((photo) => sourcePaths.includes(photo.originalPath))).toBe(true)
  })

  it('keeps every press source directly reachable through its record', () => {
    expect(pressPhotos).toHaveLength(20)
    expect(new Set(pressPhotos.map((photo) => photo.originalPath))).toHaveLength(20)
    pressPhotos.forEach((photo) => expect(photo.originalPath).toMatch(/^\/assets\/press_kit\/pressPhotos\//))
  })
})

describe('Press resource HTML alternatives', () => {
  it('renders both historical PDF text versions as ordinary headed HTML', () => {
    render(<PressResourceText />)

    expect(screen.getByRole('heading', { name: 'Read the source text.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Daniel Franzese biography - historical source text/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Yass!.*Amazing! Comedy Tour - historical source text/i })).toBeInTheDocument()
    expect(screen.getByText(/Best known for his role as Damian in Mean Girls/)).toBeInTheDocument()
    expect(screen.getByText(/You know him from starring in TV shows/)).toBeInTheDocument()
    expect(screen.getByText('Mean Girls / Bully / I Spit On Your Grave')).toBeInTheDocument()
    expect(document.getElementById('biography-text-version')).toHaveAttribute('tabindex', '-1')
    expect(document.getElementById('tour-text-version')).toHaveAttribute('tabindex', '-1')
  })

  it('offers an exact fragment link beside each original PDF action set', () => {
    render(<PressKitTemplate />)

    const readLinks = screen.getAllByRole('link', { name: 'Read text version' })
    expect(readLinks.map((link) => link.getAttribute('href'))).toEqual([
      '#biography-text-version',
      '#tour-text-version',
    ])
    expect(readLinks[0].closest('li')).toHaveTextContent(/Daniel Franzese biography/)
    expect(readLinks[1].closest('li')).toHaveTextContent(/YASS comedy tour description/)
  })
})

describe('PhotoDialog', () => {
  const photos = modelingPhotos.slice(0, 2)

  const renderDialog = () => {
    const returnFocusRef = { current: null as HTMLElement | null }
    const onClose = vi.fn()
    const onSelectionChange = vi.fn()
    function Harness() {
      const [selectedId, setSelectedId] = useState<string | null>(photos[0].id)
      return (
        <PhotoDialog
          photos={photos}
          selectedId={selectedId}
          onClose={() => { onClose(); setSelectedId(null) }}
          onSelectionChange={onSelectionChange}
          returnFocusRef={returnFocusRef}
        />
      )
    }
    render(<Harness />)
    return { onClose, onSelectionChange, returnFocusRef }
  }

  it('opens with close focus, disables the first boundary, and announces position', async () => {
    installDialogPolyfill()
    renderDialog()
    const dialog = screen.getByRole('dialog')
    await waitFor(() => expect(dialog).toHaveAttribute('open'))
    expect(screen.getByRole('button', { name: 'Close photo' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Previous photo' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next photo' })).toBeEnabled()
    expect(screen.getByText('Photo 1 of 2: Daniel Franzese portrait from the modeling collection, image 1')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Download full photo' })).toHaveAttribute('href', photos[0].originalPath)
  })

  it('keeps navigation keyboard-operable and restores the invoking trigger focus', async () => {
    installDialogPolyfill()
    const { onClose, onSelectionChange, returnFocusRef } = renderDialog()
    const trigger = document.createElement('button')
    trigger.type = 'button'
    document.body.append(trigger)
    returnFocusRef.current = trigger
    const dialog = screen.getByRole('dialog')
    await waitFor(() => expect(dialog).toHaveAttribute('open'))

    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(onSelectionChange).toHaveBeenCalledWith(photos[1].id)
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
    expect(dialog).not.toHaveAttribute('open')
    expect(trigger).toHaveFocus()
  })

  it('offers retry and an original-file recovery link after an image error', async () => {
    installDialogPolyfill()
    renderDialog()
    const dialog = screen.getByRole('dialog')
    await waitFor(() => expect(dialog).toHaveAttribute('open'))
    fireEvent.error(dialog.querySelector('img') as HTMLImageElement)
    expect(screen.getByRole('alert')).toHaveTextContent('Photo couldn’t load.')
    expect(screen.getByRole('link', { name: 'Open original file' })).toHaveAttribute('href', photos[0].originalPath)
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(screen.getByRole('status')).toHaveTextContent('Loading photo…')
  })
})
