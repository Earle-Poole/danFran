import { isAnalyticsHost, trackEvent } from './analytics'

export function observeTeaserPlayback(frame: HTMLIFrameElement) {
  if (!isAnalyticsHost()) return

  let observing = true
  let detach: (() => void) | undefined
  let started = false
  let completed = false

  const reportStart = () => {
    if (!observing || started) return
    started = true
    trackEvent('special_teaser_started')
  }

  const reportCompletion = () => {
    if (!observing || completed) return
    reportStart()
    completed = true
    trackEvent('special_teaser_completed')
  }

  void import('@vimeo/player').then(async ({ default: Player }) => {
    if (!observing) return
    const player = new Player(frame)
    player.on('playing', reportStart)
    player.on('ended', reportCompletion)
    detach = () => {
      player.off('playing', reportStart)
      player.off('ended', reportCompletion)
    }

    // Autoplay can start while the analytics-only player library loads.
    if (await player.getCurrentTime() > 0) reportStart()
  }).catch(() => {})

  return () => {
    observing = false
    detach?.()
  }
}
