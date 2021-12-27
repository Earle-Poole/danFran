import Logo from '@/components/atoms/Logo/Logo'
import Navigation from '@/components/molecule/Navigation/Navigation'
import HamburgerNavigation from '@/components/molecule/Navigation/Navigation.Hamburger'
import { breakpoints } from 'lib/constants'
import { useMediaQuery, useScrollPosition } from 'lib/hooks'
import { classNameByBreakpoint, isClient } from 'lib/toolbox'

const Header = () => {
  const isMobile = useMediaQuery(breakpoints.sm)
  const layoutBodyScrollPosition = useScrollPosition(
    isClient ? document.getElementById('layout-body') : null
  )

  const className = classNameByBreakpoint({
    sm: `bg-black flex text-shadow absolute top-0 left-0 right-0 p-4 transition duration-300 z-20 bg-opacity-0 ${
      layoutBodyScrollPosition > 0 ? '!bg-opacity-70' : ''
    }`,
    md: 'items-center justify-between h-26',
  })

  return (
    <div className={className}>
      <Logo />
      {isMobile ? <HamburgerNavigation /> : <Navigation />}
    </div>
  )
}

export default Header
