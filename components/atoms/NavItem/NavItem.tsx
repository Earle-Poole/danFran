import { classNameByBreakpoint } from 'lib/toolbox'
import Link from 'next/link'
import { FC } from 'react'
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

  const itemClassName = classNameByBreakpoint({
    sm: 'font-light p-3 self-center transition duration-150',
    manual: 'hover:underline',
  })
  const anchorClassName = classNameByBreakpoint({
    sm: 'flex',
    manual: 'odd:hover:text-pink-500 even:hover:text-cyan-400',
  })

  return (
    <Link href={href} passHref>
      <a className={anchorClassName} {...optionalAnchorProps}>
        <div className={itemClassName}>{name}</div>
      </a>
    </Link>
  )
}

export default NavItem
