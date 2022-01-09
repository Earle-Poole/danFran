import NavItem from '@/components/atoms/NavItem'
import { navList } from 'lib/constants'

const Navigation = () => {
  return (
    <nav className="flex justify-items-center items-stretch flex-col text-md md:flex-row md:justify-end md:flex-wrap md:w-full lg:text-xl md:text-lg md:bg-transparent">
      {navList.map((navItem) => {
        return <NavItem key={navItem.href} {...navItem} />
      })}
    </nav>
  )
}

export default Navigation
