import Image from 'next/image';
import photo from '@/assets/about_me_photo1.jpg';
import design from '@/assets/zigzag.svg';
import SocialMediaLinks from '@/components/atoms/Icons/SocialMediaLinks';

const AboutDanny = () => {
  return (
    <div className='flex'>
      <Image
        src={photo}
        alt='about_me_photo1'
        className='flex-1'
      />
      <div className='flex flex-col w-220 p-5'>
        <p className='text-4xl'>Actor, Writer, Director, Comedian & Activist.</p>
        <Image src={design} alt='zigzag' className='my-6'></Image>
        <p className=''>
          Best known for his roles in Larry Clark's "Bully", and as Damian in
          Tina Fey's "Mean Girls". Danny is the creator of several live comedy
          shows including rock opera "Jersey Shoresical: A Frickin' Rock
          Opera!", and his one-man stand-up performances "I've Never Really Made
          the Kind of Money to Become a Mess" and "Yass! You're Amazing!"
        </p>
        <SocialMediaLinks />
      </div>
    </div>
  );
};

export default AboutDanny;
