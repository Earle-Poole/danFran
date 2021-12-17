import {
  SlugsConst,
  SlugsValue,
} from '@/components/atoms/NavItem/NavItem.types'

const slugs: SlugsConst = {
  VIDEO_GALLERY: '/video-gallery',
  PRESS_KIT: '/press-kit',
  MODELLING_GALLERY: '/modelling-gallery',
  HOME: '/home',
  ABOUT: '/#about',
  CONTACT: '/#contact',
} as const

const slugToLabel = (slug: SlugsValue) => {
  switch (slug) {
    case slugs.VIDEO_GALLERY:
      return 'Video Gallery'
    case slugs.PRESS_KIT:
      return 'Press Kit'
    case slugs.MODELLING_GALLERY:
      return 'Modelling Gallery'
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

const breakpoints = {
  sm: '(max-width: 767px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
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
    href: slugs.MODELLING_GALLERY,
    isExternal: false,
    name: slugToLabel(slugs.MODELLING_GALLERY),
  },
  {
    href: slugs.VIDEO_GALLERY,
    isExternal: false,
    name: slugToLabel(slugs.VIDEO_GALLERY),
  },
  {
    href: urls.CALENDAR,
    isExternal: true,
    name: 'Calendar',
  },
  {
    href: urls.STORE,
    isExternal: true,
    name: 'Store',
  },
  {
    href: slugs.CONTACT,
    isExternal: false,
    name: 'Book Me Now!',
  },
]

export { slugs, urls, breakpoints, slugToLabel, navList }
