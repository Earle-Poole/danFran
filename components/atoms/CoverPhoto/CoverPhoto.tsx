import photo from '@/assets/home_cover.jpg'

const CoverPhoto = () => {
  return (
    <div className="relative">
      <div className="max-h-220 overflow-hidden">
        <div
          className="w-screen h-96 md:h-[50rem]"
          style={{
            backgroundImage: `url(${photo.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>
      <div className="absolute bottom-10 left-10 text-shadow font-extrabold text-5xl md:text-7xl">
        Daniel Franzese
      </div>
    </div>
  )
}

export default CoverPhoto
