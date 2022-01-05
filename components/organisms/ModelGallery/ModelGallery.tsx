import Picture from '@/components/atoms/GalleryPictures/Picture'
import DanFranPhoto0 from '/public/assets/modelling_gallery/daniel-franzese-gallery-0.jpg'
import DanFranPhoto1 from '/public/assets/modelling_gallery/daniel-franzese-gallery-1.jpg'
import DanFranPhoto2 from '/public/assets/modelling_gallery/daniel-franzese-gallery-2.jpg'
import DanFranPhoto3 from '/public/assets/modelling_gallery/daniel-franzese-gallery-3.jpg'
import DanFranPhoto4 from '/public/assets/modelling_gallery/daniel-franzese-gallery-4.jpg'
import DanFranPhoto5 from '/public/assets/modelling_gallery/daniel-franzese-gallery-5.jpg'
import DanFranPhoto6 from '/public/assets/modelling_gallery/daniel-franzese-gallery-6.jpg'
import DanFranPhoto7 from '/public/assets/modelling_gallery/daniel-franzese-gallery-7.jpg'
import DanFranPhoto8 from '/public/assets/modelling_gallery/daniel-franzese-gallery-8.jpg'
import DanFranPhoto9 from '/public/assets/modelling_gallery/daniel-franzese-gallery-9.jpg'
import DanFranPhoto10 from '/public/assets/modelling_gallery/daniel-franzese-gallery-10.jpg'
import DanFranPhoto11 from '/public/assets/modelling_gallery/daniel-franzese-gallery-11.jpg'
import DanFranPhoto12 from '/public/assets/modelling_gallery/daniel-franzese-gallery-12.jpg'
import DanFranPhoto13 from '/public/assets/modelling_gallery/daniel-franzese-gallery-13.jpg'
import DanFranPhoto14 from '/public/assets/modelling_gallery/daniel-franzese-gallery-14.jpg'
import DanFranPhoto15 from '/public/assets/modelling_gallery/daniel-franzese-gallery-15.jpg'
import DanFranPhoto16 from '/public/assets/modelling_gallery/daniel-franzese-gallery-16.jpg'
import DanFranPhoto17 from '/public/assets/modelling_gallery/daniel-franzese-gallery-17.jpg'
import DanFranThumbnail0 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-0.jpg'
import DanFranThumbnail1 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-1.jpg'
import DanFranThumbnail2 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-2.jpg'
import DanFranThumbnail3 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-3.jpg'
import DanFranThumbnail4 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-4.jpg'
import DanFranThumbnail5 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-5.jpg'
import DanFranThumbnail6 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-6.jpg'
import DanFranThumbnail7 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-7.jpg'
import DanFranThumbnail8 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-8.jpg'
import DanFranThumbnail9 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-9.jpg'
import DanFranThumbnail10 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-10.jpg'
import DanFranThumbnail11 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-11.jpg'
import DanFranThumbnail12 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-12.jpg'
import DanFranThumbnail13 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-13.jpg'
import DanFranThumbnail14 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-14.jpg'
import DanFranThumbnail15 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-15.jpg'
import DanFranThumbnail16 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-16.jpg'
import DanFranThumbnail17 from '/public/assets/modelling_gallery/thumbnails/daniel-franzese-thumbnail-17.jpg'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import SelectedGalleryImage from '@/components/molecule/SelectedGalleryImage/SelectedGalleryImage'

const ModelGalleryComponent = () => {
  const galleryList = [
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

  useEffect(() => {
    console.log('selectedBigImage', selectedBigImage)
    return () => {}
  })

  return (
    <div className="flex flex-wrap">
      {galleryList.map((pictureSetup, i) => (
        <Picture
          key={pictureSetup.main.src}
          pictureObj={pictureSetup}
          index={i}
          setSelectedBigImage={setSelectedBigImage}
        />
      ))}
      {selectedBigImage ? (
        <SelectedGalleryImage
          selectedBigImage={selectedBigImage}
          setSelectedBigImage={setSelectedBigImage}
        />
      ) : null}
    </div>
  )
}

export default ModelGalleryComponent
