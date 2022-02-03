import Image from 'next/image'
import { Dispatch, FC, SetStateAction } from 'react'
import ReactDom from 'react-dom'

type SelectedModelGalleryImageProps = {
  selectedBigImage: StaticImageData
  setSelectedBigImage: Dispatch<SetStateAction<StaticImageData | null>>
  previousPicture: () => void
  nextPicture: () => void
}

const SelectedModelGalleryImage: FC<SelectedModelGalleryImageProps> = ({
  selectedBigImage,
  setSelectedBigImage,
  previousPicture,
  nextPicture,
}) => {
  const portalTarget = document.body

  return ReactDom.createPortal(
    <div
      className="absolute top-0 h-screen w-screen z-20 bg-black/80 overflow-hidden justify-center items-center flex"
      onClick={() => {
        setSelectedBigImage(null)
      }}
    >
      <div className="w-9/12 h-full items-center flex">
        <button
          className="absolute left-6 border-black bg-white/20 h-12 w-20 rounded border-2 z-30 text-4xl text-black"
          type="button"
          title="Previous Picture"
          onClick={(e) => {
            e.stopPropagation()
            previousPicture()
          }}
        >
          {/* &#8592; */}
          &#8678;
        </button>
        <div className="relative w-full h-5/6">
          <Image
            layout="fill"
            objectFit="contain"
            src={selectedBigImage}
            alt={`Selected Picture`}
          />
        </div>

        <button
          className="absolute right-6 border-black bg-white/20 h-12 w-20 rounded border-2 z-30 text-4xl text-black"
          type="button"
          title="Next Picture"
          onClick={(e) => {
            e.stopPropagation()
            nextPicture()
          }}
        >
          {/* &#8594; */}
          &#8680;
        </button>
      </div>
    </div>,
    portalTarget
  )
}

export default SelectedModelGalleryImage
