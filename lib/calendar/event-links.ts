import type { AppearanceEvent } from './types'

const PUBLIC_EVENT_ID = /^[a-f0-9]{24}$/

/** Build a stable public path from the opaque ID created by calendar normalization. */
export const getAppearanceEventPath = (event: Pick<AppearanceEvent, 'id'>): string | null =>
  PUBLIC_EVENT_ID.test(event.id) ? `/calendar/${event.id}` : null

/** Look up only an already-normalized, displayable event by its public ID. */
export const findAppearanceEventById = (
  events: readonly AppearanceEvent[],
  eventId: string,
): AppearanceEvent | null => {
  if (!PUBLIC_EVENT_ID.test(eventId)) return null
  return events.find((event) => event.id === eventId) ?? null
}
