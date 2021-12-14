import Logo from '@/components/atoms/Logo/Logo'
import Navigation from '@/components/molecule/Navigation/Navigation'
import HamburgerNavigation from '@/components/molecule/Navigation/Navigation.Hamburger'
import classNames from 'classnames'
import { breakpoints } from 'lib/constants'
import { useMediaQuery, useScrollPosition } from 'lib/hooks'
import { isClient } from 'lib/toolbox'

const Header = () => {
  const isMobile = useMediaQuery(breakpoints.sm)
  const layoutBodyScrollPosition = useScrollPosition(
    isClient ? document.getElementById('layout-body') : null
  )

  return (
    <div
      className={classNames(
        'bg-gray-800 flex text-shadow md:justify-between absolute top-0 right-0 left-0 p-4 md:h-26 transition duration-300 z-20',
        layoutBodyScrollPosition > 0 ? 'bg-opacity-70' : 'bg-opacity-0'
      )}>
      <Logo />
      {isMobile ? <HamburgerNavigation /> : <Navigation />}
    </div>
  )
}

export default Header
