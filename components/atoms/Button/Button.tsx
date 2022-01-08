import { URLsValue } from '@/components/atoms/NavItem'
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

  return (
    <Link href={href} passHref>
      <a
        className="flex text-2xl hover:bg-pink-500 bg-cyan-400 transition duration-150 w-fit font-light p-3 self-center  text-shadow-xs"
        onClick={onClickHandler}
      >
        {name}
      </a>
    </Link>
  )
}

export default MyButton
