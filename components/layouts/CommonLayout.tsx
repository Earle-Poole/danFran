import { FC } from 'react'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'

const CommonLayout: FC = ({ children }) => {
  return (
    <div className='flex h-screen w-screen bg-black text-white'>
      <div className='mx-auto w-full max-w-7xl'>
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  )
}

export default CommonLayout
