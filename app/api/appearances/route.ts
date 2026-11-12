import { getAppearanceFeed } from 'lib/calendar/server'
import type { AppearanceFeed } from 'lib/calendar/types'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

const methodNotAllowed = () =>
  Response.json({ error: 'method_not_allowed' }, {
    status: 405,
    headers: { ...noStore, Allow: 'GET' },
  })

export async function GET(): Promise<Response> {
  const feed: AppearanceFeed = await getAppearanceFeed()
  return Response.json(feed, {
    status: feed.status === 'unavailable' ? 503 : 200,
    headers: noStore,
  })
}

export const HEAD = methodNotAllowed
export const OPTIONS = methodNotAllowed
export const POST = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed
