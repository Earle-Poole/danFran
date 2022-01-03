import galleryList from '@/components/organisms/ModelGallery/ModelGallery'
import classNames from 'classnames'
import Image from 'next/image'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import styles from './Picture.module.css'

type PictureProps = {
  pictureObj: { main: StaticImageData; thumb: StaticImageData }
  index: number
}

const Picture: FC<PictureProps> = ({ pictureObj, index }) => {
  const x = (bigPicture: StaticImageData) => {}
  
  return (
    <div
      className={classNames(
        'basis-1/3 hover:cursor-zoom-in relative',
        styles.pictureWrapper
      )}
      onClick={() => {
        x(pictureObj.main)
      }}
    >
      <div className="hidden absolute z-30 bg-black/40 top-0 bottom-0 right-0 left-0 justify-center items-center text-2xl pointer-events-none">
        Click to Enlarge
      </div>
      <Image
        src={pictureObj.thumb}
        alt={`galleryPicture ${index}`}
        width="600"
        height="500"
      />
    </div>
  )
}

export default Picture
