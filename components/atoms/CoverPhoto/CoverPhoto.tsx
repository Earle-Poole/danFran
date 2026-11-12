import photo from '@/assets/home_cover.webp'
import { useScrollPosition } from 'lib/hooks'
import Link from 'next/link'
import Splitter from '../Splitter'
import { slugs } from 'lib/constants'

const CoverPhoto = () => {
  const scrollPosition = useScrollPosition('layout-body')

  const isAtTopOfPage = scrollPosition <= 100

  return (
    <div className="relative">
      <div className="max-h-screen overflow-hidden">
        <div
          className="w-screen h-96 sm:h-220 md:h-screen"
          style={{
            backgroundImage: `url(${photo.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>
      <div className="absolute bottom-2 left-4 text-shadow font-extrabold text-5xl md:text-7xl md:bottom-10 md:left-10">
        <Splitter str="Daniel Franzese" />
      </div>
      {isAtTopOfPage ? (
        (<Link
          href={slugs.ABOUT}
          passHref
          className="absolute h-10 w-10 hidden md:block bottom-2 right-4 text-shadow opacity-60 font-extrabold text-5xl md:text-7xl md:bottom-4 md:right-4 animate-bounce">

          <span className="absolute bottom-0 right-0">&#8964;</span>
          <span className="absolute bottom-7 right-0">&#8964;</span>
          <span className="absolute bottom-14 right-0">&#8964;</span>

        </Link>)
      ) : null}
    </div>
  );
}

export default CoverPhoto
