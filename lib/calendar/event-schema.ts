import type { AppearanceEvent, AppearanceVenue } from './types'
import { getAppearanceEventPath } from './event-links'

export type AppearanceEventJsonLd = {
  readonly [key: string]: string | readonly string[] | AppearanceEventJsonLd | undefined
}

const validCalendarDate = (value: string): boolean => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const [, year, month, day] = match
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return parsed.getUTCFullYear() === Number(year) &&
    parsed.getUTCMonth() + 1 === Number(month) &&
    parsed.getUTCDate() === Number(day)
}

const validTimedDate = (value: string): boolean => {
  const match = /^(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:?\d{2})$/.exec(value)
  return Boolean(match && validCalendarDate(match[1]) && Number.isFinite(Date.parse(value)))
}

const isValidDate = (value: string, allDay: boolean): boolean =>
  allDay ? validCalendarDate(value) : validTimedDate(value)

const schemaDate = (value: string, allDay: boolean): string | null => {
  if (!isValidDate(value, allDay)) return null
  return allDay ? value : new Date(value).toISOString()
}

const isCompleteVenue = (value: unknown): value is AppearanceVenue => {
  if (!value || typeof value !== 'object') return false
  const venue = value as Record<string, unknown>
  return [venue.name, venue.streetAddress, venue.addressLocality, venue.addressCountry]
    .every((part) => typeof part === 'string' && part.trim().length > 0)
}

const finalAllDayDate = (exclusiveEnd: string): string | null => {
  if (!validCalendarDate(exclusiveEnd)) return null
  const finalDate = new Date(`${exclusiveEnd}T00:00:00.000Z`)
  finalDate.setUTCDate(finalDate.getUTCDate() - 1)
  return finalDate.toISOString().slice(0, 10)
}

/** Event markup shared by server rendering and the live client refresh. */
export const getAppearanceEventJsonLd = (
  origin: string | null | undefined,
  event: AppearanceEvent,
): AppearanceEventJsonLd | null => {
  if (!origin || !/^https?:\/\//.test(origin)) return null
  let safeOrigin: string
  try {
    const parsedOrigin = new URL(origin)
    if ((parsedOrigin.protocol !== 'https:' && parsedOrigin.protocol !== 'http:') ||
      parsedOrigin.username || parsedOrigin.password || parsedOrigin.pathname !== '/' ||
      parsedOrigin.search || parsedOrigin.hash) return null
    safeOrigin = parsedOrigin.origin
  } catch {
    return null
  }

  const path = getAppearanceEventPath(event)
  if (!path || typeof event.title !== 'string' || !event.title.trim() || !isCompleteVenue(event.venue)) return null
  const startDate = schemaDate(event.start, event.allDay)
  if (!startDate) return null
  const endDate = event.allDay
    ? finalAllDayDate(event.end)
    : schemaDate(event.end, false)

  const address: AppearanceEventJsonLd = {
    '@type': 'PostalAddress',
    streetAddress: event.venue.streetAddress,
    addressLocality: event.venue.addressLocality,
    addressCountry: event.venue.addressCountry,
    ...(event.venue.addressRegion ? { addressRegion: event.venue.addressRegion } : {}),
    ...(event.venue.postalCode ? { postalCode: event.venue.postalCode } : {}),
  }
  const eventUrl = `${safeOrigin}${path}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${eventUrl}#event`,
    url: eventUrl,
    name: event.title,
    startDate,
    ...(endDate && Date.parse(endDate) >= Date.parse(startDate) ? { endDate } : {}),
    eventStatus: {
      scheduled: 'https://schema.org/EventScheduled',
      postponed: 'https://schema.org/EventPostponed',
      cancelled: 'https://schema.org/EventCancelled',
      rescheduled: 'https://schema.org/EventRescheduled',
    }[event.eventStatus],
    location: {
      '@type': 'Place',
      name: event.venue.name,
      address,
    },
    ...(typeof event.description === 'string' && event.description.trim()
      ? { description: event.description }
      : {}),
  }
}

export const serializeAppearanceEventJsonLd = (value: AppearanceEventJsonLd): string =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
