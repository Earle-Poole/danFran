import Image from 'next/image'
import photo from '@/assets/about_me_photo1.jpg'
import photo2 from '@/assets/about_photo_2.jpg'
import photo3 from '@/assets/dot-light.png'
import design from '@/assets/zigzag.svg'
import SocialMediaLinks from '@/components/atoms/Icons/SocialMediaLinks'

const AboutDanny = () => {
  return (
    <div className='flex'>
      <div className='basis-2/5 relative pt-10'>
        <div className='z-30 absolute'>
          <Image src={photo} alt='about_me_photo1' />
        </div>
        <div
          style={{ backgroundImage: `url(${photo3.src})`, left:`${1/24*100}%`  }}
          className='z-20 absolute -top-14 scale-90 h-32 w-11/12'
        />
        <div className='absolute -top-8 z-10 scale-90'>
          <Image src={photo2} alt='about_photo_2' />
        </div>
      </div>
      <div className='flex basis-3/5 flex-col ml-9'>
        <p className='text-4xl'>{`Actor, Writer, Director, Comedian & Activist.`}</p>
        <div className='pt-4'>
          <Image src={design} alt='zigzag' layout='fixed'></Image>
        </div>
        <p className='text-2xl my-3 leading-relaxed '>
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
