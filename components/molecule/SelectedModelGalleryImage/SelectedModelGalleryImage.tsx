import Image, { StaticImageData } from "next/image";
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
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
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    setImageLoading(true)
  }, [selectedBigImage])

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
          {imageLoading ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
              <div
                className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white"
                aria-label="Loading image"
                role="status"
              />
            </div>
          ) : null}
          <Image
            src={selectedBigImage}
            alt={`Selected Picture`}
            fill
            sizes="100vw"
            onLoad={() => {
              setImageLoading(false)
            }}
            style={{
              objectFit: "contain",
              opacity: imageLoading ? 0 : 1,
              transition: 'opacity 150ms ease',
            }} />
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
  );
}

export default SelectedModelGalleryImage
