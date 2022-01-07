import classNames from 'classnames'
import Image from 'next/image'
import { Dispatch, FC, SetStateAction } from 'react'

type PressPictureProps = {
  pressPhoto: StaticImageData
  index: number
  setSelectedPressImage: Dispatch<SetStateAction<StaticImageData | null>>
}

const PressPicture: FC<PressPictureProps> = ({ pressPhoto, index }) => {
  return (
    <div
      className="basis-1/3 hover:cursor relative"
      // onClick={() => downloads file}
    >
      <div className='m-2'>
        <Image
          src={pressPhoto}
          alt={`galleryPicture ${index}`}
          width="600"
          height="600"
        />
      </div>
    </div>
  )
}

export default PressPicture
