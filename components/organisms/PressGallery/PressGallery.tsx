import PressPicture from '@/components/atoms/PressPicture/PressPicture'
import Image from 'next/image'
import YassComedyTourPoster from '/public/assets/press_kit/pressPhotos/DanFranPress_YASS_comedyTour.jpg'
import DanFranzese from '/public/assets/press_kit/pressPhotos/DanFranPress_DanFran.png'
import MeanGirls from '/public/assets/press_kit/pressPhotos/DanFranPress_MeanGirls.png'
import classNames from 'classnames'
import styles from './PressGallery.module.css'
import pressPhotos from './PressGallery.Photos'
import ContentSectionWrapper from '../ContentSectionWrapper/ContentSectionWrapper'
import design from '@/assets/zigzag.svg'

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
      <ContentSectionWrapper
        wrapperBackgroundColor="bg-gray-500/[15%]"
        id="Press_Bio"
      >
        <div className="flex flex-col mt-8 md:mt-0 md:ml-4">
          <p className="text-4xl text-center">{`Press Bio`}</p>
          <div className="pt-4 text-center">
            <Image src={design} alt="zigzag" layout="fixed"></Image>
          </div>
          <p className="text-xl md:text-2xl my-3 leading-relaxed indent-14">
            {`Best known for his role as Damian in Mean Girls, Daniel Franzese was also the lead of other indie cult classics Bully & I Spit On Your Grave. He was most recently a series regular on Mark Gordon's ABC series, Conviction. Prior to that he was a series regular on the Freeform series Recovery Road. Originally from Brooklyn, Daniel has become a well-known proponent and speaker for the LGBT Community. He reached 8 million views on his YouTube video series Sh*t Italian Moms Say. A self-proclaimed momma’s boy, his upbeat high-energy stand up comedy act, “Yass! You’re Amazing! Comedy Tour” captures his amazing and quirky life in the entertainment industry, as well as hilarious stories about his New York parents.`}
          </p>
        </div>
      </ContentSectionWrapper>
      <h2 className={h2Styles}>Photo Gallery</h2>
      <div
        data-name="press photo section"
        className={classNames(styles.container)}
      >
        {pressPhotos.map((pressPhoto, i) => (
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
