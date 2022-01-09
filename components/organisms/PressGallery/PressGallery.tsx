import PressPicture from '@/components/atoms/PressGalleryPictures/PressPicture'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import DanFranPressPhoto0 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto0.jpg'
import DanFranPressPhoto1 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto1.png'
import DanFranPressPhoto2 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto2.png'
import DanFranPressPhoto3 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto3.jpg'
import DanFranPressPhoto4 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto4.jpg'
import DanFranPressPhoto5 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto5.jpg'
import YassComedyTourPoster from '/public/assets/press_kit/pressPhotos/DanFranPress_YASS_comedyTour.jpg'
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
      <div className="flex w-full basis-3/6 justify-center gap-10 my-auto">
        <div className="my-auto">
          <Image
            src={DanFranzese}
            alt="Daniel Franzese"
            width={360}
            height={50}
          />
        </div>
        <div className="">
          <Image
            src={YassComedyTourPoster}
            alt="Daniel Franzese YASS Comedy Tour"
            width={500}
            height={500}
          />
        </div>
        <div className="my-auto">
          <Image
            src={MeanGirls}
            alt="Mean Girls Banner"
            width={360}
            height={57}
          />
        </div>
      </div>

      <div className="my-8 p-8 list-disc border-8 border-red-700">
        <div>
          <a
            href="/public/assets/press_kit/df-biography.pdf"
            className="text-xl underline underline-offset-2"
          >
            Download Biography PDF
          </a>
        </div>
        <div>
          <a
            href="/public/assets/press_kit/yass-comedy-tour-description.pdf"
            className="text-xl underline underline-offset-2"
          >
            Download Comedy Tour Description PDF
          </a>
        </div>
      </div>

      <div className="flex flex-wrap">
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
