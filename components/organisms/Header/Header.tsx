import Image from 'next/image'
import logo from '@/public/assets/logo.png'
import Link from 'next/link'
import { slugs, urls } from 'lib/constants'
import Logo from '@/components/atoms/Logo/Logo'

const Header = () => {
  return (
    <div className='bg-opacity-50 bg-gray-800'>
      <Logo />
      <Link href={slugs.HOME}>{slugs.toLabel(slugs.HOME)}</Link>
      <Link href={'/#about'}>About</Link>
      <Link href={slugs.PRESS_KIT}>{slugs.toLabel(slugs.PRESS_KIT)}</Link>
      <Link href={slugs.MODELLING_GALLERY}>
        {slugs.toLabel(slugs.MODELLING_GALLERY)}
      </Link>
      <Link href={slugs.VIDEO_GALLERY}>
        {slugs.toLabel(slugs.VIDEO_GALLERY)}
      </Link>
      <a target='_blank' rel='noopener noreferrer' href={urls.CALENDAR}>
        Calendar
      </a>
      <a target='_blank' rel='noopener noreferrer' href={urls.STORE}>
        Store
      </a>
      <Link href={'#contact'}>Book Me Now!</Link>
    </div>
  )
}

export default Header
