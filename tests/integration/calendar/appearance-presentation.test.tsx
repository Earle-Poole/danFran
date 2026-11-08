import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppearanceFilterBar, AppearanceList, getActiveAppearanceFilter } from '@/components/appearances'
import { formatEventDate, getLocationLabel, getTicketAction } from '@/components/appearances/helpers'
import { appearanceEvents } from '../../fixtures/calendar'

describe('appearance presentation contract', () => {
  it('renders venue-local dates, statuses, and honest ticket actions', () => {
    render(<AppearanceList events={appearanceEvents} />)

    expect(screen.getByText('Chicago Comedy Night')).toBeInTheDocument()
    expect(screen.getByText(/The Vic Theatre, Chicago, IL/)).toBeInTheDocument()
    expect(screen.getByText('On sale')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get tickets: Chicago Comedy Night' })).toHaveAttribute(
      'href',
      'https://tickets.qa.test/chicago',
    )

    expect(screen.getByText('Presale')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View presale: Austin Storytelling Talk' })).toBeInTheDocument()
    expect(screen.getByText('Sold out')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Join waitlist: New York Standup' })).toBeInTheDocument()

    const postponed = screen.getByText('Los Angeles Panel').closest('article') as HTMLElement
    expect(within(postponed).getByText('Postponed')).toBeInTheDocument()
    expect(within(postponed).getByRole('link', { name: 'Los Angeles Panel' })).toHaveAttribute(
      'href',
      '/calendar/304d0c6775f57552944b8f34',
    )
    expect(within(postponed).queryByRole('link', { name: /Get tickets|View presale|Join waitlist/ })).not.toBeInTheDocument()

    const cancelled = screen.getByText('Cancelled Festival Appearance').closest('article') as HTMLElement
    expect(within(cancelled).getByText('Cancelled')).toBeInTheDocument()
    expect(within(cancelled).getByText('Venue to be announced')).toBeInTheDocument()
    expect(within(cancelled).getByRole('link', { name: 'Cancelled Festival Appearance' })).toHaveAttribute(
      'href',
      '/calendar/485f1411905a4e5420f25daa',
    )
    expect(within(cancelled).queryByRole('link', { name: /Get tickets|View presale|Join waitlist/ })).not.toBeInTheDocument()
  })

  it('keeps stale or delayed schedules from exposing purchase actions', () => {
    render(<AppearanceList events={appearanceEvents.slice(0, 3)} delayed />)

    expect(screen.queryByRole('link', { name: /Get tickets|View presale|Join waitlist/ })).not.toBeInTheDocument()
    expect(getTicketAction(appearanceEvents[0], true)).toBeNull()
  })

  it('preserves all-day calendar dates and uses the explicit venue timezone', () => {
    const allDay = appearanceEvents.find((event) => event.allDay)!
    const display = formatEventDate(allDay)

    expect(display.date).toBe('Jun 12')
    expect(display.year).toBe('2027')
    expect(display.time).toBe('All day')
    expect(getLocationLabel(allDay)).toBe('Venue to be announced')

    const lateChicago = formatEventDate(appearanceEvents[0])
    expect(lateChicago.date).toBe('Jan 15')
    expect(lateChicago.time).toMatch(/2:00 PM|2:00 p\.m\./i)
  })

  it('falls back to all appearances when a category disappears and keeps the rendered year', () => {
    const { rerender } = render(
      <AppearanceFilterBar events={appearanceEvents.slice(0, 2)} value="speaking" onChange={() => undefined} />,
    )

    expect(getActiveAppearanceFilter(appearanceEvents.slice(0, 2), 'speaking')).toBe('speaking')
    expect(screen.getByText('1 upcoming appearance · 2027')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Speaking' })).toHaveAttribute('aria-pressed', 'true')

    rerender(<AppearanceFilterBar events={appearanceEvents.slice(0, 1)} value="speaking" onChange={() => undefined} />)

    expect(getActiveAppearanceFilter(appearanceEvents.slice(0, 1), 'speaking')).toBe('all')
    expect(screen.getByText('1 upcoming appearance · 2027')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All appearances' })).toHaveAttribute('aria-pressed', 'true')
  })
})
