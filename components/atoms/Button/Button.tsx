import { URLsValue } from '@/components/atoms/NavItem'
import Link from 'next/link'
import { FC } from 'react'

type MyButtonProps = {
  name: string
  href: URLsValue
  isExternal?: boolean
}

const MyButton: FC<MyButtonProps> = ({ isExternal, name, href }) => {
  const optionalAnchorProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <Link href={href} passHref>
      <a
        className="flex text-2xl hover:bg-pink-500 bg-cyan-400 transition duration-150 w-fit font-light p-3 self-center text-shadow-xs"
        {...optionalAnchorProps}
      >
        {name}
      </a>
    </Link>
  )
}

export default MyButton
