'use client'

import { useEffect, useRef, useState } from 'react'
import { ActionLink, Button } from '@/components/ui'

export function QrActions({ imageUrl, filename }: { imageUrl: string; filename: string }) {
  const imageFile = useRef<File | null>(null)
  const [feedback, setFeedback] = useState<{ copied: boolean; url: string } | null>(null)

  useEffect(() => {
    if (typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function') return

    // Prepare the file before the click so the share call retains user activation.
    const controller = new AbortController()
    void fetch(imageUrl, { signal: controller.signal })
      .then((response) => response.ok ? response.blob() : null)
      .then((blob) => {
        if (blob?.type === 'image/png' && !controller.signal.aborted) {
          imageFile.current = new File([blob], filename, { type: blob.type })
        }
      })
      .catch(() => { /* A page link is available if the file fails to load. */ })

    return () => controller.abort()
  }, [imageUrl, filename])

  const share = async () => {
    const url = new URL(window.location.pathname, window.location.origin).href
    setFeedback(null)

    if (typeof navigator.share === 'function') {
      const files = imageFile.current ? [imageFile.current] : []
      try {
        const title = 'Daniel Franzese QR code'
        const data = files.length && navigator.canShare?.({ files }) ? { title, files } : { title, url }
        await navigator.share(data)
        return
      } catch (error) {
        if (error instanceof DOMException && ['AbortError', 'InvalidStateError'].includes(error.name)) return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setFeedback({ copied: true, url })
    } catch {
      setFeedback({ copied: false, url })
    }
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3">
        <ActionLink href={imageUrl} download={filename}>Download PNG</ActionLink>
        <Button className="[html:not([data-js-enabled=true])_&]:hidden" variant="secondary" onClick={share}>
          Share QR code
        </Button>
      </div>
      <p className="break-anywhere text-caption empty:-mt-4" role="status">
        {feedback?.copied ? 'Link to this page copied.' : feedback ? 'Copy the link below to share this page.' : null}
      </p>
      {feedback && !feedback.copied ? (
        <input
          className="min-h-control w-full max-w-[25rem] rounded-control border border-control bg-white px-3 py-2 text-ink"
          type="url"
          aria-label="Link to this QR code page"
          readOnly
          value={feedback.url}
          onFocus={(event) => event.currentTarget.select()}
        />
      ) : null}
    </>
  )
}
