import VideoPlayer from '@/components/atoms/VideoPlayer/VideoPlayer'
import styles from '@/components/layouts/commonLayout.module.css'
import classnames from 'classnames'

const VideoGalleryTemplate = () => {
  return (
    <div
      className={classnames(
        'w-full flex-col flex items-center mt-36',
        styles.pageHeight
      )}
    >
      <div className="w-full max-w-7xl">
        <p className="text-left text-3xl md:text-5xl ml-4 md:ml-10 pb-5">
          Daniel Franzese - Video Gallery
        </p>
        <p className="text-left text-xl ml-4 md:ml-10 italic flex-wrap md:w-3/5">{`"Be the change that you wish to see in the world." -Mahatma Gandhi`}</p>
      </div>
      <VideoPlayer />
    </div>
  )
}

export default VideoGalleryTemplate
