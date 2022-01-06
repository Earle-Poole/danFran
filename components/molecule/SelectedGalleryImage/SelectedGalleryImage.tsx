import Image from 'next/image'
import { Dispatch, FC, SetStateAction } from 'react'
import ReactDom from 'react-dom'
import galleryList from '@/components/organisms/ModelGallery/ModelGallery';

type SelectedGalleryImageProps = {
  selectedBigImage: StaticImageData
  setSelectedBigImage: Dispatch<SetStateAction<StaticImageData | null>>
}

const SelectedGalleryImage: FC<SelectedGalleryImageProps> = ({
  selectedBigImage,
  setSelectedBigImage,
}) => {
  const portalTarget = document.body

//   const previousPictureHandler = (Index) => {
//      return ()}

//   const nextPictureHandler = () => {
//     return <> </>
//   }
  
  return ReactDom.createPortal(
    <div
      className="absolute top-0 h-screen w-screen z-20 bg-black/80 overflow-hidden justify-center items-center flex"
      onClick={() => {
        setSelectedBigImage(null)
      }}
    >
      <div className="w-9/12 h-full items-center flex">
        <button
          className="absolute left-6 border-slate-600 border-2  z-30 text-4xl text-white"
          type="button"
          title="Previous Picture"
        //   onClick={previousPictureHandler}
        >
          &#8592;
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
          className="absolute right-6 border-slate-600 border-2  z-30 text-4xl text-white"
          type="button"
          title="Next Picture"
        //   onClick={nextPictureHandler}
        >
          &#8594;
        </button>
      </div>
    </div>,
    portalTarget
  )
}

export default SelectedGalleryImage
