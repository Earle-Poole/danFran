import VideoPlayer from "@/components/atoms/VideoPlayer/VideoPlayer"

const VideoGalleryTemplate = () => {
  return (
    <div className="w-full flex-col mt-36 ">
      <p className="text-left text-5xl indent-14 pb-3">
        Daniel Franzese - Video Gallery
      </p>
      <p className="text-left text-xl italic flex-wrap w-2/5 ml-14">{`"Be the change that you wish to see in the world." -Mahatma Gandhi`}</p>
      <VideoPlayer />
    </div>
  )
}

export default VideoGalleryTemplate
