const VideoPlayer = () => {
  return (
    <div className="flex flex-col justify-center">
      <div className="mx-auto">
          <h2>Comedy</h2>
        <iframe
          width="600"
          height="400"
          src="https://www.youtube.com/embed/eac91tZsZMw"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
      <div className="mx-auto">
          <h2>Press</h2>
        <iframe
          width="600"
          height="400"
          src="https://www.youtube.com/embed/kgqXMpDuAA4" 
          title="YouTube video player" 
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    </div>
  )
}

export default VideoPlayer
