import { FC, useEffect, useRef } from 'react'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'

const CommonLayout: FC = ({ children }) => {
  return (
    <div className='flex h-screen w-screen bg-black text-white overflow-hidden'>
      <div className='flex mx-auto w-full relative justify-center'>
        <Header />
        <div
          id='layout-body'
          className='overflow-y-auto overflow-x-hidden h-screen z-10 w-screen'>
          {children}
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default CommonLayout
