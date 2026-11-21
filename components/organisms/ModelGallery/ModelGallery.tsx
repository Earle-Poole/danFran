import { PhotoGallery } from '@/components/gallery'
import { orderedModelingGalleryPhotos } from '@/components/gallery/modelingPhotos'

/** Compatibility entry point for legacy imports; the gallery implementation lives in components/gallery. */
const ModelGallery = () => (
  <PhotoGallery
    photos={orderedModelingGalleryPhotos}
    id="modeling-collection"
  />
)

export default ModelGallery
