import { URLsValue } from '@/components/atoms/NavItem'
import { classNameByBreakpoint } from 'lib/toolbox'
import Link from 'next/link'
import { FC } from 'react'

type MyButtonProps = {
  name: string
  href: URLsValue
}

const MyButton: FC<MyButtonProps> = ({ name, href }) => {
  const onClickHandler = () => {
    window.open(href)
  }

  const className = classNameByBreakpoint({
    sm: 'flex text-2xl bg-cyan-400 transition duration-150 w-fit font-light p-3 self-center',
    manual: 'hover:bg-pink-500 hover:underline',
  })

  return (
    <Link href={href} passHref>
      <a className={className} onClick={onClickHandler}>
        {name}
      </a>
    </Link>
  )
}

export default MyButton
