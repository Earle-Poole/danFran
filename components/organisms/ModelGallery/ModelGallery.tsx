import ModelPicture from '@/components/atoms/ModelGalleryPictures/ModelPicture'
import DanFranPhoto0 from '/public/assets/modelling_gallery/daniel-franzese-gallery-0.webp'
import DanFranPhoto1 from '/public/assets/modelling_gallery/daniel-franzese-gallery-1.webp'
import DanFranPhoto2 from '/public/assets/modelling_gallery/daniel-franzese-gallery-2.webp'
import DanFranPhoto3 from '/public/assets/modelling_gallery/daniel-franzese-gallery-3.webp'
import DanFranPhoto4 from '/public/assets/modelling_gallery/daniel-franzese-gallery-4.webp'
import DanFranPhoto5 from '/public/assets/modelling_gallery/daniel-franzese-gallery-5.webp'
import DanFranPhoto6 from '/public/assets/modelling_gallery/daniel-franzese-gallery-6.webp'
import DanFranPhoto7 from '/public/assets/modelling_gallery/daniel-franzese-gallery-7.webp'
import DanFranPhoto8 from '/public/assets/modelling_gallery/daniel-franzese-gallery-8.webp'
import DanFranPhoto9 from '/public/assets/modelling_gallery/daniel-franzese-gallery-9.webp'
import DanFranPhoto10 from '/public/assets/modelling_gallery/daniel-franzese-gallery-10.webp'
import DanFranPhoto11 from '/public/assets/modelling_gallery/daniel-franzese-gallery-11.webp'
import DanFranPhoto12 from '/public/assets/modelling_gallery/daniel-franzese-gallery-12.webp'
import DanFranPhoto13 from '/public/assets/modelling_gallery/daniel-franzese-gallery-13.webp'
import DanFranPhoto14 from '/public/assets/modelling_gallery/daniel-franzese-gallery-14.webp'
import DanFranPhoto15 from '/public/assets/modelling_gallery/daniel-franzese-gallery-15.webp'
import DanFranPhoto16 from '/public/assets/modelling_gallery/daniel-franzese-gallery-16.webp'
import DanFranPhoto17 from '/public/assets/modelling_gallery/daniel-franzese-gallery-17.webp'
import DanFranThumbnail0 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-0.webp'
import DanFranThumbnail1 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-1.webp'
import DanFranThumbnail2 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-2.webp'
import DanFranThumbnail3 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-3.webp'
import DanFranThumbnail4 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-4.webp'
import DanFranThumbnail5 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-5.webp'
import DanFranThumbnail6 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-6.webp'
import DanFranThumbnail7 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-7.webp'
import DanFranThumbnail8 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-8.webp'
import DanFranThumbnail9 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-9.webp'
import DanFranThumbnail10 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-10.webp'
import DanFranThumbnail11 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-11.webp'
import DanFranThumbnail12 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-12.webp'
import DanFranThumbnail13 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-13.webp'
import DanFranThumbnail14 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-14.webp'
import DanFranThumbnail15 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-15.webp'
import DanFranThumbnail16 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-16.webp'
import DanFranThumbnail17 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-17.webp'
import { useState } from 'react'
import SelectedModelGalleryImage from '@/components/molecule/SelectedModelGalleryImage/SelectedModelGalleryImage'

const ModelGallery = () => {
  const modelGalleryList = [
    { main: DanFranPhoto0, thumb: DanFranThumbnail0 },
    { main: DanFranPhoto1, thumb: DanFranThumbnail1 },
    { main: DanFranPhoto2, thumb: DanFranThumbnail2 },
    { main: DanFranPhoto3, thumb: DanFranThumbnail3 },
    { main: DanFranPhoto4, thumb: DanFranThumbnail4 },
    { main: DanFranPhoto5, thumb: DanFranThumbnail5 },
    { main: DanFranPhoto6, thumb: DanFranThumbnail6 },
    { main: DanFranPhoto7, thumb: DanFranThumbnail7 },
    { main: DanFranPhoto8, thumb: DanFranThumbnail8 },
    { main: DanFranPhoto9, thumb: DanFranThumbnail9 },
    { main: DanFranPhoto10, thumb: DanFranThumbnail10 },
    { main: DanFranPhoto11, thumb: DanFranThumbnail11 },
    { main: DanFranPhoto12, thumb: DanFranThumbnail12 },
    { main: DanFranPhoto13, thumb: DanFranThumbnail13 },
    { main: DanFranPhoto14, thumb: DanFranThumbnail14 },
    { main: DanFranPhoto15, thumb: DanFranThumbnail15 },
    { main: DanFranPhoto16, thumb: DanFranThumbnail16 },
    { main: DanFranPhoto17, thumb: DanFranThumbnail17 },
  ]

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
    <div className="flex flex-wrap my-10">
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
