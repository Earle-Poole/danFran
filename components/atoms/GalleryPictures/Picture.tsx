import galleryList from '@/components/molecule/ModelGallery/ModelGallery'
import Image from 'next/image'
import { FC } from 'react'

type PictureProps = {
  pictureObj: { main: StaticImageData; thumb: StaticImageData }
  index: number
}

const Picture: FC<PictureProps> = ({ pictureObj, index }) => {
  return (
    <div className='basis-1/3'>
      <Image
        src={pictureObj.thumb}
        alt={`galleryPicture ${index}`}
        width="550"
        height="400"
      />
    </div>
  )
}

export default Picture
