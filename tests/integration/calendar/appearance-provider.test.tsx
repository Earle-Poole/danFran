import { act, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppearanceProvider, useAppearanceFeed } from '@/components/appearances'
import { emptyFeed, readyFeed } from '../../fixtures/calendar'

function FeedProbe() {
  const { feed, delayed } = useAppearanceFeed()
  return (
    <output data-testid="feed-state">
      {feed?.status ?? 'none'}:{feed?.events.length ?? 0}:{delayed ? 'delayed' : 'current'}
    </output>
  )
}

const responseFor = (body: unknown, ok = true): Response =>
  ({ ok, json: async () => body } as Response)

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('AppearanceProvider refresh lifecycle', () => {
  it('adopts a fresh SSR feed when navigation changes page props', async () => {
    const { rerender } = render(
      <AppearanceProvider initialFeed={readyFeed([readyFeed().events[0]])}>
        <FeedProbe />
      </AppearanceProvider>,
    )
    expect(screen.getByTestId('feed-state')).toHaveTextContent('ready:1:current')

    rerender(
      <AppearanceProvider initialFeed={emptyFeed}>
        <FeedProbe />
      </AppearanceProvider>,
    )
    await waitFor(() => expect(screen.getByTestId('feed-state')).toHaveTextContent('unconfigured:0:current'))
  })

  it('adds and removes events on focus refresh without overlapping requests or leaking after cleanup', async () => {
    let resolveFirst: ((response: Response) => void) | undefined
    let resolveSecond: ((response: Response) => void) | undefined
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => new Promise<Response>((resolve) => { resolveFirst = resolve }))
      .mockImplementationOnce(() => new Promise<Response>((resolve) => { resolveSecond = resolve }))
    vi.stubGlobal('fetch', fetchMock)

    const { unmount } = render(
      <AppearanceProvider initialFeed={emptyFeed}>
        <FeedProbe />
      </AppearanceProvider>,
    )

    await act(async () => {
      window.dispatchEvent(new Event('focus'))
      window.dispatchEvent(new Event('focus'))
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await act(async () => resolveFirst?.(responseFor(readyFeed())))
    await waitFor(() => expect(screen.getByTestId('feed-state')).toHaveTextContent('ready:6:current'))

    await act(async () => {
      window.dispatchEvent(new Event('focus'))
      window.dispatchEvent(new Event('focus'))
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    await act(async () => resolveSecond?.(responseFor(emptyFeed)))
    await waitFor(() => expect(screen.getByTestId('feed-state')).toHaveTextContent('unconfigured:0:current'))

    unmount()
    await act(async () => {
      window.dispatchEvent(new Event('focus'))
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('polls at the feed refresh interval and retains good data while marking a failed update delayed', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn().mockRejectedValue(new Error('fixture outage'))
    vi.stubGlobal('fetch', fetchMock)

    const { unmount } = render(
      <AppearanceProvider initialFeed={readyFeed([readyFeed().events[0]])}>
        <FeedProbe />
      </AppearanceProvider>,
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(59_999)
    })
    expect(fetchMock).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('feed-state')).toHaveTextContent('ready:1:delayed')

    unmount()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000)
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('marks a last-good feed delayed when a refresh hangs past the bounded client timeout', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn().mockImplementation(() => new Promise<Response>(() => undefined))
    vi.stubGlobal('fetch', fetchMock)

    render(
      <AppearanceProvider initialFeed={readyFeed([readyFeed().events[0]])}>
        <FeedProbe />
      </AppearanceProvider>,
    )

    await act(async () => {
      window.dispatchEvent(new Event('focus'))
      await vi.advanceTimersByTimeAsync(30_000)
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('feed-state')).toHaveTextContent('ready:1:delayed')
  })
})
