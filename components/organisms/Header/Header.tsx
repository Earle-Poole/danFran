import Logo from '@/components/atoms/Logo/Logo'
import Navigation from '@/components/molecule/Navigation/Navigation'
import { breakpoints } from 'lib/constants'
import useMediaQuery from 'lib/hooks'

const Header = () => {
  const isMobile = useMediaQuery(breakpoints.sm)

  console.log('isMobile: ', isMobile)
  return (
    <div className='bg-opacity-50 bg-gray-800 flex text-shadow'>
      <Logo />
      <Navigation />
    </div>
  )
}

export default Header
