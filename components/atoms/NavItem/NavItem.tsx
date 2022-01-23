import Link from 'next/link'
import { FC } from 'react'
import Splitter from '../Splitter/Splitter'
import { SlugsValue, URLsValue } from './'

type NavItemProps = {
  name: string
  isExternal?: boolean
  href: SlugsValue | URLsValue
}

const NavItem: FC<NavItemProps> = ({ isExternal, name, href }) => {
  const optionalAnchorProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Link href={href} passHref>
      <a
        className="flex odd:hover:text-pink-500 even:hover:text-cyan-400"
        {...optionalAnchorProps}
      >
        <div className="font-light p-3 self-center transition duration-150">
          <Splitter str={name} hoverAnimation />
        </div>
      </a>
    </Link>
  )
}

export default NavItem
