import Image from 'next/image'
import { FC } from 'react'

type PressPictureProps = {
  pressPhoto: StaticImageData
}

const PressPicture: FC<PressPictureProps> = ({ pressPhoto }) => {
  const photoSrcSplit = pressPhoto.src.split('/')
  const filename = photoSrcSplit[photoSrcSplit.length - 1].split('.')[0]

  return (
    <div className={'flex-col relative'}>
      <Image
        src={pressPhoto}
        alt={`Press Photo: ${filename}`}
        layout="responsive"
      />
    </div>
  )
}

export default PressPicture
