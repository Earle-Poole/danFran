import photo from '@/assets/home_cover.webp'
import { useScrollPosition } from 'lib/hooks'
import { isClient } from 'lib/toolbox'
import { useEffect, useState } from 'react'
import Splitter from '../Splitter'

const CoverPhoto = () => {
  const [isAtTopOfPage, setIsAtTopOfPage] = useState(true)
  const [layoutBody, setLayoutBody] = useState(
    isClient ? document.getElementById('layout-body') : null
  )
  const scrollPosition = useScrollPosition(isClient ? layoutBody : null)

  useEffect(() => {
    setLayoutBody(document.getElementById('layout-body'))
  }, [])

  useEffect(() => {
    scrollPosition > 100 ? setIsAtTopOfPage(false) : setIsAtTopOfPage(true)
  }, [scrollPosition])

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
        <div className="absolute h-10 w-10 hidden md:block bottom-2 right-4 text-shadow opacity-60 font-extrabold text-5xl md:text-7xl md:bottom-4 md:right-4 animate-bounce pointer-events-none">
          <span className="absolute bottom-0 right-0">&#8964;</span>
          <span className="absolute bottom-7 right-0">&#8964;</span>
          <span className="absolute bottom-14 right-0">&#8964;</span>
        </div>
      ) : null}
    </div>
  )
}

export default CoverPhoto
