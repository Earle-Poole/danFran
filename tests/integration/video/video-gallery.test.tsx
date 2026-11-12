import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { videos } from 'lib/content/videos'

const navigationState = {
  pathname: '/video-gallery',
  search: '',
  listeners: new Set<() => void>(),
}

vi.mock('next/navigation', async () => {
  const React = await import('react')
  const subscribe = (listener: () => void) => {
    navigationState.listeners.add(listener)
    return () => navigationState.listeners.delete(listener)
  }
  const getLocation = () => `${navigationState.pathname}${navigationState.search}`

  return {
    usePathname: () => React.useSyncExternalStore(subscribe, getLocation, getLocation).split('?')[0],
    useSearchParams: () => {
      const location = React.useSyncExternalStore(subscribe, getLocation, getLocation)
      return new URLSearchParams(location.split('?')[1] ?? '')
    },
  }
})

vi.mock('next/image', () => ({
  default: ({ fill: _fill, src }: { fill?: boolean; src: string }) => <span data-src={src} />,
}))

const nativePushState = window.history.pushState.bind(window.history)
const nativeReplaceState = window.history.replaceState.bind(window.history)
let VideoGalleryComponent: typeof import('@/components/video/VideoGallery').VideoGallery

function syncNavigationState() {
  navigationState.pathname = window.location.pathname
  navigationState.search = window.location.search
  Array.from(navigationState.listeners).forEach((listener) => listener())
}

function setLocation(search: string) {
  nativeReplaceState(null, '', `/video-gallery${search}`)
  syncNavigationState()
}

describe('VideoGallery App Router query state', () => {
  beforeEach(async () => {
    navigationState.listeners.clear()
    setLocation(`?category=all&video=${videos[0].id}`)
    vi.clearAllMocks()
    vi.spyOn(window.history, 'pushState').mockImplementation((data, unused, url) => {
      nativePushState(data, unused, url)
      syncNavigationState()
    })
    vi.spyOn(window.history, 'replaceState').mockImplementation((data, unused, url) => {
      nativeReplaceState(data, unused, url)
      syncNavigationState()
    })
    VideoGalleryComponent = (await import('@/components/video/VideoGallery')).VideoGallery
  })

  it('retains all ten records and keeps selection separate from playback', async () => {
    render(<VideoGalleryComponent />)
    await act(async () => {})

    expect(screen.getAllByRole('button', { name: /^Select / })).toHaveLength(10)
    expect(screen.getByRole('heading', { name: videos[0].title })).toBeInTheDocument()
    expect(screen.queryByTitle(`Video player for ${videos[0].title}`)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: `Select ${videos[1].title}` }))
    await act(async () => new Promise((resolve) => window.setTimeout(resolve, 30)))
    expect(screen.queryByTitle(`Video player for ${videos[1].title}`)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: videos[1].title })).toHaveFocus()
    expect(new URLSearchParams(window.location.search).get('video')).toBe(videos[1].id)

    fireEvent.click(screen.getAllByRole('button', { name: `Play ${videos[1].title}` })[0])
    expect(screen.getAllByTitle(`Video player for ${videos[1].title}`)).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: `Select ${videos[2].title}` }))
    expect(screen.queryByTitle(`Video player for ${videos[1].title}`)).not.toBeInTheDocument()
    expect(screen.queryByTitle(`Video player for ${videos[2].title}`)).not.toBeInTheDocument()
  })

  it('filters with pressed buttons without changing the featured selection', () => {
    render(<VideoGalleryComponent />)

    fireEvent.click(screen.getByRole('button', { name: 'Comedy' }))

    expect(screen.getByRole('button', { name: 'Comedy' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Showing 6 videos.')
    expect(screen.getByRole('heading', { name: videos[0].title })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Select / })).toHaveLength(6)
    expect(new URLSearchParams(window.location.search).get('category')).toBe('comedy')
  })

  it('normalizes invalid URL state to the first video and all filter', async () => {
    await act(async () => {
      setLocation(`?category=invalid&category=comedy&video=missing-video&video=${videos[0].id}`)
    })
    render(<VideoGalleryComponent />)
    await act(async () => new Promise((resolve) => window.setTimeout(resolve, 5)))

    expect(screen.getByRole('button', { name: 'All videos' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: videos[0].title })).toBeInTheDocument()
    expect(window.location.search).toBe(`?category=all&video=${videos[0].id}`)
    expect(window.history.replaceState).toHaveBeenCalled()
  })

  it('loads an App Router deep link on the first render', () => {
    act(() => setLocation(`?category=interviews-press&video=${videos[6].id}`))
    render(<VideoGalleryComponent />)

    expect(screen.getByRole('heading', { name: videos[6].title })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Select / })).toHaveLength(4)
  })

  it('uses history entries for meaningful filter and selection changes and syncs Back', async () => {
    render(<VideoGalleryComponent />)
    const pushes = vi.mocked(window.history.pushState)

    fireEvent.click(screen.getByRole('button', { name: /^Comedy$/ }))
    await act(async () => {})
    expect(pushes).toHaveBeenCalledTimes(1)
    expect(window.location.search).toBe(`?category=comedy&video=${videos[0].id}`)

    fireEvent.click(screen.getByRole('button', { name: `Select ${videos[1].title}` }))
    expect(pushes).toHaveBeenCalledTimes(2)
    expect(window.location.search).toBe(`?category=comedy&video=${videos[1].id}`)

    await act(async () => {
      setLocation(`?category=all&video=${videos[0].id}`)
    })
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'All videos' })).toHaveAttribute('aria-pressed', 'true')
    })
    expect(screen.getByRole('heading', { name: videos[0].title })).toBeInTheDocument()
  })

  it('stops playback when filtering and does not push a duplicate entry for Play', async () => {
    render(<VideoGalleryComponent />)
    const play = screen.getAllByRole('button', { name: `Play ${videos[0].title}` })[0]
    fireEvent.click(play)
    expect(screen.getByTitle(`Video player for ${videos[0].title}`)).toBeInTheDocument()
    expect(window.history.pushState).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /^Comedy$/ }))
    await act(async () => {})
    expect(screen.queryByTitle(`Video player for ${videos[0].title}`)).not.toBeInTheDocument()
  })

  it('keeps explicit Play on a newly selected card through URL reconciliation', async () => {
    render(<VideoGalleryComponent />)

    fireEvent.click(screen.getByRole('button', { name: `Play ${videos[1].title}` }))
    await act(async () => new Promise((resolve) => window.setTimeout(resolve, 30)))

    expect(screen.getByTitle(`Video player for ${videos[1].title}`)).toBeInTheDocument()
    expect(new URLSearchParams(window.location.search).get('video')).toBe(videos[1].id)
  })

  it('does not start playback when a Back navigation selects a different video', async () => {
    render(<VideoGalleryComponent />)

    fireEvent.click(screen.getByRole('button', { name: `Select ${videos[2].title}` }))
    await act(async () => new Promise((resolve) => window.setTimeout(resolve, 30)))
    fireEvent.click(screen.getAllByRole('button', { name: `Play ${videos[2].title}` })[0])
    await act(async () => new Promise((resolve) => window.setTimeout(resolve, 30)))
    expect(screen.getByTitle(`Video player for ${videos[2].title}`)).toBeInTheDocument()

    await act(async () => {
      setLocation(`?category=all&video=${videos[0].id}`)
    })
    await act(async () => new Promise((resolve) => window.setTimeout(resolve, 30)))
    expect(screen.queryByTitle(`Video player for ${videos[0].title}`)).not.toBeInTheDocument()
    expect(screen.queryByTitle(`Video player for ${videos[2].title}`)).not.toBeInTheDocument()
  })

  it('keeps a direct-watch recovery link when the embed reports an error', async () => {
    render(<VideoGalleryComponent />)

    fireEvent.click(screen.getAllByRole('button', { name: `Play ${videos[0].title}` })[0])
    const iframe = screen.getByTitle(`Video player for ${videos[0].title}`)
    fireEvent.error(iframe)
    await act(async () => {})

    expect(screen.getByRole('link', { name: 'watch this video directly on YouTube' })).toHaveAttribute(
      'href',
      videos[0].watchUrl,
    )
  })
})
