import NavItem from '@/components/atoms/NavItem/NavItem'
import { slugs, slugToLabel, urls } from 'lib/constants'
import Link from 'next/link'

const Navigation = () => {
  return (
    <nav className='flex justify-items-center mx-auto items-stretch flex-col text-md  md:flex-row md:justify-end md:flex-wrap md:w-full lg:text-xl md:text-lg' >
      <NavItem href={slugs.HOME} name={slugToLabel(slugs.HOME)} />
      <NavItem href={slugs.ABOUT} name={'About'} />
      <NavItem href={slugs.PRESS_KIT} name={slugToLabel(slugs.PRESS_KIT)} />
      <NavItem
        href={slugs.MODELLING_GALLERY}
        name={slugToLabel(slugs.MODELLING_GALLERY)}
      />
      <NavItem
        href={slugs.VIDEO_GALLERY}
        name={slugToLabel(slugs.VIDEO_GALLERY)}
      />
      <NavItem href={urls.CALENDAR} name={'Calender'} isExternal />
      <NavItem href={urls.STORE} name={'Store'} isExternal />
      <NavItem href={slugs.CONTACT} name={'Book Me Now!'} />
    </nav>
  )
}

export default Navigation
