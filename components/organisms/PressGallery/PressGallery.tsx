import PressPicture from '@/components/atoms/PressGalleryPictures/PressPicture'
import Image from 'next/image'
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

  const h2Styles = 'text-left text-4xl indent-14 mt-8'

  return (
    <div className="flex flex-col w-full my-10">
      <h2 className={h2Styles}>Banner Posters</h2>
      <div
        data-name="banner section"
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
        data-name="pdf section"
        className="flex w-full justify-evenly my-10 mx-auto"
      >
        <div className="flex flex-col">
          <a
            href="/assets/press_kit/df-biography.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={BiographyThumbnail}
              alt="BioThumbnail"
              width={225}
              height={300}
            />
            <span className="flex flex-col text-xl underline underline-offset-2 justify-center">
              Daniel Franzese Biography PDF
            </span>
          </a>
        </div>
        <div className="flex flex-wrap flex-col">
          <a
            href="/assets/press_kit/yass-comedy-tour-description.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={ComedyTourDescriptionThumbnail}
              alt="YassComedyTourDescriptionThumbnail"
              width={225}
              height={300}
            />
            <span className="flex flex-col text-xl underline underline-offset-2 justify-center">
              {'Comedy Tour Description PDF'}
            </span>
          </a>
        </div>
      </div>
      <h2 className={h2Styles}>Photo Gallery</h2>
      <div data-name="press photo section" className="flex flex-wrap">
        {pressGalleryList.map((pressPhoto, i) => (
          <PressPicture
            key={pressPhoto.src}
            pressPhoto={pressPhoto}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}

export default PressGallery
