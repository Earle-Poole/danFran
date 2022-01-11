import Logo from '@/components/atoms/Logo/Logo'
import Navigation from '@/components/molecule/Navigation/Navigation'
import HamburgerNavigation from '@/components/molecule/Navigation/Navigation.Hamburger'
import classNames from 'classnames'
import { breakpoints } from 'lib/constants'
import { useMediaQuery, useOnClickOutside, useScrollPosition } from 'lib/hooks'
import { isClient } from 'lib/toolbox'
import { useEffect, useRef, useState } from 'react'

const Header = () => {
  const isMobile = useMediaQuery(breakpoints.sm)

  const [hamNavOpen, setHamNavOpen] = useState(false)
  const [layoutBody, setLayoutBody] = useState(
    isClient ? document.getElementById('layout-body') : null
  )
  const layoutBodyScrollPosition = useScrollPosition(
    isClient ? layoutBody : null
  )

  useEffect(() => {
    setLayoutBody(document.getElementById('layout-body'))
  }, [])

  useEffect(() => {
    if (hamNavOpen && !isMobile) {
      setHamNavOpen(false)
    }
  }, [hamNavOpen, isMobile])

  const headerRef = useRef<HTMLDivElement>(null!)

  useOnClickOutside(headerRef, () => {
    if (hamNavOpen) {
      setHamNavOpen(false)
    }
  })

  return (
    <div
      ref={headerRef}
      className={classNames(
        'flex absolute bg-black transition duration-300 z-20 text-shadow top-0 right-0 left-0 md:justify-between md:h-26 md:items-center',
        {
          ['bg-opacity-70']: layoutBodyScrollPosition > 0 || hamNavOpen,
          ['bg-opacity-0']: layoutBodyScrollPosition === 0 && !hamNavOpen,
        }
      )}
    >
      <Logo />
      {isMobile ? (
        <HamburgerNavigation
          hamNavOpen={hamNavOpen}
          setHamNavOpen={setHamNavOpen}
        />
      ) : (
        <Navigation />
      )}
    </div>
  )
}

export default Header
