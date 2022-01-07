import PressPicture from '@/components/atoms/PressGalleryPictures/PressPicture'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import DanFranPressPhoto0 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto0.jpg'
import DanFranPressPhoto1 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto1.png'
import DanFranPressPhoto2 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto2.png'
import DanFranPressPhoto3 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto3.jpg'
import DanFranPressPhoto4 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto4.jpg'
import DanFranPressPhoto5 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto5.jpg'
import YassComedyTour from '/public/assets/press_kit/pressPhotos/DanFranPress_YASS_comedyTour.jpg'
import DanFranzese from '/public/assets/press_kit/pressPhotos/DanFranPress_DanFran.png'
import MeanGirls from '/public/assets/press_kit/pressPhotos/DanFranPress_MeanGirls.png'

const PressGallery = () => {
  const pressGalleryList = [
    DanFranPressPhoto0,
    DanFranPressPhoto1,
    DanFranPressPhoto2,
    DanFranPressPhoto3,
    DanFranPressPhoto4,
    DanFranPressPhoto5,
  ]

  const [selectedPressImage, setSelectedPressImage] =
    useState<StaticImageData | null>(null)

  useEffect(() => {
    console.log('selectedPressImage', selectedPressImage)
    return () => {}
  })

  return (
    <div className="flex flex-col my-8">
      <div className="border-8 border-red-700 w-full">
        <div className='text-center'>
          <Image
            src={YassComedyTour}
            alt="Daniel Franzese YASS Comedy Tour"
            width={500}
            height={500}
          />
        </div>
        <div className='border-8 border-red-700 basis-1/2'>
          <Image
            src={DanFranzese}
            alt="Daniel Franzese"
            width={500}
            height={250}
          />
          <Image
            src={MeanGirls}
            alt="Mean Girls Banner"
            width={400}
            height={300}
          />
        </div>
      </div>

      <div className="my-8 border-8 border-red-700">
          PDFs need to go here
      </div>
      
      <div className="flex flex-wrap border-8 border-red-700">
        {pressGalleryList.map((pressPhoto, i) => (
          <PressPicture
            key={pressPhoto.src}
            pressPhoto={pressPhoto}
            index={i}
            setSelectedPressImage={setSelectedPressImage}
          />
        ))}
      </div>
    </div>
  )
}

export default PressGallery
