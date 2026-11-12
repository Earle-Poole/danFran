import Image, { StaticImageData } from 'next/image'
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
    <button
      type="button"
      className={styles.pictureButton}
      onClick={() => {
        setSelectedBigImage(pictureObj.main)
      }}
    >
      <Image
        src={pictureObj.thumb}
        alt={`Open gallery photo ${index + 1}`}
        width="600"
        height="480"
        placeholder="blur"
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto"
        }} />
    </button>
  );
}

export default ModelPicture
