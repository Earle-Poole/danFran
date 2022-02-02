import classNames from 'classnames'
import Image from 'next/image'
import { Dispatch, FC, SetStateAction } from 'react'
import styles from './modelPicture.module.css'

type ModelPictureProps = {
  pictureObj: { main: StaticImageData; thumb: StaticImageData }
  index: number
  setSelectedBigImage: Dispatch<SetStateAction<StaticImageData | null>>
}

const ModelPicture: FC<ModelPictureProps> = ({
  pictureObj,
  index,
  setSelectedBigImage,
}) => {
  return (
    <div
      className={classNames(
        'basis-full sm:basis-1/2 md:basis-1/3 hover:cursor-zoom-in relative',
        styles.pictureWrapper
      )}
      onClick={() => {
        console.log('pictureObj: ', pictureObj)
        setSelectedBigImage(pictureObj.main)
      }}
    >
      <div className="hidden absolute z-30 bg-black/40 top-0 bottom-0 right-0 left-0 justify-center items-center text-2xl pointer-events-none">
        Click to Enlarge
      </div>
      <Image
        src={pictureObj.thumb}
        alt={`galleryPicture ${index}`}
        width="600"
        height="480"
        layout="responsive"
      />
    </div>
  )
}

export default ModelPicture
