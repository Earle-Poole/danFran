import NavItem from '@/components/atoms/NavItem'
import { navList } from 'lib/constants'
import { classNameByBreakpoint } from 'lib/toolbox'

const Navigation = () => {
  const className = classNameByBreakpoint({
    sm: 'flex justify-items-center mx-auto items-stretch flex-col text-md',
    md: 'flex-row justify-end flex-wrap w-full text-lg',
    lg: 'text-xl ',
  })

  return (
    <nav className={className}>
      {navList.map((navItem) => {
        return <NavItem key={navItem.href} {...navItem} />
      })}
    </nav>
  )
}

export default Navigation
