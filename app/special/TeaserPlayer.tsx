'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ActionLink } from '@/components/ui'
import { trackEvent } from 'lib/analytics'
import { observeTeaserPlayback } from 'lib/teaser-analytics'
import styles from './special.module.css'

export function TeaserPlayer({ embedUrl, watchUrl, children }: {
  embedUrl: string
  watchUrl: string
  children: ReactNode
}) {
  const [activated, setActivated] = useState(false)
  const player = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const frame = player.current
    if (!activated || !frame) return
    frame.focus()
    return observeTeaserPlayback(frame)
  }, [activated])

  return (
    <div>
      <div className={styles.playerStage} data-playing={activated}>
        {activated && (
          <iframe
            ref={player}
            className={styles.playerFrame}
            title="It’s Not Easy – opening number on Vimeo"
            src={embedUrl}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}
        {children}
        {!activated && (
          <button className={`${styles.playButton} [html:not([data-js-enabled=true])_&]:hidden`} type="button" onClick={() => {
            trackEvent('special_teaser_requested')
            setActivated(true)
          }}>
            <span className={styles.playIcon} aria-hidden="true" /> Play teaser
          </button>
        )}
      </div>
      <ActionLink className="mt-1" variant="text" href={watchUrl} data-analytics-video-id="special-teaser" data-analytics-placement="special-player">Watch on Vimeo</ActionLink>
    </div>
  )
}
