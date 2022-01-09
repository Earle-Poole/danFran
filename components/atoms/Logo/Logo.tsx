import Image from 'next/image'
import logo from '@/assets/logo.png'
import { slugs } from 'lib/constants'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href={slugs.HOME} passHref>
      <a>
        <Image
          src={logo}
          height={96}
          width={96}
          layout="fixed"
          alt={'Daniel Franzese logo'}
        />
      </a>
    </Link>
  )
}

export default Logo
