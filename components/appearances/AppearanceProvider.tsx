'use client'

import type { AppearanceFeed } from 'lib/calendar/types'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

const STALE_WINDOW_MS = 5 * 60 * 1000
const REQUEST_TIMEOUT_MS = 15 * 1000
const REFRESH_DEDUPE_WINDOW_MS = 1000

type AppearanceContextValue = {
  feed: AppearanceFeed | null
  delayed: boolean
  refresh: () => Promise<void>
  seedFromServer: (feed: AppearanceFeed) => void
  isRootProvider: boolean
  seededServerFeedKey: string | null
}

const AppearanceContext = createContext<AppearanceContextValue>({
  feed: null,
  delayed: false,
  refresh: async () => undefined,
  seedFromServer: () => undefined,
  isRootProvider: false,
  seededServerFeedKey: null,
})

const getFeedKey = (feed: AppearanceFeed | null | undefined): string =>
  feed ? `${feed.status}:${feed.fetchedAt ?? ''}:${feed.events.map((event) => event.id).join(',')}` : 'no-feed'

const isEvent = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') return false
  const event = value as Record<string, unknown>
  return (
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    typeof event.description === 'string' &&
    (typeof event.location === 'string' || event.location === null) &&
    typeof event.start === 'string' &&
    typeof event.end === 'string' &&
    typeof event.allDay === 'boolean' &&
    typeof event.timeZone === 'string' &&
    ['scheduled', 'postponed', 'cancelled', 'rescheduled'].includes(String(event.eventStatus)) &&
    ['on-sale', 'presale', 'sold-out', 'coming-soon', 'unknown'].includes(String(event.ticketStatus)) &&
    (typeof event.ticketUrl === 'string' || event.ticketUrl === null) &&
    (typeof event.waitlistUrl === 'string' || event.waitlistUrl === null) &&
    (typeof event.ticketProvider === 'string' || event.ticketProvider === null) &&
    ['comedy', 'speaking', 'appearance'].includes(String(event.category))
  )
}

const isFeed = (value: unknown): value is AppearanceFeed => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<AppearanceFeed>
  return (
    (candidate.status === 'ready' || candidate.status === 'unconfigured' || candidate.status === 'unavailable') &&
    Array.isArray(candidate.events) &&
    candidate.events.every(isEvent) &&
    typeof candidate.refreshAfterSeconds === 'number' &&
    Number.isFinite(candidate.refreshAfterSeconds) &&
    candidate.refreshAfterSeconds > 0
  )
}

type AppearanceProviderProps = {
  initialFeed?: AppearanceFeed | null
  children: ReactNode
}

export function AppearanceProvider(props: AppearanceProviderProps) {
  const parent = useContext(AppearanceContext)
  return parent.isRootProvider
    ? <RouteAppearanceProvider {...props} parent={parent} />
    : <RootAppearanceProvider {...props} />
}

function RootAppearanceProvider({ initialFeed, children }: AppearanceProviderProps) {
  const initialFeedKey = getFeedKey(initialFeed)
  const [feedState, setFeedState] = useState<{ key: string; feed: AppearanceFeed | null }>({ key: initialFeedKey, feed: initialFeed ?? null })
  const [seededServerFeedKey, setSeededServerFeedKey] = useState<string | null>(initialFeed === undefined ? null : initialFeedKey)
  const feed = initialFeed === undefined
    ? feedState.feed
    : feedState.key === initialFeedKey
      ? feedState.feed
      : initialFeed
  const [delayed, setDelayed] = useState(false)
  const lastGoodRef = useRef<{ feed: AppearanceFeed; receivedAt: number } | null>(null)
  const inFlightRef = useRef<Promise<void> | null>(null)
  const initialRefreshStartedAtRef = useRef<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)
  const effectGenerationRef = useRef(0)

  const setCurrentFeed = useCallback((nextFeed: AppearanceFeed | null) => {
    setFeedState({ key: initialFeedKey, feed: nextFeed })
  }, [initialFeedKey])

  const seedFromServer = useCallback((nextFeed: AppearanceFeed) => {
    setCurrentFeed(nextFeed)
    setSeededServerFeedKey(getFeedKey(nextFeed))
    setDelayed(false)
    if (nextFeed.status === 'ready' && nextFeed.events.length > 0) {
      lastGoodRef.current = { feed: nextFeed, receivedAt: Date.now() }
    } else {
      lastGoodRef.current = null
    }
  }, [setCurrentFeed])

  useEffect(() => {
    if (initialFeed === undefined) return
    if (initialFeed?.status === 'ready' && initialFeed.events.length > 0) {
      lastGoodRef.current = { feed: initialFeed, receivedAt: Date.now() }
    } else lastGoodRef.current = null
  }, [initialFeed])

  const refresh = useCallback(async () => {
    if (inFlightRef.current) {
      if (!abortRef.current?.signal.aborted) return inFlightRef.current
      inFlightRef.current = null
      abortRef.current = null
    }
    const now = Date.now()

    const controller = new AbortController()
    abortRef.current = controller
    let didTimeout = false
    const lastGood = lastGoodRef.current
    const staleDeadline = lastGood
      ? Math.max(0, STALE_WINDOW_MS - (now - lastGood.receivedAt))
      : null
    const staleTimer = staleDeadline === null
      ? null
      : window.setTimeout(() => {
          if (!mountedRef.current || !inFlightRef.current) return
          lastGoodRef.current = null
          setCurrentFeed({ status: 'unavailable', events: [], fetchedAt: null, refreshAfterSeconds: 60 })
          setDelayed(false)
        }, staleDeadline)
    const timeout = window.setTimeout(() => {
      didTimeout = true
      controller.abort()
      const stillGood = lastGoodRef.current
      if (mountedRef.current) {
        if (stillGood && Date.now() - stillGood.receivedAt <= STALE_WINDOW_MS) {
          setCurrentFeed(stillGood.feed)
          setDelayed(true)
        } else {
          setCurrentFeed({ status: 'unavailable', events: [], fetchedAt: null, refreshAfterSeconds: 60 })
          setDelayed(false)
        }
      }
      if (abortRef.current === controller) abortRef.current = null
      inFlightRef.current = null
    }, REQUEST_TIMEOUT_MS)
    const request = (async () => {
      try {
        const response = await fetch('/api/appearances', {
          cache: 'no-store',
          signal: controller.signal,
        })
        const body: unknown = await response.json()
        if (!isFeed(body)) throw new Error('Invalid appearances response')

        if (!response.ok || body.status === 'unavailable') {
          throw new Error('Appearances unavailable')
        }

        if (!mountedRef.current) return
        setCurrentFeed(body)
        setDelayed(false)
        if (body.status === 'ready' && body.events.length > 0) {
          lastGoodRef.current = { feed: body, receivedAt: Date.now() }
        } else if (body.status === 'unconfigured' || body.events.length === 0) {
          lastGoodRef.current = null
        }
      } catch (error) {
        if (!mountedRef.current || (error instanceof DOMException && error.name === 'AbortError' && !didTimeout)) return
        const lastGood = lastGoodRef.current
        if (lastGood && Date.now() - lastGood.receivedAt <= STALE_WINDOW_MS) {
          setCurrentFeed(lastGood.feed)
          setDelayed(true)
        } else {
          setCurrentFeed({
            status: 'unavailable',
            events: [],
            fetchedAt: null,
            refreshAfterSeconds: 60,
          })
          setDelayed(false)
        }
      }
    })()

    const settled = request.finally(() => {
      window.clearTimeout(timeout)
      if (staleTimer !== null) window.clearTimeout(staleTimer)
      if (inFlightRef.current === settled) inFlightRef.current = null
      if (abortRef.current === controller) abortRef.current = null
    })
    inFlightRef.current = settled
    return settled
  }, [setCurrentFeed])

  const refreshWhenVisible = useCallback(() => {
    if (
      initialRefreshStartedAtRef.current !== null &&
      Date.now() - initialRefreshStartedAtRef.current < REFRESH_DEDUPE_WINDOW_MS
    ) return
    if (document.visibilityState === 'visible') void refresh()
  }, [refresh])

  useEffect(() => {
    if (!delayed) return
    const lastGood = lastGoodRef.current
    const remaining = lastGood
      ? Math.max(0, STALE_WINDOW_MS - (Date.now() - lastGood.receivedAt))
      : STALE_WINDOW_MS
    const timer = window.setTimeout(() => {
      if (!mountedRef.current) return
      lastGoodRef.current = null
      setCurrentFeed({ status: 'unavailable', events: [], fetchedAt: null, refreshAfterSeconds: 60 })
      setDelayed(false)
    }, remaining)
    return () => window.clearTimeout(timer)
  }, [delayed, setCurrentFeed])

  useEffect(() => {
    mountedRef.current = true
    const effectGeneration = ++effectGenerationRef.current
    queueMicrotask(() => {
      if (mountedRef.current && effectGenerationRef.current === effectGeneration && !initialFeed) {
        initialRefreshStartedAtRef.current = Date.now()
        void refresh()
      }
    })

    document.addEventListener('visibilitychange', refreshWhenVisible)
    window.addEventListener('focus', refreshWhenVisible)

    return () => {
      mountedRef.current = false
      effectGenerationRef.current += 1
      document.removeEventListener('visibilitychange', refreshWhenVisible)
      window.removeEventListener('focus', refreshWhenVisible)
      abortRef.current?.abort()
    }
  }, [initialFeed, refresh, refreshWhenVisible])

  useEffect(() => {
    const intervalMs = Math.max(1000, (feed?.refreshAfterSeconds || 60) * 1000)
    const interval = window.setInterval(refreshWhenVisible, intervalMs)
    return () => window.clearInterval(interval)
  }, [feed?.refreshAfterSeconds, refreshWhenVisible])

  const effectiveDelayed = initialFeed === undefined
    ? delayed
    : feedState.key === initialFeedKey
      ? delayed
      : false
  const value = useMemo(() => ({ feed, delayed: effectiveDelayed, refresh, seedFromServer, isRootProvider: true, seededServerFeedKey }), [effectiveDelayed, feed, refresh, seedFromServer, seededServerFeedKey])
  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
}

function RouteAppearanceProvider({
  initialFeed,
  children,
  parent,
}: AppearanceProviderProps & { parent: AppearanceContextValue }) {
  const initialFeedKey = getFeedKey(initialFeed)
  const seedFromServer = parent.seedFromServer

  useEffect(() => {
    if (initialFeed === undefined || initialFeed === null) return
    seedFromServer(initialFeed)
  }, [initialFeed, seedFromServer])

  const feed = initialFeed === undefined
    ? parent.feed
    : parent.seededServerFeedKey === initialFeedKey
      ? parent.feed ?? initialFeed ?? null
      : initialFeed ?? null
  const value = useMemo(() => ({ ...parent, feed }), [parent, feed])
  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
}

export const useAppearanceFeed = (): AppearanceContextValue => useContext(AppearanceContext)

// Keep the shorter names available to shell consumers and standalone fixtures.
export const AppearancesProvider = AppearanceProvider
export const useAppearances = useAppearanceFeed
