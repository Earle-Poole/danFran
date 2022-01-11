import Image from 'next/image'
import logo from '@/assets/logo.png'
import { breakpoints, slugs } from 'lib/constants'
import Link from 'next/link'
import { useMediaQuery } from 'lib/hooks'

const Logo = () => {
  const isMobile = useMediaQuery(breakpoints.sm)
  return (
    <Link href={slugs.HOME} passHref>
      <a className="h-full flex items-center px-4">
        <Image
          src={logo}
          height={isMobile ? 64 : 80}
          width={isMobile ? 64 : 80}
          layout="fixed"
          alt={'Daniel Franzese logo'}
        />
      </a>
    </Link>
  )
}

export default Logo
