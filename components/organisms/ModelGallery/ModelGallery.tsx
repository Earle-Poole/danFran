import ModelPicture from '@/components/atoms/ModelGalleryPictures/ModelPicture'
import modelGalleryList from '@/components/organisms/ModelGallery/ModelGallery.Photos'
import { useState } from 'react'
import SelectedModelGalleryImage from '@/components/molecule/SelectedModelGalleryImage/SelectedModelGalleryImage'

const ModelGallery = () => {
  const [selectedBigImage, setSelectedBigImage] =
    useState<StaticImageData | null>(null)

  const findIndexCallback = (picture: {
    main: StaticImageData
    thumb: StaticImageData
  }) => {
    return picture.main.src === selectedBigImage?.src
  }

  const previousPicture = () => {
    const currentIndex = modelGalleryList.findIndex(findIndexCallback)
    if (currentIndex - 1 < 0) {
      setSelectedBigImage(modelGalleryList[modelGalleryList.length - 1].main)
    } else {
      setSelectedBigImage(modelGalleryList[currentIndex - 1].main)
    }
  }

  const nextPicture = () => {
    const currentIndex = modelGalleryList.findIndex(findIndexCallback)
    if (currentIndex + 1 === modelGalleryList.length) {
      setSelectedBigImage(modelGalleryList[0].main)
    } else {
      setSelectedBigImage(
        modelGalleryList[modelGalleryList.findIndex(findIndexCallback) + 1].main
      )
    }
  }

  return (
    <div className="flex flex-wrap my-10 justify-center">
      {modelGalleryList.map((pictureSetup, i) => (
        <ModelPicture
          key={pictureSetup.main.src}
          pictureObj={pictureSetup}
          index={i}
          setSelectedBigImage={setSelectedBigImage}
        />
      ))}
      {selectedBigImage ? (
        <SelectedModelGalleryImage
          selectedBigImage={selectedBigImage}
          setSelectedBigImage={setSelectedBigImage}
          previousPicture={previousPicture}
          nextPicture={nextPicture}
        />
      ) : null}
    </div>
  )
}

export default ModelGallery
