import { BreakPointValues } from '@/components/atoms/NavItem'
import { useEffect, useRef, useState } from 'react'

// See
// https://www.netlify.com/blog/2020/12/05/building-a-custom-react-media-query-hook-for-more-responsive-apps/
export const useMediaQuery = (query: BreakPointValues) => {
  const [isMatch, setIsMatch] = useState(false)

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

export const useScrollPosition = (element: HTMLElement | null) => {
  const [position, setPosition] = useState<number>(0)
  const elem = useRef<HTMLElement>(element)

  const onScroll = (e: HTMLElement) => () => {
    setPosition(e.scrollTop)
  }

  useEffect(() => {
    const elemRef = elem.current
    if (elemRef) {
      elemRef.addEventListener('scroll', onScroll(elemRef))

      return () => {
        elemRef.removeEventListener('scroll', onScroll(elemRef))
      }
    }
  }, [])

  return position
}
