import Link from 'next/link'
import { FC } from 'react'
import { URLsValue } from '../NavItem'

type MyButtonProps = {
  name: string
  href: URLsValue
}

const MyButton: FC<MyButtonProps> = ({ name, href }) => {
  const onClickHandler = () => {
    window.open(href)
  }
  return (
    <Link href={href} passHref>
      <a className='flex odd:hover:text-pink-500 even:hover:text-cyan-400'>
        <div
          onClick={onClickHandler}
          className='font-light p-3 self-center transition duration-150 hover:underline'>
          {name}
        </div>
      </a>
    </Link>
  )
}

export default MyButton
