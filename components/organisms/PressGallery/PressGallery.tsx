import PressPicture from '@/components/atoms/PressGalleryPictures/PressPicture'
import Image from 'next/image'
import { useState } from 'react'
import DanFranPressPhoto0 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto0.jpg'
import DanFranPressPhoto1 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto1.png'
import DanFranPressPhoto2 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto2.png'
import DanFranPressPhoto3 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto3.jpg'
import DanFranPressPhoto4 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto4.jpg'
import DanFranPressPhoto5 from '/public/assets/press_kit/pressPhotos/DanFranPressPhoto5.jpg'
import YassComedyTourPoster from '/public/assets/press_kit/pressPhotos/DanFranPress_YASS_comedyTour.jpg'
import DanFranzese from '/public/assets/press_kit/pressPhotos/DanFranPress_DanFran.png'
import MeanGirls from '/public/assets/press_kit/pressPhotos/DanFranPress_MeanGirls.png'
import BiographyThumbnail from '/public/assets/press_kit/df-biographyThumbnail.png'
import ComedyTourDescriptionThumbnail from '/public/assets/press_kit/yass-comedy-tour-description-Thumbnail.png'

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

  const h2Styles = 'text-left text-4xl indent-14 mt-8'

   return (
    <div className="flex flex-col w-full my-10">
      <h2 className={h2Styles}>Banner Posters</h2>
      <div
        id="banner section"
        className="flex w-full basis-3/6 justify-center gap-10 my-auto"
      >
        <div className="my-auto ml-10 ">
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
        <div className="my-auto mr-10">
          <Image
            src={MeanGirls}
            alt="Mean Girls Banner"
            width={360}
            height={57}
          />
        </div>
      </div>
      <h2 className={h2Styles}>{'Bio & Tour Flyer'}</h2>
      <div
        id="pdf section"
        className="flex w-full justify-evenly my-10 mx-auto"
      >
        <div className="flex flex-col">
          <Image
            src={BiographyThumbnail}
            alt="BioThumbnail"
            width={225}
            height={300}
          />
          <a
            href="/assets/press_kit/df-biography.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col text-xl underline underline-offset-2 justify-center"
          >
            Daniel Franzese Biography PDF
          </a>
        </div>
        <div className="flex flex-wrap flex-col">
          <Image
            src={ComedyTourDescriptionThumbnail}
            alt="YassComedyTourDescriptionThumbnail"
            width={225}
            height={300}
          />
          <a
            href="/assets/press_kit/yass-comedy-tour-description.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col text-xl underline underline-offset-2 justify-center"
          >
            {'Comedy Tour Description PDF'}
          </a>
        </div>
      </div>
      <h2 className={h2Styles}>Photo Gallery</h2>
      <div id="press photo section" className="flex flex-wrap">
        {pressGalleryList.map((pressPhoto, i) => (
          <PressPicture
            key={pressPhoto.src}
            pressPhoto={pressPhoto}
            index={i}
            setSelectedPressImage={setSelectedPressImage}
          />
        ))}
      </div>
      <h2 className={h2Styles}>Crowd Reactions</h2>
    </div>
  )
}

export default PressGallery
