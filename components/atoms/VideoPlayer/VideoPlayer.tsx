import { useEffect, useState } from 'react'
import Image from 'next/image'

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

  useEffect(() => {
    console.log('selectedMainVideo', selectedMainVideo)
    return () => {}
  })

  type videoSetupProps = { id: string; videoTitle: string }

  const h2Styles = 'text-left text-3xl indent-14 mt-8'

  return (
    <div
      data-id="video container"
      className="flex w-full  justify-center gap-6 my-14"
    >
      {/* main video */}
      <div
        data-id="main video"
        className="flex rounded-md p-3 border-solid border-2 border-white"
      >
        <div key={selectedMainVideo.id}>
          <iframe
            width="600"
            height="400"
            src={`https://www.youtube.com/embed/${selectedMainVideo.id}`}
            title={selectedMainVideo.videoTitle}
            allow="autoplay"
            className="flex rounded-md justify-center"
          ></iframe>
          <span className={h2Styles}>{`${selectedMainVideo.videoTitle}`}</span>
        </div>
      </div>

      <div
        data-id="video list"
        className="rounded-md h-[29rem] overflow-y-scroll scroll-smooth scroll-px-2 scroll-w-4 border-solid border-2 border-white"
      >
        {/* comedy video list */}
        <span className="text-left text-3xl indent-14 my-10">
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
              className="flex-col align-center gap-4 rounded-md m-2 p-2 cursor-pointer hover:bg-cyan-400 transition duration-150"
            >
              <Image
                width="150"
                height="75"
                src={`https://img.youtube.com/vi/${videoSetup.id}/0.jpg`}
                title={videoSetup.videoTitle}
                alt="videoThumbnail"
                className="rounded-md hover:text-cyan-400 transition duration-150"
              />
              <span className="flex text-lg text-pink-500">{`0${i + 1}. ${
                videoSetup.videoTitle
              }`}</span>
            </div>
          )
        })}
        {/* press videos list */}
        <span className="text-left text-3xl indent-14 my-10">Press Videos</span>
        {pressVideoList.map((videoSetup: videoSetupProps, i) => {
          const onClickHandler = () => {
            setSelectedMainVideo(videoSetup)
          }
          return (
            <div
              key={videoSetup.id}
              onClick={onClickHandler}
              className="flex-col align-center gap-4 rounded-md m-2 p-2 cursor-pointer hover:bg-cyan-400 transition duration-150"
            >
              <Image
                width="150"
                height="75"
                src={`https://img.youtube.com/vi/${videoSetup.id}/0.jpg`}
                title={videoSetup.videoTitle}
                alt="videoThumbnail"
                className="rounded-md hover:text-cyan-400 transition duration-150"
              />
              <span className="flex text-lg text-pink-500">{`0${i + 1}. ${
                videoSetup.videoTitle
              }`}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default VideoPlayer
