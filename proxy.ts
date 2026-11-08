import { NextResponse, type NextRequest } from 'next/server'
import { findAppearanceEventById } from 'lib/calendar/event-links'
import { getAppearanceFeed } from 'lib/calendar/server'

const PUBLIC_EVENT_ID = /^[a-f0-9]{24}$/
const SYNCHRONOUS_NOT_FOUND_PATH = '/__calendar-not-found__'

const unavailableHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Event updates temporarily unavailable | Daniel Franzese</title>
    <style>
      @font-face {
        font-family: Inter;
        src: url('/fonts/optimized/InterVariable.subset.woff2') format('woff2');
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
      }
      @font-face {
        font-family: Anton;
        src: url('/fonts/optimized/Anton-Regular.subset.woff2') format('woff2');
        font-style: normal;
        font-weight: 400;
        font-display: swap;
      }
      * { box-sizing: border-box; }
      body {
        min-height: 100vh;
        margin: 0;
        background: #f6f1e8;
        color: #181818;
        font: 1.125rem/1.6 Inter, system-ui, sans-serif;
      }
      header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem clamp(1rem, 4vw, 3rem);
        border-bottom: 1px solid #cfc7bb;
      }
      header a { color: inherit; font-weight: 700; text-decoration-thickness: 2px; text-underline-offset: 0.2em; }
      nav { display: flex; flex-wrap: wrap; gap: 1rem; }
      main { width: min(100% - 2rem, 48rem); margin: clamp(4rem, 12vh, 8rem) auto; }
      .eyebrow { margin: 0 0 1rem; color: #a91d55; font-size: 0.875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
      h1 { margin: 0; font: 400 clamp(3rem, 7vw + 1rem, 6.5rem)/1.08 Anton, Impact, sans-serif; text-transform: uppercase; overflow-wrap: anywhere; }
      .message { margin: 1.5rem 0; font-size: clamp(1.125rem, 0.5vw + 1rem, 1.25rem); }
      .actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
      .actions a { display: inline-flex; min-height: 3rem; align-items: center; padding: 0.5rem 1rem; border: 2px solid #181818; border-radius: 0.25rem; color: #181818; font-size: 1rem; font-weight: 600; text-decoration: none; }
      .actions a:first-child { background: #181818; color: #fff; }
      a:focus-visible { outline: 3px solid #181818; outline-offset: 3px; }
    </style>
  </head>
  <body>
    <header>
      <a href="/">Daniel Franzese</a>
      <nav aria-label="Main navigation">
        <a href="/">Home</a>
        <a href="/calendar">Schedule</a>
        <a href="/booking">Booking</a>
      </nav>
    </header>
    <main aria-labelledby="schedule-unavailable-title">
      <p class="eyebrow">Daniel Franzese / Appearances</p>
      <h1 id="schedule-unavailable-title">Event updates are temporarily unavailable</h1>
      <p class="message">Please check back soon. You can visit the home page, try the schedule again, or contact the booking team for a professional appearance inquiry.</p>
      <div class="actions" aria-label="Recovery links">
        <a href="/">Home</a>
        <a href="/calendar">Schedule</a>
        <a href="/booking">Booking</a>
      </div>
    </main>
  </body>
</html>`

const rewriteToNotFound = (request: NextRequest) => {
  const destination = new URL(SYNCHRONOUS_NOT_FOUND_PATH, request.url)
  destination.search = request.nextUrl.search
  return NextResponse.rewrite(destination)
}

const unavailableResponse = (request: NextRequest) => new Response(
  request.method === 'HEAD' ? null : unavailableHtml,
  {
    status: 503,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
      'retry-after': '60',
    },
  },
)

export async function proxy(request: NextRequest) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return NextResponse.next()
  }

  const path = request.nextUrl.pathname
  if (path === '/calendar') {
    const feed = await getAppearanceFeed()
    if (feed.status === 'unavailable') return unavailableResponse(request)
    if (feed.status !== 'ready' || feed.events.length === 0) return rewriteToNotFound(request)
    return NextResponse.next()
  }

  const eventId = path.slice('/calendar/'.length)
  if (!eventId || eventId.includes('/') || !PUBLIC_EVENT_ID.test(eventId)) {
    return rewriteToNotFound(request)
  }

  const feed = await getAppearanceFeed()
  if (feed.status === 'unavailable') return unavailableResponse(request)
  if (feed.status !== 'ready' || !findAppearanceEventById(feed.events, eventId)) {
    return rewriteToNotFound(request)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/calendar', '/calendar/:path*'],
}
