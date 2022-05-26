import ModelGallery from '@/components/organisms/ModelGallery/ModelGallery'

const ModelingGalleryTemplate = () => {
  return (
    <div className="w-full flex-col mt-36">
      <p className="text-left text-3xl md:text-5xl ml-4 md:ml-10 pb-5">
        Daniel Franzese - Modeling Gallery
      </p>
      <p className="text-left text-xl ml-4 md:ml-10 italic">{`"You are you. Now, isn't that pleasant?" -Dr. Seuss`}</p>
      <ModelGallery />
    </div>
  )
}

export default ModelingGalleryTemplate
