import Stripes from '@/components/atoms/Icons/Stripes'
import { urls } from 'lib/constants'
import MyButton from '../../atoms/Button/Button'
import podcastCover from '@/assets/podcast_cover.webp'
import Image from 'next/image'

const Podcast = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center">
      <div className="flex flex-col basis-5/7 mt-8 md:mt-0 md:ml-4">
        <span className="text-center text-3xl pb-3">Check Out My Podcast</span>
        <Stripes />
        <div className="items-center text-2xl">
          <p className="indent-10 text-xl md:text-2xl my-3 leading-relaxed">
            Yass, Jesus! is a faith and sexuality affirming podcast that
            believes you don&apos;t have to pick between gay and God. Hosts,
            Daniel Franzese (Actor, Mean Girls, Looking) and Azariah Southworth
            (former host, The Remix on TBN) meet each week in this hilarious
            take on a Sunday service to explore big questions and find out what
            it means to be a Christ-loving member of the LGBTQIA+ community
            during these divided times.
          </p>
          <p className="text-center mt-8 md:my-8">​ New episodes every Sunday.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <Image src={podcastCover} alt="podcast_cover" />
        <MyButton href={urls.PODCAST} name="Listen Here" isExternal />
      </div>
    </div>
  )
}

export default Podcast
