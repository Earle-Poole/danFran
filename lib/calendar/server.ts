import 'server-only'

import { createHash, createSign } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { normalizeGoogleEvents, type GoogleCalendarEvent } from './normalize'
import type { AppearanceEvent, AppearanceFeed } from './types'

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const CALENDAR_ENDPOINT = 'https://www.googleapis.com/calendar/v3/calendars'
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events.readonly'
const DEFAULT_REFRESH_SECONDS = 60
const DEFAULT_LOOKAHEAD_DAYS = 365
const REQUEST_TIMEOUT_MS = 10_000
const SOURCE_TIMEOUT_MS = 30_000
const MAX_PAGES = 20
const MAX_EVENTS = 10_000

type ServiceAccountCredentials = {
  client_email: string
  private_key: string
}

type CalendarConfig = {
  calendarId: string
  refreshAfterSeconds: number
  lookaheadDays: number
  credentialSource: { kind: 'json'; value: string } | { kind: 'file'; path: string }
  cacheKey: string
}

type CachedFeed = {
  feed: AppearanceFeed
  expiresAt: number
}

type CachedToken = {
  accessToken: string
  expiresAt: number
}

class CalendarUnavailableError extends Error {
  constructor() {
    super('Calendar source unavailable')
    this.name = 'CalendarUnavailableError'
  }
}

const feedFor = (status: AppearanceFeed['status'], refreshAfterSeconds: number): AppearanceFeed => ({
  status,
  events: [],
  fetchedAt: null,
  refreshAfterSeconds,
})

const boundedNumber = (value: string | undefined, fallback: number, min: number, max: number): number => {
  if (!value?.trim()) return fallback
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback
}

const sourceFingerprint = (source: CalendarConfig['credentialSource']): string =>
  createHash('sha256')
    .update(source.kind === 'file' ? `file:${source.path}` : `json:${source.value}`)
    .digest('hex')
    .slice(0, 16)

const readConfig = (): CalendarConfig | { status: 'unconfigured'; refreshAfterSeconds: number } | null => {
  const refreshAfterSeconds = boundedNumber(
    process.env.GOOGLE_CALENDAR_REFRESH_SECONDS,
    DEFAULT_REFRESH_SECONDS,
    1,
    3600,
  )
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim()
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()
  const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()

  if (!calendarId || (!json && !credentialPath)) {
    return { status: 'unconfigured', refreshAfterSeconds }
  }

  const credentialSource = json
    ? { kind: 'json' as const, value: json }
    : credentialPath && path.isAbsolute(credentialPath)
      ? { kind: 'file' as const, path: credentialPath }
      : null
  if (!credentialSource) return null

  const lookaheadDays = boundedNumber(
    process.env.GOOGLE_CALENDAR_LOOKAHEAD_DAYS,
    DEFAULT_LOOKAHEAD_DAYS,
    1,
    730,
  )
  const cacheKey = [calendarId, refreshAfterSeconds, lookaheadDays, sourceFingerprint(credentialSource)].join('|')
  return { calendarId, refreshAfterSeconds, lookaheadDays, credentialSource, cacheKey }
}

const parseCredentials = (raw: string): ServiceAccountCredentials => {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new CalendarUnavailableError()
  }
  if (!parsed || typeof parsed !== 'object') throw new CalendarUnavailableError()
  const candidate = parsed as Record<string, unknown>
  if (
    candidate.type !== 'service_account' ||
    typeof candidate.client_email !== 'string' ||
    !candidate.client_email.includes('@') ||
    typeof candidate.private_key !== 'string' ||
    !candidate.private_key.includes('BEGIN PRIVATE KEY')
  ) {
    throw new CalendarUnavailableError()
  }
  return {
    client_email: candidate.client_email,
    private_key: candidate.private_key.replace(/\\n/g, '\n'),
  }
}

const loadCredentials = async (config: CalendarConfig): Promise<ServiceAccountCredentials> => {
  const raw = config.credentialSource.kind === 'json'
    ? config.credentialSource.value
    : await readFile(config.credentialSource.path, 'utf8').catch(() => {
        throw new CalendarUnavailableError()
      })
  return parseCredentials(raw)
}

const base64Url = (value: string | Buffer): string =>
  Buffer.from(value).toString('base64url')

const createServiceAssertion = (credentials: ServiceAccountCredentials, nowSeconds: number): string => {
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64Url(JSON.stringify({
    iss: credentials.client_email,
    scope: CALENDAR_SCOPE,
    aud: TOKEN_ENDPOINT,
    iat: nowSeconds,
    exp: nowSeconds + 3600,
  }))
  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${payload}`)
  signer.end()
  return `${header}.${payload}.${base64Url(signer.sign(credentials.private_key))}`
}

const fetchJsonWithTimeout = async (input: string, init: RequestInit, deadline = Date.now() + REQUEST_TIMEOUT_MS): Promise<unknown> => {
  const remaining = Math.min(REQUEST_TIMEOUT_MS, deadline - Date.now())
  if (remaining <= 0) throw new CalendarUnavailableError()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), remaining)
  try {
    const response = await fetch(input, { ...init, signal: controller.signal })
    if (!response.ok) throw new CalendarUnavailableError()
    try {
      return await response.json()
    } catch {
      throw new CalendarUnavailableError()
    }
  } catch {
    throw new CalendarUnavailableError()
  } finally {
    clearTimeout(timeout)
  }
}

const tokenCache = new Map<string, CachedToken>()

const getAccessToken = async (credentials: ServiceAccountCredentials, deadline: number): Promise<string> => {
  const key = createHash('sha256').update(`${credentials.client_email}\n${credentials.private_key}`).digest('hex')
  const existing = tokenCache.get(key)
  const now = Date.now()
  if (existing && existing.expiresAt > now + 60_000) return existing.accessToken

  const assertion = createServiceAssertion(credentials, Math.floor(now / 1000))
  const payload = await fetchJsonWithTimeout(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }).toString(),
  }, deadline)
  if (!payload || typeof payload !== 'object') throw new CalendarUnavailableError()
  const candidate = payload as Record<string, unknown>
  if (typeof candidate.access_token !== 'string' || !candidate.access_token) throw new CalendarUnavailableError()
  const expiresIn = typeof candidate.expires_in === 'number' && Number.isFinite(candidate.expires_in)
    ? candidate.expires_in
    : 3600
  tokenCache.set(key, { accessToken: candidate.access_token, expiresAt: now + Math.max(60, expiresIn) * 1000 })
  return candidate.access_token
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value))

const fetchGoogleEvents = async (
  config: CalendarConfig,
  credentials: ServiceAccountCredentials,
  now: number,
): Promise<{ events: GoogleCalendarEvent[]; calendarTimeZone?: string }> => {
  const deadline = Date.now() + SOURCE_TIMEOUT_MS
  const accessToken = await getAccessToken(credentials, deadline)
  const events: GoogleCalendarEvent[] = []
  let pageToken: string | undefined
  let calendarTimeZone: string | undefined
  const timeMin = new Date(now).toISOString()
  const timeMax = new Date(now + config.lookaheadDays * 86_400_000).toISOString()

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const query = new URLSearchParams({
      singleEvents: 'true',
      orderBy: 'startTime',
      showDeleted: 'true',
      maxResults: '2500',
      timeMin,
      timeMax,
    })
    if (pageToken) query.set('pageToken', pageToken)
    const endpoint = `${CALENDAR_ENDPOINT}/${encodeURIComponent(config.calendarId)}/events?${query.toString()}`
    const payload = await fetchJsonWithTimeout(endpoint, {
      headers: { authorization: `Bearer ${accessToken}`, accept: 'application/json' },
    }, deadline)
    if (!isRecord(payload) || !Array.isArray(payload.items)) throw new CalendarUnavailableError()
    if (payload.timeZone !== undefined) {
      if (typeof payload.timeZone !== 'string') throw new CalendarUnavailableError()
      calendarTimeZone = payload.timeZone
    }
    for (const item of payload.items) {
      if (isRecord(item)) events.push(item as GoogleCalendarEvent)
    }
    if (events.length > MAX_EVENTS) throw new CalendarUnavailableError()

    if (payload.nextPageToken === undefined || payload.nextPageToken === '') break
    if (typeof payload.nextPageToken !== 'string' || page >= MAX_PAGES - 1) throw new CalendarUnavailableError()
    if (payload.nextPageToken === pageToken) throw new CalendarUnavailableError()
    pageToken = payload.nextPageToken
  }

  return { events, calendarTimeZone }
}

const currentDate = (now: number, timeZone: string): string => {
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

const stillUpcoming = (event: AppearanceEvent, now: number): boolean =>
  event.allDay
    ? event.end > currentDate(now, event.timeZone)
    : Date.parse(event.end) > now

const cache = new Map<string, CachedFeed>()
const inFlight = new Map<string, Promise<AppearanceFeed>>()

const fetchAndNormalize = async (config: CalendarConfig): Promise<AppearanceFeed> => {
  try {
    const now = Date.now()
    const credentials = await loadCredentials(config)
    const source = await fetchGoogleEvents(config, credentials, now)
    const events = normalizeGoogleEvents(source.events, {
      calendarTimeZone: source.calendarTimeZone,
      now,
    })
    return {
      status: 'ready',
      events,
      fetchedAt: new Date().toISOString(),
      refreshAfterSeconds: config.refreshAfterSeconds,
    }
  } catch {
    return feedFor('unavailable', config.refreshAfterSeconds)
  }
}

/** Read and normalize the private editorial calendar without exposing source details. */
export const getAppearanceFeed = async (): Promise<AppearanceFeed> => {
  const config = readConfig()
  if (!config) return feedFor('unavailable', DEFAULT_REFRESH_SECONDS)
  if ('status' in config) return feedFor('unconfigured', config.refreshAfterSeconds)

  const now = Date.now()
  const cached = cache.get(config.cacheKey)
  if (cached && cached.expiresAt > now) {
    return {
      ...cached.feed,
      events: cached.feed.events.filter((event) => stillUpcoming(event, now)),
    }
  }

  const current = inFlight.get(config.cacheKey)
  if (current) return current

  const request = fetchAndNormalize(config)
    .then((feed) => {
      cache.set(config.cacheKey, { feed, expiresAt: Date.now() + config.refreshAfterSeconds * 1000 })
      return feed
    })
    .finally(() => {
      inFlight.delete(config.cacheKey)
    })
  inFlight.set(config.cacheKey, request)
  return request
}

/** Test-only reset hook; it has no effect on production behavior. */
export const __resetCalendarCachesForTests = (): void => {
  cache.clear()
  inFlight.clear()
  tokenCache.clear()
}
