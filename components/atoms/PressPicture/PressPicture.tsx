import Image from 'next/image'
import { FC } from 'react'

type PressPictureProps = {
  pressPhoto: StaticImageData
  index: number
}

const PressPicture: FC<PressPictureProps> = ({ pressPhoto, index }) => {
  return (
    <div className={'flex-col relative'}>
      <Image
        src={pressPhoto}
        alt={`galleryPicture ${index}`}
        layout="responsive"
      />
    </div>
  )
}

export default PressPicture
