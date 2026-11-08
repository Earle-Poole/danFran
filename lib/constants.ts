import {
  SlugsConst,
  SlugsValue,
} from '@/components/atoms/NavItem/NavItem.types'

const slugs: SlugsConst = {
  VIDEO_GALLERY: '/video-gallery',
  PRESS_KIT: '/press-kit',
  MODELING_GALLERY: '/modeling-gallery',
  HOME: '/home#home',
  ABOUT: '/home#about',
  CONTACT: '/home#contact',
} as const

const slugToLabel = (slug: SlugsValue) => {
  switch (slug) {
    case slugs.VIDEO_GALLERY:
      return 'Video Gallery'
    case slugs.PRESS_KIT:
      return 'Press Kit'
    case slugs.MODELING_GALLERY:
      return 'Modeling Gallery'
    case slugs.HOME:
      return 'Home'
    case slugs.ABOUT:
      return 'About'
    case slugs.CONTACT:
      return 'Contact'
    default:
      return ''
  }
}

const urls = {
  STORE: 'https://whatsupdanny.creator-spring.com/',
  CALENDAR:
    'https://calendar.google.com/calendar/u/0/embed?src=e3r32cmfjlotisaphdbua6t3lo@group.calendar.google.com&showTitle=1&showPrint=0&showTz=0&height=720&wkst=1&bgcolor=%23FFFFFF&color=%23853104&ctz=America/Chicago',
  MAILCHIMP:
    'https://udsterleads.us10.list-manage.com/subscribe/post?u=c97ea1160f134dbeb8cbe8bd6&id=66c6445cca',
  CAMEO: 'https://www.cameo.com/whatsupdanny',
} as const

export const shopEnabled = false

const breakpoints = {
  sm: '(max-width: 767px)',
  md: '(min-width: 768px)',
  upToLg: '(max-width: 1023px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1200px)',
} as const

const navList = [
  {
    href: slugs.HOME,
    isExternal: false,
    name: slugToLabel(slugs.HOME),
  },
  {
    href: slugs.ABOUT,
    isExternal: false,
    name: 'About',
  },
  {
    href: slugs.PRESS_KIT,
    isExternal: false,
    name: slugToLabel(slugs.PRESS_KIT),
  },
  {
    href: slugs.MODELING_GALLERY,
    isExternal: false,
    name: slugToLabel(slugs.MODELING_GALLERY),
  },
  {
    href: slugs.VIDEO_GALLERY,
    isExternal: false,
    name: slugToLabel(slugs.VIDEO_GALLERY),
  },
  ...(shopEnabled ? [{
    href: urls.STORE,
    isExternal: true,
    name: 'Store',
  }] : []),
  {
    href: slugs.CONTACT,
    isExternal: false,
    name: 'Book Me Now!',
  },
]

export {
  routes as contentRoutes,
  routeById,
  routeByPath,
  selectImplementedRoutes,
  selectIndexableRoutes,
  selectPlannedRoutes,
} from './content/routes'
export { contacts, contactById, socialLinks } from './content/contacts'
export {
  downloads,
  downloadById,
  mediaAssetInventory,
} from './content/downloads'
export {
  photos,
  photoById,
  selectPhotosByCollection,
  selectedPhotos,
  modelingPhotos,
  pressPhotos,
} from './content/photos'
export { videos, videoById, selectVideosByCategory } from './content/videos'
export type {
  ContactRecord,
  DownloadRecord,
  PhotoRecord,
  RouteRecord,
  VideoRecord,
} from './content/types'

export { slugs, urls, breakpoints, slugToLabel, navList }
