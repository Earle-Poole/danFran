import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HomeTemplate from '@/components/templates/home/HomeTemplate'
import AboutPage from '@/components/about/AboutPage'
import BookingPage from '@/components/booking/BookingPage'
import { renderHomePage } from '../../../app/_home-page'

vi.mock('lib/calendar/server', () => ({
  getAppearanceFeed: vi.fn().mockResolvedValue({
    status: 'unconfigured',
    events: [],
    fetchedAt: null,
    refreshAfterSeconds: 60,
  }),
}))

describe('main visitor pages', () => {
  it('keeps the home identity, destination links, and legacy fragments', () => {
    render(<HomeTemplate />)

    expect(screen.getByRole('heading', { level: 1, name: 'Daniel Franzese' })).toHaveAttribute('data-route-heading')
    expect(screen.getByRole('link', { name: 'Watch Daniel' })).toHaveAttribute('href', '/video-gallery')
    expect(screen.getByRole('link', { name: 'Booking inquiries' })).toHaveAttribute('href', '/booking')
    expect(document.getElementById('home')).toBeInTheDocument()
    expect(document.getElementById('about')).toBeInTheDocument()
    expect(document.getElementById('cameo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Find Daniel on Cameo' })).toHaveAttribute('href', 'https://www.cameo.com/whatsupdanny')
  })

  it('composes the VIDEO-owned newsletter contract once on the App Router Home page', async () => {
    render(await renderHomePage('home'))

    const newsletter = document.getElementById('home-newsletter')
    expect(newsletter).toBeInTheDocument()
    expect(within(newsletter as HTMLElement).getByRole('heading', { name: 'Stay in the loop.' })).toBeInTheDocument()
    expect(within(newsletter as HTMLElement).getByRole('textbox', { name: /Email address/ })).toHaveAttribute('name', 'EMAIL')
    expect(within(newsletter as HTMLElement).getByRole('button', { name: 'Subscribe' })).toBeInTheDocument()
  })

  it('renders the complete About journey and a focusable selected-work target', () => {
    render(<AboutPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'More than a familiar face.' })).toHaveAttribute('data-route-heading')
    expect(screen.getByText(/Best known for his role as Damian/)).toBeInTheDocument()
    const selectedWork = document.getElementById('selected-work')
    expect(selectedWork).toBeInTheDocument()
    expect(within(selectedWork as HTMLElement).getByRole('heading', { level: 2, name: 'Roles with range.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Download biography' })).toHaveAttribute('href', '/assets/press_kit/df-biography.pdf')
  })

  it('exposes real booking mail and telephone destinations without a form', () => {
    render(<BookingPage />)

    expect(screen.getByRole('heading', { level: 1, name: "Let's work together." })).toHaveAttribute('data-route-heading')
    const bookingDetails = document.getElementById('booking-details')
    expect(bookingDetails).toBeInTheDocument()
    expect(within(bookingDetails as HTMLElement).getByRole('heading', { level: 2, name: "Tell us what you're planning." })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Email booking contact/ })).toHaveAttribute('href', 'mailto:Gary@AdvancedManagement.tv')
    expect(screen.getByRole('link', { name: /Call booking contact/ })).toHaveAttribute('href', 'tel:+14243331500')
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Find Daniel on Cameo' })).toHaveAttribute('href', 'https://www.cameo.com/whatsupdanny')
  })

  it('keeps original page photos dimensioned for stable responsive layout', () => {
    for (const Page of [HomeTemplate, AboutPage, BookingPage]) {
      const { container, unmount } = render(<Page />)
      const images = Array.from(container.querySelectorAll('img'))

      expect(images.length).toBeGreaterThan(0)
      for (const image of images) {
        expect(Number(image.getAttribute('width'))).toBeGreaterThan(0)
        expect(Number(image.getAttribute('height'))).toBeGreaterThan(0)
      }

      unmount()
    }
  })
})
