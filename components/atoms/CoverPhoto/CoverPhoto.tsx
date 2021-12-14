import Image from 'next/image'
import photo from '@/assets/home_cover.jpg'

const CoverPhoto = () => {
  return (
    <div className='relative'>
      <div className='max-h-220 overflow-hidden'>
        <div className='w-screen'>
          <Image src={photo} alt='cover-photo' layout='responsive' />
        </div>
      </div>
      <div className='absolute bottom-10 left-10 text-shadow font-extrabold text-5xl md:text-7xl lg:text-9xl'>
        Daniel Franzese
      </div>
    </div>
  )
}

export default CoverPhoto
