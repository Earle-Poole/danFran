import { FC } from 'react'
import Footer from '@/components/organisms/Footer'
import Header from '@/components/organisms/Header'

const CommonLayout: FC = ({ children }) => {
  return (
    <div className='h-screen w-screen bg-black text-white'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default CommonLayout
