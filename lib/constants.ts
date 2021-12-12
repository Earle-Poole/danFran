interface SlugsConst {
  VIDEO_GALLERY: '/video-gallery'
  PRESS_KIT: '/press-kit'
  MODELLING_GALLERY: '/modelling-gallery'
  HOME: '/home'
  ABOUT: '/#about'
  CONTACT: '/#contact'
}

type SlugsValue = typeof slugs[keyof typeof slugs]

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

type URLsValue = typeof urls[keyof typeof urls]
const urls = {
  STORE: 'https://whatsupdanny.creator-spring.com/',
  CALENDAR:
    'https://calendar.google.com/calendar/u/0/embed?src=e3r32cmfjlotisaphdbua6t3lo@group.calendar.google.com&showTitle=1&showPrint=0&showTz=0&height=720&wkst=1&bgcolor=%23FFFFFF&color=%23853104&ctz=America/Chicago',
} as const

const breakpoints = {
  sm: '(max-width: 767px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
} as const

type BreakPointValues = typeof breakpoints[keyof typeof breakpoints]

export type { SlugsValue, BreakPointValues, URLsValue }
export { slugs, urls, breakpoints, slugToLabel }
