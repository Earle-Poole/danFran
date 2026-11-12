import { routeById, routeByPath } from '../content/routes'
import type { RouteId, RouteRecord } from '../content/types'

const pathFromInput = (input: string | null | undefined): string | null => {
  if (!input?.trim()) return null

  const value = input.trim()
  try {
    if (/^https?:\/\//i.test(value)) return new URL(value).pathname
  } catch {
    return null
  }

  const pathname = value.split(/[?#]/, 1)[0] || '/'
  if (!pathname.startsWith('/')) return null
  if (pathname === '/') return '/'
  return pathname.replace(/\/+$/, '') || '/'
}

/**
 * Maps either Next's pathname or its asPath to the shared DATA route IDs.
 * Query strings and fragments are deliberately ignored for canonical route
 * identity. Unknown paths resolve to the real not-found route ID.
 */
export const resolveSeoRouteId = (
  pathname: string | null | undefined,
  asPath: string | null | undefined,
): RouteId => {
  for (const candidate of [pathname, asPath]) {
    const path = pathFromInput(candidate)
    const route = path ? routeByPath(path) : undefined
    if (route) return route.id
  }
  return 'not-found'
}

export const resolveSeoRoute = (
  pathname: string | null | undefined,
  asPath: string | null | undefined,
): RouteRecord => routeById(resolveSeoRouteId(pathname, asPath)) ?? routeById('not-found')!

export const canonicalPathForRoute = (routeId: RouteId): `/${string}` =>
  routeById(routeId)?.canonicalPath ?? '/404'
