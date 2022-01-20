import photo from '@/assets/home_cover.jpg'

const CoverPhoto = () => {
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
        Daniel Franzese
      </div>
    </div>
  )
}

export default CoverPhoto
