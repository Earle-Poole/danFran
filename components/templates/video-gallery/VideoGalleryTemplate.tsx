import VideoPlayer from '@/components/atoms/VideoPlayer/VideoPlayer'
import styles from '@/components/layouts/commonLayout.module.css'
import classnames from 'classnames'

const VideoGalleryTemplate = () => {
  return (
    <div className={classnames('w-full flex-col mt-36', styles.pageHeight)}>
      <p className="text-left text-3xl md:text-5xl indent-10 pb-5">
        Daniel Franzese - Video Gallery
      </p>
      <p className="text-left text-xl ml-10 italic flex-wrap md:w-3/5">{`"Be the change that you wish to see in the world." -Mahatma Gandhi`}</p>
      <VideoPlayer />
    </div>
  )
}

export default VideoGalleryTemplate
