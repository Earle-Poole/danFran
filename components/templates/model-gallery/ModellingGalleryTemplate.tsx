import ModelGallery from '@/components/organisms/ModelGallery/ModelGallery'

const ModellingGalleryTemplate = () => {
  return (
    <div className="w-full flex-col mt-36 ">
      <p className="text-left text-3xl indent-2 md:text-5xl md:indent-14 pb-5">
        Daniel Franzese - Modelling Gallery
      </p>
      <p className="text-left text-lg indent-2 md:text-xl md:indent-14 italic">{`"You are you. Now, isn't that pleasant?" -Dr. Seuss`}</p>
      <ModelGallery />
    </div>
  )
}

export default ModellingGalleryTemplate
