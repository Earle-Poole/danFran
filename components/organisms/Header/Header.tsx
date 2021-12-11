import Logo from '@/components/atoms/Logo/Logo'
import Navigation from '@/components/molecule/Navigation/Navigation'

const Header = () => {
  return (
    <div className='bg-opacity-50 bg-gray-800 flex text-shadow'>
      <Logo />
      <Navigation />
    </div>
  )
}

export default Header
