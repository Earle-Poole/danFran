import Image from 'next/image'
import { specialTeaserPosterPath } from 'lib/content/downloads'
import styles from './MiniDiscArtwork.module.css'

export function MiniDiscArtwork({ className }: { className?: string }) {
  return (
    <div className={`${styles.artwork} ${className ?? ''}`} aria-hidden="true">
      <div className={styles.disc} />
      <div className={styles.sleeve}>
        <Image src={specialTeaserPosterPath} alt="" width={1280} height={720} loading="lazy" />
      </div>
    </div>
  )
}
