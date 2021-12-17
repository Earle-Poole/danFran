import { breakpoints, slugs, urls } from 'lib/constants'

type URLsValue = typeof urls[keyof typeof urls]
type SlugsValue = typeof slugs[keyof typeof slugs]
type BreakPointValues = typeof breakpoints[keyof typeof breakpoints]
interface SlugsConst {
  VIDEO_GALLERY: '/video-gallery'
  PRESS_KIT: '/press-kit'
  MODELLING_GALLERY: '/modelling-gallery'
  HOME: '/home'
  ABOUT: '/#about'
  CONTACT: '/#contact'
}

export type { SlugsValue, BreakPointValues, URLsValue, SlugsConst }
