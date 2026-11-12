import { createHash } from 'node:crypto'
import type {
  AppearanceCategory,
  AppearanceEvent,
  AppearanceEventStatus,
  AppearanceVenue,
  TicketStatus,
} from './types'

export type GoogleCalendarEvent = {
  id?: unknown
  status?: unknown
  eventType?: unknown
  visibility?: unknown
  summary?: unknown
  description?: unknown
  location?: unknown
  recurringEventId?: unknown
  originalStartTime?: { date?: unknown; dateTime?: unknown; timeZone?: unknown }
  start?: { date?: unknown; dateTime?: unknown; timeZone?: unknown }
  end?: { date?: unknown; dateTime?: unknown; timeZone?: unknown }
}

export type GoogleCalendarPage = {
  timeZone?: unknown
  items?: unknown
  nextPageToken?: unknown
}

type ParsedDescription = {
  prose: string
  eventStatus?: AppearanceEventStatus
  eventStatusWasUnknown: boolean
  ticketStatus: TicketStatus
  ticketUrl: string | null
  waitlistUrl: string | null
  ticketProvider: string | null
  category: AppearanceCategory
  venue?: AppearanceVenue
}

const MAX_TEXT_LENGTH = 5000
const MAX_TITLE_LENGTH = 240
const MAX_LOCATION_LENGTH = 500
const MAX_PROVIDER_LENGTH = 120

const EVENT_STATUSES: Record<string, AppearanceEventStatus> = {
  scheduled: 'scheduled',
  postponed: 'postponed',
  cancelled: 'cancelled',
  canceled: 'cancelled',
  rescheduled: 'rescheduled',
}

const TICKET_STATUSES: Record<string, TicketStatus> = {
  'on-sale': 'on-sale',
  onsale: 'on-sale',
  'on sale': 'on-sale',
  presale: 'presale',
  'pre-sale': 'presale',
  'pre sale': 'presale',
  'sold-out': 'sold-out',
  soldout: 'sold-out',
  'sold out': 'sold-out',
  'coming-soon': 'coming-soon',
  comingsoon: 'coming-soon',
  'coming soon': 'coming-soon',
  unknown: 'unknown',
}

const CATEGORIES: Record<string, AppearanceCategory> = {
  comedy: 'comedy',
  speaking: 'speaking',
  appearance: 'appearance',
}

const decodeHtmlEntities = (value: string): string =>
  value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);?/gi, (match, entity: string) => {
    const normalized = entity.toLowerCase()
    if (normalized === 'amp') return '&'
    if (normalized === 'lt') return '<'
    if (normalized === 'gt') return '>'
    if (normalized === 'quot') return '"'
    if (normalized === 'apos') return "'"
    if (normalized === 'nbsp') return ' '
    if (normalized.startsWith('#x')) {
      const codePoint = Number.parseInt(normalized.slice(2), 16)
      return Number.isFinite(codePoint) && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : match
    }
    const codePoint = Number.parseInt(normalized.slice(1), 10)
    return Number.isFinite(codePoint) && codePoint <= 0x10ffff
      ? String.fromCodePoint(codePoint)
      : match
  })

/** Convert Google’s optional HTML description to bounded, harmless text. */
export const googleDescriptionToText = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  const withBreaks = value
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*\/\s*(?:p|div|li|h[1-6]|tr)\s*>/gi, '\n')
    .replace(/<\s*li\b[^>]*>/gi, '\n• ')
    .replace(/<[^>]*>/g, '')

  return decodeHtmlEntities(withBreaks)
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_TEXT_LENGTH)
}

const normalizeLabel = (value: string): string =>
  value.trim().toLowerCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ')

const parseMetadataLine = (line: string): { label: string; value: string } | null => {
  const match = line.match(/^\s*(event status|ticket status|tickets?|waitlist|ticket provider|category|venue name|street address|city|region|postal code|country)\s*(?::|[-–—])\s*(.*?)\s*$/i)
  if (!match) return null
  return { label: match[1].toLowerCase(), value: match[2].trim() }
}

const validTicketUrl = (value: string): string | null => {
  if (!value || value.length > 2000) return null
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase().replace(/\.$/, '')
    if (url.protocol !== 'https:' || url.username || url.password) return null
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host === '[::1]' ||
      host === 'your-ticket-page.com' ||
      host === 'example.com' ||
      host === 'example.org' ||
      host === 'example.net' ||
      host.endsWith('.your-ticket-page.com') ||
      host.endsWith('.example.com') ||
      host.endsWith('.example.org') ||
      host.endsWith('.example.net') ||
      host.endsWith('.invalid') ||
      host.endsWith('.test') ||
      host.endsWith('.localhost') ||
      host.endsWith('.example') ||
      host.startsWith('example.')
    ) {
      return null
    }
    let hasCredentialParameter = false
    url.searchParams.forEach((_value, key) => {
      if (/^(?:access[_-]?token|api[_-]?key|client[_-]?secret|credential|key|password|secret|token)$/i.test(key)) {
        hasCredentialParameter = true
      }
    })
    if (hasCredentialParameter) return null
    return url.toString()
  } catch {
    return null
  }
}

const parseDescription = (value: unknown): ParsedDescription => {
  const text = googleDescriptionToText(value)
  const prose: string[] = []
  let eventStatus: AppearanceEventStatus | undefined
  let eventStatusWasUnknown = false
  let ticketStatus: TicketStatus = 'unknown'
  let ticketUrl: string | null = null
  let waitlistUrl: string | null = null
  let ticketProvider: string | null = null
  let category: AppearanceCategory = 'appearance'
  const venueFields: Partial<AppearanceVenue> = {}

  for (const line of text.split('\n')) {
    const metadata = parseMetadataLine(line)
    if (!metadata) {
      prose.push(line)
      continue
    }

    const valueText = metadata.value
    switch (metadata.label) {
      case 'event status':
        eventStatus = EVENT_STATUSES[normalizeLabel(valueText)]
        if (!eventStatus) eventStatusWasUnknown = true
        break
      case 'ticket status':
        ticketStatus = TICKET_STATUSES[normalizeLabel(valueText)] ?? 'unknown'
        break
      case 'tickets':
      case 'ticket':
        ticketUrl = validTicketUrl(valueText)
        break
      case 'waitlist':
        waitlistUrl = validTicketUrl(valueText)
        break
      case 'ticket provider':
        ticketProvider = valueText.replace(/\s+/g, ' ').slice(0, MAX_PROVIDER_LENGTH) || null
        break
      case 'category':
        category = CATEGORIES[normalizeLabel(valueText)] ?? 'appearance'
        break
      case 'venue name':
        venueFields.name = safeText(valueText, MAX_TITLE_LENGTH)
        break
      case 'street address':
        venueFields.streetAddress = safeText(valueText, MAX_LOCATION_LENGTH)
        break
      case 'city':
        venueFields.addressLocality = safeText(valueText, MAX_LOCATION_LENGTH)
        break
      case 'region':
        venueFields.addressRegion = safeText(valueText, 120)
        break
      case 'postal code':
        venueFields.postalCode = safeText(valueText, 40)
        break
      case 'country':
        venueFields.addressCountry = safeText(valueText, 120)
        break
    }
  }

  const hasCompleteVenue = Boolean(
    venueFields.name &&
    venueFields.streetAddress &&
    venueFields.addressLocality &&
    venueFields.addressCountry,
  )

  return {
    prose: prose.join('\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, MAX_TEXT_LENGTH),
    eventStatus,
    eventStatusWasUnknown,
    ticketStatus,
    ticketUrl,
    waitlistUrl,
    ticketProvider,
    category,
    ...(hasCompleteVenue ? { venue: venueFields as AppearanceVenue } : {}),
  }
}

const safeText = (value: unknown, limit: number): string =>
  googleDescriptionToText(value).replace(/\s+/g, ' ').trim().slice(0, limit)

const validTimeZone = (value: unknown, fallback: string): string => {
  const candidate = typeof value === 'string' && value.trim() ? value.trim() : fallback
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: candidate }).format()
    return candidate
  } catch {
    return 'UTC'
  }
}

const publicId = (value: string): string =>
  createHash('sha256').update(value).digest('hex').slice(0, 24)

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/
const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:?\d{2})?$/

const parseLocalDateTime = (value: string, timeZone: string): number => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?$/)
  if (!match) return Number.NaN
  const [, year, month, day, hour, minute, second = '0', fraction = ''] = match
  const milliseconds = Number(`${fraction.slice(0, 3)}000`.slice(0, 3))
  const wallClock = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second), milliseconds)
  if (!Number.isFinite(wallClock)) return Number.NaN

  try {
    let timestamp = wallClock
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const parts = Object.fromEntries(formatter.formatToParts(new Date(timestamp)).map((part) => [part.type, part.value]))
      const represented = Date.UTC(
        Number(parts.year),
        Number(parts.month) - 1,
        Number(parts.day),
        Number(parts.hour),
        Number(parts.minute),
        Number(parts.second),
      )
      timestamp = wallClock - (represented - timestamp)
    }
    return timestamp
  } catch {
    return Number.NaN
  }
}

const parseDatePart = (
  part: { date?: unknown; dateTime?: unknown; timeZone?: unknown } | undefined,
  fallbackTimeZone = 'UTC',
): { value: string; allDay: boolean; timeZone?: string; timestamp: number } | null => {
  if (!part || typeof part !== 'object') return null
  if (typeof part.date === 'string' && dateOnlyPattern.test(part.date)) {
    const timestamp = Date.parse(`${part.date}T00:00:00Z`)
    const roundTrip = Number.isFinite(timestamp) ? new Date(timestamp).toISOString().slice(0, 10) : ''
    return Number.isFinite(timestamp) && roundTrip === part.date
      ? { value: part.date, allDay: true, timeZone: typeof part.timeZone === 'string' ? part.timeZone : undefined, timestamp }
      : null
  }
  if (typeof part.dateTime === 'string' && dateTimePattern.test(part.dateTime)) {
    const hasExplicitOffset = /(?:Z|[+-]\d{2}:?\d{2})$/.test(part.dateTime)
    const timestamp = hasExplicitOffset
      ? Date.parse(part.dateTime)
      : parseLocalDateTime(part.dateTime, typeof part.timeZone === 'string' ? part.timeZone : fallbackTimeZone)
    return Number.isFinite(timestamp) ? { value: new Date(timestamp).toISOString(), allDay: false, timeZone: typeof part.timeZone === 'string' ? part.timeZone : undefined, timestamp } : null
  }
  return null
}

const currentDateInTimeZone = (now: number, timeZone: string): string => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date(now))
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
    return `${values.year}-${values.month}-${values.day}`
  } catch {
    return new Date(now).toISOString().slice(0, 10)
  }
}

export type NormalizeOptions = {
  calendarTimeZone?: string
  now?: number
}

/** Normalize one untrusted Google event into the public contract. */
export const normalizeGoogleEvent = (
  event: GoogleCalendarEvent,
  options: NormalizeOptions = {},
): AppearanceEvent | null => {
  if (typeof event.id !== 'string' || !event.id.trim()) return null
  if (event.eventType !== undefined && event.eventType !== 'default') return null
  if (event.visibility === 'private' || event.visibility === 'confidential') return null
  if (event.status !== undefined && event.status !== 'confirmed' && event.status !== 'tentative' && event.status !== 'cancelled') return null
  if (event.status === 'tentative' || event.status === 'cancelled') return null

  const title = safeText(event.summary, MAX_TITLE_LENGTH)
  const start = parseDatePart(event.start, options.calendarTimeZone ?? 'UTC')
  const end = parseDatePart(event.end, options.calendarTimeZone ?? 'UTC')
  if (!title || !start || !end || start.allDay !== end.allDay) return null
  if (end.timestamp <= start.timestamp) return null

  const timeZone = validTimeZone(start.timeZone ?? end.timeZone, validTimeZone(options.calendarTimeZone, 'UTC'))
  const now = options.now ?? Date.now()
  if (start.allDay) {
    if (end.value <= currentDateInTimeZone(now, timeZone)) return null
  } else if ((end.timestamp ?? 0) <= now) {
    return null
  }

  const metadata = parseDescription(event.description)
  if (metadata.eventStatusWasUnknown) return null
  const eventStatus = metadata.eventStatus ?? 'scheduled'

  const suppressPurchase = eventStatus === 'cancelled' || eventStatus === 'postponed'
  const ticketUrl = suppressPurchase ? null : metadata.ticketUrl
  const waitlistUrl = suppressPurchase || metadata.ticketStatus !== 'sold-out' ? null : metadata.waitlistUrl

  return {
    id: publicId(event.id),
    title,
    description: metadata.prose,
    location: safeText(event.location, MAX_LOCATION_LENGTH) || null,
    start: start.value,
    end: end.value,
    allDay: start.allDay,
    timeZone,
    eventStatus,
    ticketStatus: metadata.ticketStatus,
    ticketUrl,
    waitlistUrl,
    ticketProvider: metadata.ticketProvider,
    category: metadata.category,
    ...(metadata.venue ? { venue: metadata.venue } : {}),
  }
}

export const normalizeGoogleEvents = (
  events: GoogleCalendarEvent[],
  options: NormalizeOptions = {},
): AppearanceEvent[] =>
  events
    .map((event) => normalizeGoogleEvent(event, options))
    .filter((event): event is AppearanceEvent => event !== null)
    .sort((a, b) => a.start.localeCompare(b.start) || a.id.localeCompare(b.id))
