import { BreakPointValues } from '@/components/atoms/NavItem'
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react'

// See
// https://www.netlify.com/blog/2020/12/05/building-a-custom-react-media-query-hook-for-more-responsive-apps/
export const useMediaQuery = (
  query: BreakPointValues,
  onChange?: (matches: boolean) => void
) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined') {
        return () => undefined
      }

      const media = window.matchMedia(query)
      const listener = () => {
        onStoreChange()
        onChange?.(media.matches)
      }

      if (media.addEventListener) {
        media.addEventListener('change', listener)
      } else {
        media.addListener(listener)
      }

      return () => {
        if (media.removeEventListener) {
          media.removeEventListener('change', listener)
        } else {
          media.removeListener(listener)
        }
      }
    },
    [onChange, query]
  )

  const getSnapshot = useCallback(
    () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches),
    [query]
  )

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

export const useScrollPosition = (element: HTMLElement | null | string) => {
  const [position, setPosition] = useState<number>(0)

  useEffect(() => {
    const scrollElement = typeof element === 'string'
      ? document.getElementById(element) ?? document.scrollingElement
      : element

    if (!scrollElement) {
      return
    }

    const handleScroll = () => setPosition(scrollElement.scrollTop)
    scrollElement.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => scrollElement.removeEventListener('scroll', handleScroll)
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

export const useElementSize = (element: HTMLElement | null) => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [elementSize, setElementSize] = useState<{
    width: number | undefined
    height: number | undefined
  }>({
    width: undefined,
    height: undefined,
  })
  useEffect(() => {
    if (!element) {
      return
    }
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setElementSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    // Add event listener
    element.addEventListener('resize', handleResize)
    // Call handler right away so state gets updated with initial element.current size
    handleResize()
    // Remove event listener on cleanup
    return () => element.removeEventListener('resize', handleResize)
  }, [element]) // Empty array ensures that effect is only run on mount
  return elementSize
}
