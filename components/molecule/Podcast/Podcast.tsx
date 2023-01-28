import Stripes from '@/components/atoms/Icons/Stripes'
import { urls } from 'lib/constants'
import MyButton from '../../atoms/Button/Button'
import podcastCover from '@/assets/podcast_cover.webp'
import Image from "next/image";
import Link from 'next/link'

const Podcast = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center">
      <div className="flex flex-col basis-5/7 mt-8 md:mt-0 md:ml-4">
        <span className="text-center text-3xl pb-3">Check Out My Podcast</span>
        <Stripes />
        <Link href={urls.PODCAST}>

          <Image
            src={podcastCover}
            alt="podcast_cover"
            style={{
              maxWidth: "100%",
              height: "auto"
            }} />

        </Link>
        <div className="flex mx-auto mt-4 md:mt-10">
          <MyButton href={urls.PODCAST} name="Listen Here" isExternal />
        </div>
      </div>
    </div>
  );
}

export default Podcast
