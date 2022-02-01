import PressGallery from '@/components/organisms/PressGallery/PressGallery'

const PressKitTemplate = () => {
  return (
    <div id="press-kit" className="w-full flex justify-center">
      <div className="w-full max-w-7xl flex flex-col items-center">
        <div className="mt-36">
          <p className="text-left text-3xl md:text-5xl ml-4 md:ml-10 pb-5">
            Daniel Franzese - Press Kit
          </p>
          <p className="text-left text-xl ml-4 md:ml-10 italic flex-wrap md:w-3/5">{`"Tolerance is the positive and cordial effort to understand another's beliefs, practices, and habits without necessarily sharing or accepting them. " -Joshua Liebman`}</p>
        </div>
        <PressGallery />
      </div>
    </div>
  )
}

export default PressKitTemplate
