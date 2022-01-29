import ModelGallery from '@/components/organisms/ModelGallery/ModelGallery'

const ModellingGalleryTemplate = () => {
  return (
    <div className="w-full flex-col mt-36">
      <p className="text-left text-3xl md:text-5xl indent-10 pb-5">
        Daniel Franzese - Modelling Gallery
      </p>
      <p className="text-left text-xl indent-10 italic">{`"You are you. Now, isn't that pleasant?" -Dr. Seuss`}</p>
      <ModelGallery />
    </div>
  )
}

export default ModellingGalleryTemplate
