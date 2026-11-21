import { Container } from '@/components/ui'
import { PhotoGallery } from '@/components/gallery'
import { orderedModelingGalleryPhotos } from '@/components/gallery/modelingPhotos'
import { headshotPhotos } from 'lib/content/photos'
import styles from './ModelingGalleryTemplate.module.css'

const ModelingGalleryTemplate = () => {
  return (
    <div>
      <Container className={styles.pageHeader}>
        <p className={styles.eyebrow}>Daniel Franzese / Portraits &amp; editorial</p>
        <h1 className={styles.title} data-route-heading="true">In focus.</h1>
        <p className={styles.intro}>
          New headshots and editorial portraits, followed by Daniel’s modeling collection.
        </p>
      </Container>
      <PhotoGallery
        photos={headshotPhotos}
        heading="Fall 2026 headshots"
        description="A fresh collection of headshots and portraits. Select a photo to see it in full."
        downloadLabel="Download photo"
        id="current-headshots"
      />
      <PhotoGallery
        photos={orderedModelingGalleryPhotos}
        heading="Portraits &amp; editorial"
        description="Select any image to view the complete uncropped original. Downloads remain deliberate actions, while the collection stays in a predictable reading order."
        id="modeling-collection"
      />
    </div>
  )
}

export default ModelingGalleryTemplate
