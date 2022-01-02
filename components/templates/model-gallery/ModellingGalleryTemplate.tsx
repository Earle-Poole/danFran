import ModelGalleryComponent from '@/components/molecule/ModelGallery/ModelGallery'

const ModellingGalleryTemplate = () => {
  return (
    <div className="w-full flex-col mt-36 ">
      <p className="text-left text-5xl indent-14 pb-3">
        Daniel Franzese - Modelling Gallery
      </p>
      <p className="text-left text-xl indent-14 italic">{`"You are you. Now, isn't that pleasant?" -Dr. Seuss`}</p>
      <div className='border-4 border-red-700 mt-24'>
      <ModelGalleryComponent />
      </div>
    </div>
  )
}

export default ModellingGalleryTemplate
