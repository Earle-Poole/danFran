import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import { findFragmentTarget } from '@/components/site/SiteShell'
import { getFragmentId } from 'lib/accessibility/focus'

const navigation = { pathname: '/' }

let mediaChange: ((event: MediaQueryListEvent) => void) | undefined

vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }))
vi.mock('next/link', () => ({ default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => <a href={href} {...props}>{children}</a> }))

describe('shared shell navigation', () => {
  beforeEach(() => {
    navigation.pathname = '/'
    window.history.replaceState(null, '', '/')
    vi.clearAllMocks()
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => { mediaChange = listener }),
        removeEventListener: vi.fn(),
      })),
    })
    mediaChange = undefined
  })

  it('ignores malformed percent-encoded fragments safely', () => {
    expect(getFragmentId('#%E0%A4%A')).toBeNull()
    expect(getFragmentId('#about')).toBe('about')
  })

  it('keeps the exact main landmark as the target for the skip fragment', () => {
    document.body.innerHTML = '<main id="main-content"><h1>Route heading</h1></main>'
    const main = document.getElementById('main-content')
    expect(findFragmentTarget('#main-content')).toBe(main)
  })

  it('defers hash-only active navigation state until after hydration', async () => {
    window.history.replaceState(null, '', '/#about')
    const serverMarkup = renderToString(<Header />)
    expect(serverMarkup).not.toContain('aria-current="page"')
    render(<Header />)
    await act(async () => {})
    expect(screen.getAllByRole('link', { name: 'About' })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: 'About' }).every((link) => link.getAttribute('aria-current') === 'page')).toBe(true)
  })

  it('uses the page-owned About, selected-work, and booking destinations', () => {
    render(<Header />)
    expect(screen.getAllByRole('link', { name: 'About' }).every((link) => link.getAttribute('href') === '/about')).toBe(true)
    expect(screen.getAllByRole('link', { name: 'Book Daniel' }).every((link) => link.getAttribute('href') === '/booking#booking-details')).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: /work/i }))
    expect(screen.getByRole('link', { name: 'Selected screen work' })).toHaveAttribute('href', '/about#selected-work')
  })

  it('owns one shared contact fragment in the footer', () => {
    render(<Footer />)
    expect(document.querySelectorAll('#contact')).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Book Daniel' })).toHaveAttribute('href', '/booking#booking-details')
  })

  it('opens and dismisses Work as a disclosure', () => {
    render(<Header />)
    const work = screen.getByRole('button', { name: /work/i })
    expect(work).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(work)
    expect(work).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Selected screen work' })).toBeVisible()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(work).toHaveAttribute('aria-expanded', 'false')
    expect(work).toHaveFocus()
  })

  it('exposes an in-flow compact menu with an accessible toggle', () => {
    render(<Header />)
    const menu = screen.getByRole('button', { name: 'Open navigation' })
    expect(menu).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(menu)
    expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveFocus()
  })

  it('moves focus out of navigation that becomes hidden at a breakpoint', () => {
    render(<Header />)
    const menu = screen.getByRole('button', { name: 'Open navigation' })
    fireEvent.click(menu)
    within(document.getElementById('compact-navigation')!).getByRole('link', { name: 'About' }).focus()
    act(() => mediaChange?.({ matches: true } as MediaQueryListEvent))
    expect(screen.getByRole('button', { name: /work/i })).toHaveFocus()

    const work = screen.getByRole('button', { name: /work/i })
    fireEvent.click(work)
    screen.getByRole('link', { name: 'Selected screen work' }).focus()
    act(() => mediaChange?.({ matches: false } as MediaQueryListEvent))
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveFocus()
    expect(work).toHaveAttribute('aria-expanded', 'false')
  })
})
