import Logo from '@/components/atoms/Logo/Logo'
import Navigation from '@/components/molecule/Navigation/Navigation'
import HamburgerNavigation from '@/components/molecule/Navigation/Navigation.Hamburger'
import { breakpoints } from 'lib/constants'
import { useMediaQuery } from 'lib/hooks'
import { useEffect } from 'react'

const Header = () => {
  const isMobile = useMediaQuery(breakpoints.sm)

  useEffect(() => {
    console.log('isMobile: ', isMobile)
  }, [isMobile])
  return (
    <div className='bg-opacity-50 bg-gray-800 flex text-shadow'>
      <Logo />
      {isMobile ? <HamburgerNavigation /> : <Navigation />}
    </div>
  )
}

export default Header
