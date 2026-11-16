'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ActionLink } from '@/components/ui'
import styles from './special.module.css'

export function TeaserPlayer({ embedUrl, watchUrl, children }: {
  embedUrl: string
  watchUrl: string
  children: ReactNode
}) {
  const [activated, setActivated] = useState(false)
  const player = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (activated) player.current?.focus()
  }, [activated])

  return (
    <div>
      <div className="relative aspect-video bg-black">
        {activated ? (
          <iframe
            ref={player}
            className="absolute inset-0 h-full w-full focus-visible:outline-paper"
            title="It’s Not Easy – opening number on Vimeo"
            src={embedUrl}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {children}
            <button className={`${styles.playButton} [html:not([data-js-enabled=true])_&]:hidden`} type="button" onClick={() => setActivated(true)}>
              <span className={styles.playCaption}><span className={styles.playIcon} aria-hidden="true" /> Play teaser</span>
            </button>
          </>
        )}
      </div>
      <ActionLink className="mt-1" variant="text" href={watchUrl}>Watch on Vimeo</ActionLink>
    </div>
  )
}
