import Image from "next/image";
import logo from '@/assets/logo.webp'
import { breakpoints, slugs } from 'lib/constants'
import Link from 'next/link'
import { useMediaQuery } from 'lib/hooks'

const Logo = () => {
  const isMobile = useMediaQuery(breakpoints.sm)
  return (
    <Link href={slugs.HOME} passHref className="h-full flex items-center px-4">

        <Image
          src={logo}
          height={isMobile ? 64 : 80}
          width={isMobile ? 64 : 80}
          alt={'Daniel Franzese logo'} />

      </Link>
  );
}

export default Logo
