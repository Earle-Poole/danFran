import { useEffect, useState } from 'react'
import Image from 'next/image'
import ContentSectionWrapper from '@/components/organisms/ContentSectionWrapper/ContentSectionWrapper'

const VideoPlayer = () => {
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

  const [selectedMainVideo, setSelectedMainVideo] = useState<videoSetupProps>(
    comedyVideoList[0]
  )

  type videoSetupProps = { id: string; videoTitle: string }

  return (
    <div className="w-full max-w-7xl flex items-center mx-auto">
      <ContentSectionWrapper
        wrapperBackgroundColor="bg-gray-500/[15%]"
        id="videoPlayList"
      >
        <div
          data-id="video container"
          className="flex w-full justify-center gap-16 flex-col md:flex-row"
        >
          {/* main video */}
          <div data-id="main video" className="flex rounded-md">
            <div key={selectedMainVideo.id}>
              <span className="flex flex-wrap text-2xl mb-4 w-4/5 md:text-3xl md:w-full">{`${selectedMainVideo.videoTitle}`}</span>
              <iframe
                width="600"
                height="400"
                src={`https://www.youtube.com/embed/${selectedMainVideo.id}`}
                title={selectedMainVideo.videoTitle}
                allow="autoplay"
                className="flex rounded-md justify-center"
              ></iframe>
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
                  className="flex align-center gap-4 rounded-md m-2 p-2 cursor-pointer hover:bg-white/10 transition duration-150"
                >
                  <Image
                    width="125"
                    height="100"
                    src={`https://img.youtube.com/vi/${videoSetup.id}/0.jpg`}
                    title={videoSetup.videoTitle}
                    alt="videoThumbnail"
                    className="rounded-md"
                  />
                  <span className="flex my-auto text-lg text-pink-500">{`0${
                    i + 1
                  }. ${videoSetup.videoTitle}`}</span>
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
                  className="flex align-center gap-4 rounded-md m-2 p-2 cursor-pointer hover:bg-white/10 transition duration-150"
                >
                  <Image
                    width="125"
                    height="100"
                    src={`https://img.youtube.com/vi/${videoSetup.id}/0.jpg`}
                    title={videoSetup.videoTitle}
                    alt="videoThumbnail"
                    className="rounded-md"
                  />
                  <span className="flex my-auto text-lg text-cyan-400">{`0${
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
