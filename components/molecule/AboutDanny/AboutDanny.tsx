import Image from 'next/image'
import photo from '@/assets/about_me_photo1.webp'
import photo2 from '@/assets/about_photo_2.webp'
import photo3 from '@/assets/dot-light.webp'
import design from '@/assets/zigzag.svg'
import SocialMediaLinks from '@/components/atoms/Icons/SocialMediaLinks'
import { useState } from 'react'
import classNames from 'classnames'

const AboutDanny = () => {
  const [pictureSwapped, setPictureSwapped] = useState(false)

  const pictureClickHandler = () => {
    setPictureSwapped((prev) => !prev)
  }

  const frontPicture = 'z-30 relative top-6'
  const backPicture = 'absolute -top-8 md:-top-7 z-10 scale-90 hover:scale-95'

  return (
    <div className="flex flex-col md:flex-row md:items-center">
      <div
        className={classNames(
          'relative basis-2/5 mt-12 md:mt-0 md:mr-4 cursor-pointer'
        )}
        onClick={pictureClickHandler}
      >
        <div
          className={classNames(
            {
              [frontPicture]: !pictureSwapped,
              [backPicture]: pictureSwapped,
            },
            'transition'
          )}
        >
          <Image
            src={photo}
            alt="about_me_photo1"
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>
        <div
          style={{
            backgroundImage: `url(${photo3.src})`,
            left: `${(1 / 24) * 100}%`,
          }}
          className="z-20 absolute -top-11 lg:-top-10 scale-90 h-32 w-11/12 pointer-events-none"
        />
        <div
          className={classNames(
            {
              [frontPicture]: pictureSwapped,
              [backPicture]: !pictureSwapped,
            },
            'transition'
          )}
        >
          <Image
            src={photo2}
            alt="about_photo_2"
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>
      </div>
      <div className="flex flex-col flex-1 mt-8 md:mt-0 md:ml-4">
        <p className="text-4xl">{`Actor, Writer, Director, Comedian & Activist`}</p>
        <div className="pt-4 flex justify-center">
          <Image src={design} alt="zigzag"></Image>
        </div>
        <p className="text-xl md:text-2xl my-3 leading-relaxed">
          {`Best known for his roles in Larry Clark's "Bully", and as Damian in
          Tina Fey's "Mean Girls". Danny is the creator of several live comedy
          shows including rock opera "Jersey Shoresical: A Frickin' Rock
          Opera!", and his one-man stand-up performances "I've Never Really Made
          the Kind of Money to Become a Mess" and "Yass! You're Amazing!"`}
        </p>
        <SocialMediaLinks />
      </div>
    </div>
  )
}

export default AboutDanny
