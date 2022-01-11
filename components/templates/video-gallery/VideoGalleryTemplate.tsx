import React from 'react'
import YouTube from 'react-youtube'

const VideoGalleryTemplate = () => {
  return (
    <div>
      <div className="flex justify-center">
        <h3>Video Galley</h3>
        <iframe
          width="600"
          height="400"
          src="https://www.youtube.com/embed/eac91tZsZMw"
          title="YouTube video player"
          frameBorder="50"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    </div>
  )
}

export default VideoGalleryTemplate
