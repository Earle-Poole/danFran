import Image, { StaticImageData } from "next/image";
import { FC } from 'react'

type PressPictureProps = {
  pressPhoto: StaticImageData
}

const PressPicture: FC<PressPictureProps> = ({ pressPhoto }) => {
  const photoSrcSplit = pressPhoto.src.split('/')
  const filename = photoSrcSplit[photoSrcSplit.length - 1].split('.')[0]

  return (
    <div className={'flex-col relative'}>
      <Image
        src={pressPhoto}
        alt={`Press Photo: ${filename}`}
        placeholder="blur"
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto"
        }} />
    </div>
  );
}

export default PressPicture
