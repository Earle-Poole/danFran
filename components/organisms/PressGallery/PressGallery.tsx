import Image from 'next/image'
import { FC } from 'react'
import DanFranPressPhoto0 from '/public/assets/press_kit/pressPhotos/DanFran-press-photo0.jpg'
import DanFranPressPhoto1 from '/public/assets/press_kit/pressPhotos/DanFran-press-photo1.png'
import DanFranPressPhoto2 from '/public/assets/press_kit/pressPhotos/DanFran-press-photo2.png'
import DanFranPressPhoto3 from '/public/assets/press_kit/pressPhotos/DanFran-press-photo3.jpg'
import DanFranPressPhoto4 from '/public/assets/press_kit/pressPhotos/DanFran-press-photo4.jpg'
import DanFranPressPhoto5 from '/public/assets/press_kit/pressPhotos/DanFran-press-photo5.jpg'
import DanFranPressPhoto6 from '/public/assets/press_kit/pressPhotos/DanFran-press-photo6.jpg'
import DanFranPressPhoto7 from '/public/assets/press_kit/pressPhotos/DanFran-press-photo7.png'
import DanFranPressPhoto8 from '/public/assets/press_kit/pressPhotos/DanFran-press-photo8.png'

type PressGalleryProps = {
  pressPhotos: StaticImageData[]
  index: number
}

const PressGallery: FC<PressGalleryProps> = ({ index }) => {
  const pressPhotoList = [
    DanFranPressPhoto0,
    DanFranPressPhoto1,
    DanFranPressPhoto2,
    DanFranPressPhoto3,
    DanFranPressPhoto4,
    DanFranPressPhoto5,
    DanFranPressPhoto6,
    DanFranPressPhoto7,
    DanFranPressPhoto8,
  ]
  return <div></div>
}

export default PressGallery
