import type { CSSProperties, ImgHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import styles from './ui.module.css'

export type PhotoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'> & {
  src: string
  alt: string
  width: number
  height: number
  sizes?: string
  crop?: 'cover' | 'contain'
  frameRatio?: number | string
  objectPosition?: string
  caption?: ReactNode
  credit?: ReactNode
  className?: string
}

export const Photo = forwardRef<HTMLImageElement, PhotoProps>(function Photo(
  {
    src,
    alt,
    width,
    height,
    sizes,
    crop = 'cover',
    frameRatio,
    objectPosition = '50% 50%',
    caption,
    credit,
    className = '',
    loading = 'lazy',
    decoding = 'async',
    ...props
  },
  ref,
) {
  const ratio = `${width} / ${height}`
  const resolvedFrameRatio = frameRatio ?? ratio

  return (
    <figure className={`${styles.photo} ${className}`}>
      <div className={styles.photoFrame} style={{ aspectRatio: crop === 'cover' ? resolvedFrameRatio : undefined }}>
        <img
          ref={ref}
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          decoding={decoding}
          className={styles.photoImage}
          data-crop={crop}
          style={{ objectPosition, '--photo-ratio': ratio } as CSSProperties}
          {...props}
        />
      </div>
      {caption || credit ? (
        <figcaption className={styles.caption}>
          {caption}
          {credit ? <span className={styles.credit}>{credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
})

Photo.displayName = 'Photo'
