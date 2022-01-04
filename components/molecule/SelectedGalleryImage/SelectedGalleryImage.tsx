import Image from 'next/image'
import { FC, useState } from 'react'

type SelectedGalleryImageProps = {
  selectedBigImage: StaticImageData
}

const SelectedGalleryImage: FC<SelectedGalleryImageProps> = ({
  selectedBigImage,
}) => {
  return (
    <div>
      <Image
        src={selectedBigImage}
        alt={`Selected Picture`}
        width="600"
        height="500"
      />
    </div>
  )
}

export default SelectedGalleryImage
 