import type { RouteRecord, RouteId } from './types'

const preservedHomeFragments = ['#home', '#about', '#cameo', '#contact'] as const

export const routes = [
  {
    id: 'home',
    path: '/',
    label: 'Home',
    title: 'Daniel Franzese | Actor, Comedian & Activist',
    description: 'Explore Daniel Franzese’s work, videos, press materials, and booking information.',
    canonicalPath: '/',
    indexable: true,
    availability: 'available',
    verification: 'source-confirmed',
    preservedFragments: preservedHomeFragments,
  },
  {
    id: 'legacy-home',
    path: '/home',
    label: 'Home',
    title: 'Daniel Franzese | Actor, Comedian & Activist',
    description: 'The legacy home route for Daniel Franzese, with preserved home fragment destinations.',
    canonicalPath: '/',
    indexable: false,
    availability: 'available',
    verification: 'source-confirmed',
    preservedFragments: preservedHomeFragments,
  },
  {
    id: 'about',
    path: '/about',
    label: 'About',
    title: 'About | Daniel Franzese',
    description: 'Biography, selected screen work, and advocacy for Daniel Franzese.',
    canonicalPath: '/about',
    indexable: true,
    availability: 'available',
    verification: 'source-confirmed',
  },
  {
    id: 'press-kit',
    path: '/press-kit',
    label: 'Press Kit',
    title: 'Press Kit | Daniel Franzese',
    description: 'Downloadable press materials, photos, biography, and booking contact information.',
    canonicalPath: '/press-kit',
    indexable: true,
    availability: 'available',
    verification: 'source-confirmed',
  },
  {
    id: 'portraits',
    path: '/modeling-gallery',
    label: 'Portraits',
    title: 'Portraits | Daniel Franzese',
    description: 'A collection of original portraits and editorial photography of Daniel Franzese.',
    canonicalPath: '/modeling-gallery',
    indexable: true,
    availability: 'available',
    verification: 'source-confirmed',
  },
  {
    id: 'videos',
    path: '/video-gallery',
    label: 'Videos',
    title: 'Videos | Daniel Franzese',
    description: 'Comedy, conversations, and press videos featuring Daniel Franzese.',
    canonicalPath: '/video-gallery',
    indexable: true,
    availability: 'available',
    verification: 'source-confirmed',
  },
  {
    id: 'booking',
    path: '/booking',
    label: 'Book Daniel',
    title: 'Booking | Daniel Franzese',
    description: 'Contact information for professional appearances, speaking engagements, and press inquiries.',
    canonicalPath: '/booking',
    indexable: true,
    availability: 'available',
    verification: 'source-confirmed',
  },
  {
    id: 'calendar',
    path: '/calendar',
    label: 'Appearances',
    title: 'Appearances | Daniel Franzese',
    description: 'Upcoming appearances, comedy dates, and speaking engagements for Daniel Franzese.',
    canonicalPath: '/calendar',
    indexable: false,
    availability: 'available',
    verification: 'source-confirmed',
  },
  {
    id: 'not-found',
    path: '/404',
    label: 'Page not found',
    title: 'Page Not Found | Daniel Franzese',
    description: 'Find your way back to Daniel Franzese’s work, press materials, or booking information.',
    canonicalPath: '/404',
    indexable: false,
    availability: 'available',
    verification: 'source-confirmed',
  },
] as const satisfies readonly RouteRecord[]

export const routeById = (id: RouteId): RouteRecord | undefined =>
  routes.find((route) => route.id === id)

export const routeByPath = (path: string): RouteRecord | undefined =>
  routes.find((route) => route.path === path)

export const selectImplementedRoutes = (): readonly RouteRecord[] =>
  routes.filter((route) => route.availability === 'available')

export const selectIndexableRoutes = (
  records: readonly RouteRecord[] = routes
): readonly RouteRecord[] =>
  records.filter((route) => route.availability === 'available' && route.indexable)

export const selectPlannedRoutes = (
  records: readonly RouteRecord[] = routes
): readonly RouteRecord[] =>
  records.filter((route) => route.availability === 'planned')
