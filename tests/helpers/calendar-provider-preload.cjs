// QA-only server-process interceptor. The synthetic service-account assertion
// is still produced by the app, but provider reads never leave the local process.
const originalFetch = globalThis.fetch
const scenario = process.env.CALENDAR_QA_SCENARIO
const fixture = require('../fixtures/calendar-google.json')

if (!['ready', 'empty', 'unavailable'].includes(scenario)) {
  throw new Error('CALENDAR_QA_SCENARIO must be a supported test fixture mode')
}

globalThis.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  const method = init?.method ?? (typeof input === 'object' && 'method' in input ? input.method : 'GET')

  if (url === 'https://oauth2.googleapis.com/token' && method === 'POST') {
    return new Response(JSON.stringify({ access_token: 'qa-synthetic-access-token', expires_in: 3600 }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  if (url.startsWith('https://www.googleapis.com/calendar/v3/calendars/')) {
    if (scenario === 'unavailable') {
      return new Response(JSON.stringify({ error: { message: 'Synthetic provider failure' } }), {
        status: 503,
        headers: { 'content-type': 'application/json' },
      })
    }
    const body = scenario === 'empty' ? { timeZone: fixture.timeZone, items: [] } : fixture
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  // Keep all server-side fixture runs offline apart from the two synthetic
  // Google endpoints above. Internal local requests still use native fetch.
  const hostname = new URL(url).hostname
  if (hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '::1') {
    return originalFetch(input, init)
  }
  return new Response(JSON.stringify({ error: 'qa_external_fetch_blocked' }), {
    status: 503,
    headers: { 'content-type': 'application/json' },
  })
}
