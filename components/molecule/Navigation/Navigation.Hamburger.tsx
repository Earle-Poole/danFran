import Menu from '@/components/atoms/Icons/Menu'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import Navigation from './Navigation'

interface HamburgerNavigationProps {
  hamNavOpen: boolean
  setHamNavOpen: Dispatch<SetStateAction<boolean>>
}

const HamburgerNavigation: FC<HamburgerNavigationProps> = ({
  hamNavOpen,
  setHamNavOpen,
}) => {
  const handleToggle = () => {
    setHamNavOpen((prev) => !prev)
  }

  return (
    <>
      <button className="absolute top-10 right-4" onClick={handleToggle}>
        <Menu isOpen={hamNavOpen} />
      </button>
      {hamNavOpen ? <Navigation /> : ''}
    </>
  )
}

export default HamburgerNavigation
