export const analyticsDomains = ['www.whatsupdanny.com', 'whatsupdanny.com']

type Events = {
  navigation_clicked: { destination: string; placement: string }
  special_link_clicked: { placement: string }
  navigation_menu_opened: { menu: 'mobile' | 'work' }
  outbound_link_clicked: { destination: string; placement: string }
  cameo_clicked: { placement: string }
  booking_contact_clicked: { method: 'email' | 'phone'; placement: string }
  booking_email_copied: undefined
  newsletter_submitted: { placement: string }
  asset_download_clicked: { asset: string; placement: string }
  asset_preview_clicked: { asset: string; placement: string }
  homepage_section_viewed: { section: string }
  spotlight_selected: { panel: 'screen' | 'stage' | 'out-loud' }
  special_sleeve_opened: undefined
  special_teaser_requested: undefined
  special_teaser_started: undefined
  special_teaser_completed: undefined
  special_release_clicked: { action: string }
  special_link_copied: { target: 'page' | 'video' }
  appearances_filter_changed: { category: string }
  ticket_link_clicked: { event_id: string; ticket_status: string; placement: string }
  gallery_photo_opened: { photo_id: string; collection: string }
  gallery_photo_changed: { photo_id: string; method: 'button' | 'keyboard' | 'swipe' | 'thumbnail' }
  video_filter_changed: { category: string }
  video_selected: { video_id: string }
  gallery_video_requested: { video_id: string; placement: 'featured' | 'library' }
  external_video_clicked: { video_id: string; provider: 'vimeo' | 'youtube'; placement: string }
  qr_shared: { method: 'file' | 'link' | 'clipboard' }
}

type EventName = keyof Events
type EventData = Events[EventName]
type Tracker = { track: (name: string, data?: EventData) => Promise<unknown> | undefined }

const waiting: { name: EventName; data?: EventData }[] = []

export function isAnalyticsHost() {
  return typeof window !== 'undefined' && analyticsDomains.includes(window.location.hostname)
}

function getTracker() {
  return (window as Window & { umami?: Tracker }).umami
}

function send(tracker: Tracker, name: EventName, data?: EventData) {
  try {
    void tracker.track(name, data)?.catch(() => {})
  } catch {
    // Analytics must never interrupt the action that triggered it.
  }
}

export function flushAnalyticsEvents() {
  if (!isAnalyticsHost()) return
  const tracker = getTracker()
  if (!tracker) return
  for (const { name, data } of waiting.splice(0)) send(tracker, name, data)
}

export function trackEvent<K extends EventName>(
  name: K,
  ...[data]: Events[K] extends undefined ? [] : [Events[K]]
) {
  if (!isAnalyticsHost()) return
  const tracker = getTracker()
  if (tracker) {
    flushAnalyticsEvents()
    send(tracker, name, data)
  } else if (waiting.length < 20) {
    waiting.push({ name, data })
  }
}
