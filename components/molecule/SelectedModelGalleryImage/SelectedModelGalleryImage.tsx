import Image from 'next/image'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import ReactDom from 'react-dom'

type SelectedModelGalleryImageProps = {
  selectedBigImage: StaticImageData
  setSelectedBigImage: Dispatch<SetStateAction<StaticImageData | null>>
}

const SelectedModelGalleryImage: FC<SelectedModelGalleryImageProps> = ({
  selectedBigImage,
  setSelectedBigImage,
}) => {
  const portalTarget = document.body

  return ReactDom.createPortal(
    <div
      className="absolute top-0 h-screen w-screen z-20 bg-black/80 overflow-hidden justify-center items-center flex"
      onClick={() => {
        setSelectedBigImage(null)
      }}
    >
      <Image src={selectedBigImage} alt={`Selected Picture`} />
    </div>,
    portalTarget
  )
}

export default SelectedModelGalleryImage
