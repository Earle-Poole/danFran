interface SlugsConst {
  VIDEO_GALLERY: '/video-gallery'
  PRESS_KIT: '/press-kit'
  MODELLING_GALLERY: '/modelling-gallery'
  HOME: '/home'
  toLabel(slug: SlugsValue): string
}

type SlugsValue = typeof slugs[keyof typeof slugs]

const slugs: SlugsConst = {
  VIDEO_GALLERY: '/video-gallery',
  PRESS_KIT: '/press-kit',
  MODELLING_GALLERY: '/modelling-gallery',
  HOME: '/home',
  toLabel: (slug: SlugsValue) => {
    switch (slug) {
      case slugs.VIDEO_GALLERY:
        return 'Video Gallery'
      case slugs.PRESS_KIT:
        return 'Press Kit'
      case slugs.MODELLING_GALLERY:
        return 'Modelling Gallery'
      case slugs.HOME:
        return 'Home'
      default:
        return ''
    }
  },
} as const

const urls = {
  STORE: 'https://whatsupdanny.creator-spring.com/',
  CALENDAR:
    'https://calendar.google.com/calendar/u/0/embed?src=e3r32cmfjlotisaphdbua6t3lo@group.calendar.google.com&showTitle=1&showPrint=0&showTz=0&height=720&wkst=1&bgcolor=%23FFFFFF&color=%23853104&ctz=America/Chicago',
} as const

export { slugs, urls }
