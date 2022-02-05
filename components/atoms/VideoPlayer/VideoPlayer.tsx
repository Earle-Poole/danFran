import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import ContentSectionWrapper from '@/components/organisms/ContentSectionWrapper/ContentSectionWrapper'
import PlayButton from '../Icons/PlayButton'
import { useElementSize, useMediaQuery } from 'lib/hooks'
import { breakpoints } from 'lib/constants'
import { isClient } from 'lib/toolbox'
import classNames from 'classnames'

type videoSetupProps = { id: string; videoTitle: string }
const comedyVideoList = [
  {
    id: 'eac91tZsZMw',
    videoTitle: 'Shit Italian Moms Say #1',
  },
  {
    id: 'LCPV0sl4GdE',
    videoTitle: 'Shit Italian Moms Say #2',
  },
  {
    id: 'tSF7heNcXSk',
    videoTitle: 'Shit Italian Moms Say #3',
  },
  {
    id: 'DX2o3U8045U',
    videoTitle: 'Stand Up Comedy Act',
  },
  {
    id: '_PCPwmuiYL0',
    videoTitle: 'Italian MOMster: Danny Scares Mom!',
  },
  {
    id: 'm7FnCsSJ5WY',
    videoTitle: 'Italian Mom: Embarrassing Family Stories',
  },
]

const pressVideoList = [
  {
    id: 'kgqXMpDuAA4',
    videoTitle: 'Daniel Franzese Hosts the Voice Awards',
  },
  {
    id: 'Li3Yl6RAcrU',
    videoTitle: 'Daniel Franzese Joins Bootleg Fashion Photo Review',
  },
  {
    id: 'ZqtkSped3K4',
    videoTitle: 'Daniel Franzese on Hey Queen',
  },
  {
    id: 'Bv9mhZqhb8Q',
    videoTitle: "15 Things You Didn't Know About Daniel Franzese",
  },
  {
    id: 'RpZ_70zuzqg',
    videoTitle: 'Daniel Franzese Interview on Pop Trigger',
  },
]

const VideoPlayer = () => {
  const [selectedMainVideo, setSelectedMainVideo] = useState<videoSetupProps>(
    comedyVideoList[0]
  )
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false)
  const [iframeDimensions, setIframeDimensions] = useState({
    height: 0,
    width: 0,
  })

  const videoPlaylistElem = useRef<HTMLDivElement>(null!)
  const isUpToTablet = useMediaQuery(breakpoints.upToLg)
  const isMobile = useMediaQuery(breakpoints.sm)

  const resizeObserver = useMemo(
    () =>
      isClient
        ? new ResizeObserver(() => {
            if (videoPlaylistElem.current) {
              const { height, width } =
                videoPlaylistElem.current.getBoundingClientRect()
              if (width && height) {
                setIframeDimensions({
                  width: isUpToTablet
                    ? width - (isMobile ? 80 : 192)
                    : (width - 192) / 2,
                  height: isUpToTablet
                    ? isMobile
                      ? 400
                      : 500
                    : ((height - 142) * 3) / 4,
                })
              }
            }
          })
        : null,
    [isUpToTablet, isMobile]
  )

  useEffect(() => {
    // connect and disconnect the resize observer
    if (resizeObserver && videoPlaylistElem.current) {
      resizeObserver.observe(videoPlaylistElem.current)
      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [resizeObserver])

  useEffect(() => {
    // on load, and when the screen width changes between isMobile and isUpToTablet,
    // or neither this will update the iframe dimensions
    if (videoPlaylistElem.current) {
      const { width, height } =
        videoPlaylistElem.current.getBoundingClientRect()
      setIframeDimensions({
        width: isUpToTablet ? width - (isMobile ? 80 : 192) : (width - 192) / 2,
        height: isUpToTablet
          ? isMobile
            ? 400
            : 500
          : ((height - 112) * 3) / 4,
      })
    }
  }, [isMobile, isUpToTablet])

  return (
    <div
      className="w-full max-w-7xl flex items-center mx-auto lg"
      ref={videoPlaylistElem}
    >
      <ContentSectionWrapper
        wrapperBackgroundColor="bg-gray-500/[15%]"
        id="videoPlayList"
      >
        <div className="flex w-full justify-center gap-16 flex-col lg:flex-row">
          {/* main video */}
          <div data-id="main video" className="flex rounded-md basis-1/2">
            <div key={selectedMainVideo.id} className="w-full">
              <div
                style={{ width: iframeDimensions.width }}
                className="text-2xl mb-4 md:text-3xl truncate"
              >{`${selectedMainVideo.videoTitle}`}</div>
              {videoLoaded ? (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedMainVideo.id}`}
                  title={selectedMainVideo.videoTitle}
                  allow="autoplay"
                  height={iframeDimensions.height}
                  width={iframeDimensions.width}
                  className="flex rounded-md justify-center"
                />
              ) : (
                <div
                  className={
                    'flex bg-black items-center justify-center cursor-pointer'
                  }
                  onClick={() => {
                    setVideoLoaded(true)
                  }}
                  style={{
                    height: `${iframeDimensions.height / 16}rem`,
                    width: `${iframeDimensions.width / 16}rem`,
                  }}
                >
                  <PlayButton />
                </div>
              )}
            </div>
          </div>

          <div
            data-id="video list"
            className="rounded-md h-[29rem] overflow-y-scroll scroll-smooth scroll-px-2 scroll-w-4"
          >
            {/* comedy video list */}
            <span className="flex justify-center text-left text-2xl md:text-3xl my-4">
              Comedy Videos
            </span>
            {comedyVideoList.map((videoSetup: videoSetupProps, i) => {
              const onClickHandler = () => {
                setSelectedMainVideo(videoSetup)
              }
              return (
                <div
                  key={videoSetup.id}
                  onClick={onClickHandler}
                  className="flex items-center gap-4 rounded-md m-2 p-2 cursor-pointer hover:bg-black/90 transition duration-150"
                >
                  <div className="basis-1/3 h-28 md:h-40 lg:h-28 relative">
                    <Image
                      src={`https://img.youtube.com/vi/${videoSetup.id}/0.jpg`}
                      title={videoSetup.videoTitle}
                      alt="videoThumbnail"
                      layout="fill"
                      className="rounded-md"
                    />
                  </div>
                  <div className="basis-2/3 text-lg text-pink-500">{`0${
                    i + 1
                  }. ${videoSetup.videoTitle}`}</div>
                </div>
              )
            })}
            {/* press videos list */}
            <span className="flex justify-center text-left text-2xl md:text-3xl my-4">
              Press Videos
            </span>
            {pressVideoList.map((videoSetup: videoSetupProps, i) => {
              const onClickHandler = () => {
                setSelectedMainVideo(videoSetup)
              }
              return (
                <div
                  key={videoSetup.id}
                  onClick={onClickHandler}
                  className="flex items-center gap-4 rounded-md m-2 p-2 cursor-pointer hover:bg-black/90 transition duration-150"
                >
                  <div className="basis-1/3 h-28 md:h-40 lg:h-28 relative">
                    <Image
                      src={`https://img.youtube.com/vi/${videoSetup.id}/0.jpg`}
                      title={videoSetup.videoTitle}
                      alt="videoThumbnail"
                      layout="fill"
                      className="rounded-md"
                    />
                  </div>
                  <span className="basis-2/3 text-lg text-pink-500">{`0${
                    i + 1
                  }. ${videoSetup.videoTitle}`}</span>
                </div>
              )
            })}
          </div>
        </div>
      </ContentSectionWrapper>
    </div>
  )
}
export default VideoPlayer
