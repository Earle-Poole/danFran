import { FC, useEffect, useRef } from 'react'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'

const CommonLayout: FC = ({ children }) => {
  return (
    <div className='flex h-screen w-screen bg-black text-white overflow-hidden'>
      <div className='mx-auto w-full max-w-7xl relative'>
        <Header />
        <div id='layout-body' className='overflow-y-auto overflow-x-visible h-screen z-10'>
          {children}
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default CommonLayout
