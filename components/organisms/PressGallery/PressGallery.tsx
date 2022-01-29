import PressPicture from '@/components/atoms/PressPicture/PressPicture'
import Image from 'next/image'
import YassComedyTourPoster from '/public/assets/press_kit/pressPhotos/DanFranPress_YASS_comedyTour.jpg'
import DanFranzese from '/public/assets/press_kit/pressPhotos/DanFranPress_DanFran.png'
import MeanGirls from '/public/assets/press_kit/pressPhotos/DanFranPress_MeanGirls.png'
import classNames from 'classnames'
import styles from './PressGallery.module.css'
import * as pressPhotos from './PressGallery.Photos'

const PressGallery = () => {
  const h2Styles = 'text-left text-4xl indent-14 mt-8'

  return (
    <div className="flex flex-col my-10">
      <h2 className={h2Styles}>Banner Posters</h2>
      <div
        data-name="banner section"
        className="flex flex-col md:flex-row p-10"
      >
        <div className="basis-full md:basis-5/12">
          <Image
            src={YassComedyTourPoster}
            alt="Daniel Franzese YASS Comedy Tour"
          />
        </div>
        <div className="flex flex-col basis-full justify-center md:basis-7/12">
          <div className="flex basis-4/12 md:px-6 md:py-3">
            <Image src={DanFranzese} alt="Daniel Franzese" />
          </div>
          <div className="flex basis-4/12 md:px-6 md:py-3">
            <Image src={MeanGirls} alt="Mean Girls Banner" />
          </div>
        </div>
      </div>
      {/* <h2 className={h2Styles}>{'Bio & Tour Flyer'}</h2>
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
      </div> */}
      <h2 className={h2Styles}>Photo Gallery</h2>
      <div
        data-name="press photo section"
        className={classNames(styles.container)}
      >
        {Object.values(pressPhotos).map((pressPhoto, i) => (
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
