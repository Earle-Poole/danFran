import Image from 'next/image'
import { FC } from 'react'

type PressPictureProps = {
  pressPhoto: StaticImageData
  index: number
}

const PressPicture: FC<PressPictureProps> = ({ pressPhoto, index }) => {
  return (
    <div className="basis-1/3 relative">
      <div className="flex justify-center my-4">
        <Image
          src={pressPhoto}
          alt={`galleryPicture ${index}`}
          width="340"
          height="460"
        />
      </div>
    </div>
  )
}

export default PressPicture
