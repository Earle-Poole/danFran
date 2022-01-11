import { BreakPointValues } from '@/components/atoms/NavItem'
import { MutableRefObject, useEffect, useState } from 'react'

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

  const onScroll = (e: HTMLElement) => () => {
    setPosition(e.scrollTop)
  }

  useEffect(() => {
    if (element) {
      element.addEventListener('scroll', onScroll(element))

      return () => {
        element.removeEventListener('scroll', onScroll(element))
      }
    }
  }, [element])

  return position
}

export const useOnClickOutside = (
  ref: MutableRefObject<HTMLElement>,
  handler: (arg0: MouseEvent | TouchEvent) => void
) => {
  useEffect(
    () => {
      const listener = (event: MouseEvent | TouchEvent) => {
        // Do nothing if clicking ref's element or descendent elements
        if (
          !ref.current ||
          (event.target && ref.current.contains(event.target as Node))
        ) {
          return
        }
        handler(event)
      }
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)
      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  )
}
