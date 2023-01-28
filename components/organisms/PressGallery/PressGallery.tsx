import PressPicture from '@/components/atoms/PressPicture/PressPicture'
import Image from "next/image";
import YassComedyTourPoster from '/public/assets/press_kit/pressPhotos/DanFranPress_YASS_comedyTour.jpg'
import DanFranzese from '/public/assets/press_kit/pressPhotos/DanFranPress_DanFran.png'
import MeanGirls from '/public/assets/press_kit/pressPhotos/DanFranPress_MeanGirls.png'
import classNames from 'classnames'
import styles from './PressGallery.module.css'
import pressPhotos from './PressGallery.Photos'
import ContentSectionWrapper from '../ContentSectionWrapper/ContentSectionWrapper'

const PressGallery = () => {
  const h2Styles = 'text-left text-4xl indent-14 mt-8'

  return (
    <div className="flex flex-col">
      <h2 className={h2Styles}>Banner Posters</h2>
      <div
        data-name="banner section"
        className="flex flex-col md:flex-row p-10"
      >
        <div className="basis-full md:basis-5/12">
          <Image
            src={YassComedyTourPoster}
            alt="Daniel Franzese YASS Comedy Tour"
            style={{
              maxWidth: "100%",
              height: "auto"
            }} />
        </div>
        <div className="flex flex-col basis-full justify-center md:basis-7/12">
          <div className="flex basis-4/12 md:px-6 md:py-3">
            <Image
              src={DanFranzese}
              alt="Daniel Franzese"
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          </div>
          <div className="flex basis-4/12 md:px-6 md:py-3">
            <Image
              src={MeanGirls}
              alt="Mean Girls Banner"
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          </div>
        </div>
      </div>
      <h2 className={h2Styles}>Photo Gallery</h2>
      <div
        data-name="press photo section"
        className={classNames(styles.container)}
      >
        {pressPhotos.map((pressPhoto) => (
          <PressPicture key={pressPhoto.src} pressPhoto={pressPhoto} />
        ))}
      </div>
    </div>
  );
}

export default PressGallery
