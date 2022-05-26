import { breakpoints, slugs, urls } from 'lib/constants'

type URLsValue = typeof urls[keyof typeof urls]
type SlugsValue = typeof slugs[keyof typeof slugs]
type BreakPointValues = typeof breakpoints[keyof typeof breakpoints]
interface SlugsConst {
  VIDEO_GALLERY: '/video-gallery'
  PRESS_KIT: '/press-kit'
  MODELING_GALLERY: '/modeling-gallery'
  HOME: '/home#home'
  ABOUT: '/home#about'
  CONTACT: '/home#contact'
}

export type { SlugsValue, BreakPointValues, URLsValue, SlugsConst }
