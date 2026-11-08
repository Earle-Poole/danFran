import { Container } from '@/components/ui'
import { PhotoGallery } from '@/components/gallery'
import { curatedModelingGalleryIds, orderedModelingGalleryPhotos } from '@/components/gallery/modelingPhotos'
import styles from './ModelingGalleryTemplate.module.css'

const ModelingGalleryTemplate = () => {
  return (
    <div>
      <Container className={styles.pageHeader}>
        <p className={styles.eyebrow}>Daniel Franzese / Portraits &amp; editorial</p>
        <h1 className={styles.title} data-route-heading="true">In focus.</h1>
        <p className={styles.intro}>
          A considered collection of original portraits. Start with a curated opening, then browse all 24 modeling photographs in their source order.
        </p>
      </Container>
      <PhotoGallery
        photos={orderedModelingGalleryPhotos}
        heading="Portraits &amp; editorial"
        description="Select any image to view the complete uncropped original. Downloads remain deliberate actions, while the collection stays in a predictable reading order."
        featuredIds={curatedModelingGalleryIds}
        id="modeling-collection"
      />
    </div>
  )
}

export default ModelingGalleryTemplate
