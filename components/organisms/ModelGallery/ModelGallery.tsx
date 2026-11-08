import { PhotoGallery } from '@/components/gallery'
import { curatedModelingGalleryIds, orderedModelingGalleryPhotos } from '@/components/gallery/modelingPhotos'

/** Compatibility entry point for legacy imports; the gallery implementation lives in components/gallery. */
const ModelGallery = () => (
  <PhotoGallery
    photos={orderedModelingGalleryPhotos}
    featuredIds={curatedModelingGalleryIds}
    id="modeling-collection"
  />
)

export default ModelGallery
