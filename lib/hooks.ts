import { useEffect, useState } from 'react'
import { BreakPointValues } from './constants'

// See
// https://www.netlify.com/blog/2020/12/05/building-a-custom-react-media-query-hook-for-more-responsive-apps/
export const useMediaQuery = (query: BreakPointValues) => {
  const [isMatch, setIsMatch] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    if (media.matches !== isMatch) {
      setIsMatch(media.matches)
    }

    const listener = () => {
      setIsMatch(media.matches)
    }

    // TODO: older Safari versions don't support addEventListener
    // https://stackoverflow.com/questions/35719526/safari-ignore-window-matchmedia
    if (media.addEventListener) {
      media.addEventListener('change', listener)
    } else if (media.addListener) {
      // @ts-ignore
      media.addListener(listener)
    }

    return () => media.removeEventListener?.('change', listener)
  }, [isMatch, query])

  return isMatch
}
