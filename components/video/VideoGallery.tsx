'use client'

import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { VideoCategory, VideoRecord } from 'lib/content/types'
import { selectVideosByCategory, videos } from 'lib/content/videos'
import { ActionLink, Button, Container, Section, Status } from '@/components/ui'
import { NewsletterSection } from '@/components/newsletter'
import styles from './video.module.css'

type VideoFilter = 'all' | VideoCategory

const filters: readonly { value: VideoFilter; label: string }[] = [
  { value: 'all', label: 'All videos' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'interviews-press', label: 'Interviews & press' },
]

const categoryLabels: Record<VideoCategory, string> = {
  comedy: 'Comedy',
  'interviews-press': 'Interviews & press',
}

const firstVideo = videos[0]

const queryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? (value.length === 1 ? value[0] : undefined) : value

const categoryFromQuery = (value: string | string[] | undefined): VideoFilter => {
  const normalized = queryValue(value)
  return filters.some((filter) => filter.value === normalized)
    ? (normalized as VideoFilter)
    : 'all'
}

const videoFromQuery = (value: string | string[] | undefined): VideoRecord => {
  const id = queryValue(value)
  return videos.find((video) => video.id === id) ?? firstVideo
}

function Thumbnail({ video, featured = false }: { video: VideoRecord; featured?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className={`${styles.thumbnail} ${featured ? styles.thumbnailFeatured : ''}`}>
      {imageFailed ? (
        <div className={styles.typographicCover} role="img" aria-label={`${video.title} thumbnail unavailable`}>
          <span className={styles.coverEyebrow}>Daniel Franzese</span>
          <strong>{video.title}</strong>
          <span className={styles.coverNote}>Thumbnail unavailable</span>
        </div>
      ) : (
        <Image
          src={video.thumbnailUrl}
          alt=""
          fill
          sizes={featured ? '(min-width: 64rem) 55vw, 100vw' : '(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw'}
          className={styles.thumbnailImage}
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  )
}

export function VideoGallery() {
  const pathname = usePathname() ?? '/video-gallery'
  const searchParams = useSearchParams()
  const search = searchParams?.toString() ?? ''
  const categoryParam = searchParams?.getAll('category') ?? []
  const videoParam = searchParams?.getAll('video') ?? []
  const queryCategory = categoryParam.length === 1 ? categoryParam[0] : undefined
  const queryVideo = videoParam.length === 1 ? videoParam[0] : undefined
  const [category, setCategory] = useState<VideoFilter>(() => categoryFromQuery(queryCategory))
  const [selectedId, setSelectedId] = useState(() => videoFromQuery(queryVideo).id)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [providerErrorId, setProviderErrorId] = useState<string | null>(null)
  const playerHeadingRef = useRef<HTMLHeadingElement>(null)
  const pendingPlayRef = useRef<string | null>(null)
  const lastSyncedQueryRef = useRef(
    `${categoryFromQuery(queryCategory)}:${videoFromQuery(queryVideo).id}`,
  )

  const selectedVideo = videos.find((video) => video.id === selectedId) ?? firstVideo
  const visibleVideos = selectVideosByCategory(category)

  const updateQuery = useCallback((nextCategory: VideoFilter, nextVideoId: string, replace = false) => {
    const params = new URLSearchParams()
    params.set('category', nextCategory)
    params.set('video', nextVideoId)
    const url = `${pathname}?${params.toString()}`
    if (replace) window.history.replaceState(null, '', url)
    else window.history.pushState(null, '', url)
  }, [pathname])

  const syncQueryState = useCallback(() => {
    const nextCategory = categoryFromQuery(queryCategory)
    const nextVideo = videoFromQuery(queryVideo)
    const shouldPlay = pendingPlayRef.current === nextVideo.id
    const nextQueryKey = `${nextCategory}:${nextVideo.id}`
    const queryChanged = lastSyncedQueryRef.current !== nextQueryKey

    lastSyncedQueryRef.current = nextQueryKey
    pendingPlayRef.current = null
    setCategory(nextCategory)
    setSelectedId(nextVideo.id)
    if (shouldPlay) {
      setPlayingId(nextVideo.id)
    } else if (queryChanged) {
      setPlayingId(null)
    }
    setProviderErrorId(null)

    if (queryCategory !== nextCategory || queryVideo !== nextVideo.id) {
      updateQuery(nextCategory, nextVideo.id, true)
    }
  }, [queryCategory, queryVideo, updateQuery])

  useEffect(() => {
    const syncTimer = window.setTimeout(syncQueryState, 0)
    return () => window.clearTimeout(syncTimer)
  }, [search, syncQueryState])

  const focusPlayerHeading = useCallback(() => {
    window.requestAnimationFrame(() => {
      const heading = playerHeadingRef.current
      if (!heading) return
      if (typeof heading.scrollIntoView === 'function') {
        heading.scrollIntoView({ behavior: 'auto', block: 'start' })
      }
      heading.focus({ preventScroll: true })
    })
  }, [])

  const selectVideo = (video: VideoRecord) => {
    pendingPlayRef.current = null
    setSelectedId(video.id)
    setPlayingId(null)
    setProviderErrorId(null)
    updateQuery(category, video.id)
    focusPlayerHeading()
  }

  const playVideo = (video: VideoRecord) => {
    setSelectedId(video.id)
    setProviderErrorId(null)
    setPlayingId(video.id)
    if (selectedId !== video.id) {
      pendingPlayRef.current = video.id
      updateQuery(category, video.id)
    } else {
      pendingPlayRef.current = null
    }
  }

  const selectCategory = (nextCategory: VideoFilter) => {
    pendingPlayRef.current = null
    setCategory(nextCategory)
    setPlayingId(null)
    setProviderErrorId(null)
    updateQuery(nextCategory, selectedId)
  }

  return (
    <div className={styles.page}>
      <Section className={styles.intro}>
        <Container>
          <p className={styles.eyebrow}>Video gallery</p>
          <h1 className={styles.pageTitle} data-route-heading>
            Press play.
          </h1>
          <p className={styles.lede}>Comedy, conversations &amp; a little chaos.</p>
        </Container>
      </Section>

      <Section aria-labelledby="featured-video-heading" className={styles.featuredSection}>
        <Container>
          <div className={styles.featuredLayout}>
            <div className={styles.featuredCopy}>
              <p className={styles.eyebrow}>Featured video</p>
              <h2
                id="featured-video-heading"
                ref={playerHeadingRef}
                tabIndex={-1}
                className={styles.featuredTitle}
                aria-live="polite"
              >
                {selectedVideo.title}
              </h2>
              <p className={styles.category}>{categoryLabels[selectedVideo.category]}</p>
              <p className={styles.playerHelp}>
                Select a video to update this player. Playback starts only when you choose Play.
              </p>
            </div>

            <div className={styles.playerColumn}>
              <div className={styles.playerFrame}>
                {playingId === selectedVideo.id ? (
                  <iframe
                    key={selectedVideo.id}
                    className={styles.playerEmbed}
                    src={`${selectedVideo.embedUrl}?rel=0`}
                    title={`Video player for ${selectedVideo.title}`}
                    allow="fullscreen"
                    allowFullScreen
                    onError={() => setProviderErrorId(selectedVideo.id)}
                  />
                ) : (
                  <div className={styles.playerCover}>
                    <Thumbnail key={selectedVideo.id} video={selectedVideo} featured />
                    <Button
                      className={styles.playButton}
                      variant="inverse"
                      onClick={() => playVideo(selectedVideo)}
                      aria-label={`Play ${selectedVideo.title}`}
                    >
                      <span aria-hidden="true" className={styles.playIcon}>▶</span>
                      Play video
                    </Button>
                  </div>
                )}
              </div>

              {providerErrorId === selectedVideo.id ? (
                <Status variant="error" className={styles.playerStatus}>
                  This video player is unavailable here.{' '}
                  <a href={selectedVideo.watchUrl} target="_blank" rel="noreferrer">
                    Watch {selectedVideo.title} directly on YouTube
                  </a>
                  .
                </Status>
              ) : (
                <p className={styles.watchFallback}>
                  If the embedded player does not load,{' '}
                  <a href={selectedVideo.watchUrl} target="_blank" rel="noreferrer">
                    watch this video directly on YouTube
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="video-library-heading" className={styles.librarySection}>
        <Container>
          <div className={styles.libraryHeader}>
            <div>
              <p className={styles.eyebrow}>Browse the library</p>
              <h2 id="video-library-heading" className={styles.sectionTitle}>All the videos</h2>
            </div>
            <div className={styles.filters} aria-label="Filter videos">
              {filters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={category === filter.value ? 'selected' : 'secondary'}
                  aria-pressed={category === filter.value}
                  onClick={() => selectCategory(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          <p className={styles.resultCount} role="status" aria-live="polite">
            Showing {visibleVideos.length} {visibleVideos.length === 1 ? 'video' : 'videos'}.
          </p>

          <div className={styles.videoGrid}>
            {visibleVideos.map((video) => (
              <article key={video.id} className={`${styles.card} ${selectedId === video.id ? styles.cardSelected : ''}`}>
                <button
                  type="button"
                  className={styles.cardSelect}
                  aria-pressed={selectedId === video.id}
                  aria-label={`Select ${video.title}`}
                  onClick={() => selectVideo(video)}
                >
                  <Thumbnail video={video} />
                  <span className={styles.cardBody}>
                    <strong>{video.title}</strong>
                    <span>{categoryLabels[video.category]}</span>
                  </span>
                </button>
                <div className={styles.cardActions}>
                  <Button
                    variant="primary"
                    onClick={() => playVideo(video)}
                    aria-label={`Play ${video.title}`}
                  >
                    <span aria-hidden="true" className={styles.playIcon}>▶</span>
                    Play
                  </Button>
                  <ActionLink
                    href={video.watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    variant="text"
                    aria-label={`Watch ${video.title} directly on YouTube`}
                  >
                    Watch on YouTube
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <NewsletterSection id="video-newsletter" />
    </div>
  )
}
