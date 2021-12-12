import { SlugsValue, URLsValue } from 'lib/constants'
import Link from 'next/link'
import { FC } from 'react'

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
        className='flex odd:hover:text-pink-500 even:hover:text-cyan-400'
        {...optionalAnchorProps}>
        <div className='text-2xl font-light p-3 self-center transition duration-150 hover:underline'>
          {name}
        </div>
      </a>
    </Link>
  )
}

export default NavItem
