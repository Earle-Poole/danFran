import type { AppearanceEvent } from 'lib/calendar/types'

export type EventDisplayDate = {
  date: string
  month: string
  day: string
  year: string
  time: string
}

const safeTimeZone = (timeZone: string): string | undefined => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format()
    return timeZone
  } catch {
    return undefined
  }
}

const formatAllDayDate = (value: string): Date => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return new Date(value)
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
}

export const formatEventDate = (event: AppearanceEvent): EventDisplayDate => {
  const timeZone = safeTimeZone(event.timeZone)
  const date = event.allDay ? formatAllDayDate(event.start) : new Date(event.start)
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...(event.allDay ? { timeZone: 'UTC' } : timeZone ? { timeZone } : {}),
  }
  const yearOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    ...(event.allDay ? { timeZone: 'UTC' } : timeZone ? { timeZone } : {}),
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    ...(timeZone ? { timeZone } : {}),
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date)
  const dateParts = formattedDate.split(' ')

  return {
    date: formattedDate,
    month: dateParts[0]?.toUpperCase() ?? '',
    day: dateParts.slice(1).join(' ').padStart(2, '0'),
    year: new Intl.DateTimeFormat('en-US', yearOptions).format(date),
    time: event.allDay ? 'All day' : new Intl.DateTimeFormat('en-US', timeOptions).format(date),
  }
}

export const getEventStatusLabel = (event: AppearanceEvent): string => {
  if (event.eventStatus === 'cancelled') return 'Cancelled'
  if (event.eventStatus === 'postponed') return 'Postponed'
  if (event.eventStatus === 'rescheduled') return 'Rescheduled'

  switch (event.ticketStatus) {
    case 'on-sale':
      return 'On sale'
    case 'presale':
      return 'Presale'
    case 'sold-out':
      return 'Sold out'
    case 'coming-soon':
      return 'Coming soon'
    default:
      return 'Tickets to be announced'
  }
}

export type TicketAction = {
  href: string
  label: string
}

export const getTicketAction = (
  event: AppearanceEvent,
  delayed = false,
): TicketAction | null => {
  if (delayed || event.eventStatus === 'cancelled' || event.eventStatus === 'postponed') return null

  if ((event.ticketStatus === 'on-sale' || event.ticketStatus === 'presale') && event.ticketUrl) {
    return { href: event.ticketUrl, label: event.ticketStatus === 'presale' ? 'View presale' : 'Get tickets' }
  }

  if (event.ticketStatus === 'sold-out' && event.waitlistUrl) {
    return { href: event.waitlistUrl, label: 'Join waitlist' }
  }

  return null
}

export const getLocationLabel = (event: AppearanceEvent): string =>
  event.location?.trim() || 'Venue to be announced'

export const getNeutralActionLabel = (event: AppearanceEvent, delayed = false): string => {
  if (delayed) return 'Ticket actions paused'
  if (event.eventStatus === 'cancelled' || event.eventStatus === 'postponed') return 'No ticket action'
  if (event.ticketStatus === 'coming-soon') return 'Tickets coming soon'
  if (event.ticketStatus === 'sold-out') return 'No waitlist available'
  if (event.ticketStatus === 'on-sale' || event.ticketStatus === 'presale') return 'Ticket link unavailable'
  return 'Details to follow'
}
