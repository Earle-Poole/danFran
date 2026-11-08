/**
 * Public, browser-safe calendar data. Keep this module free of Node-only
 * imports so it can be shared by server-rendered pages and client components.
 */
export type AppearanceEventStatus =
  | 'scheduled'
  | 'postponed'
  | 'cancelled'
  | 'rescheduled'

export type TicketStatus = 'on-sale' | 'presale' | 'sold-out' | 'coming-soon' | 'unknown'

export type AppearanceCategory = 'comedy' | 'speaking' | 'appearance'

/** Structured venue details are optional; never infer them from `location`. */
export type AppearanceVenue = {
  name: string
  streetAddress: string
  addressLocality: string
  addressCountry: string
  addressRegion?: string
  postalCode?: string
}

export type AppearanceEvent = {
  id: string
  title: string
  description: string
  location: string | null
  start: string
  end: string
  allDay: boolean
  timeZone: string
  eventStatus: AppearanceEventStatus
  ticketStatus: TicketStatus
  ticketUrl: string | null
  waitlistUrl: string | null
  ticketProvider: string | null
  category: AppearanceCategory
  venue?: AppearanceVenue
}

export type AppearanceFeed = {
  status: 'ready' | 'unconfigured' | 'unavailable'
  events: AppearanceEvent[]
  fetchedAt: string | null
  refreshAfterSeconds: number
}
