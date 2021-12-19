import Image from 'next/image';
import photo from '@/assets/about_me_photo1.jpg';
import SocialMediaLinks from '@/components/atoms/Icons/SocialMediaLinks';

const AboutDanny = () => {
  return (
    <div className='flex flex-row justify-center w-fit mx-auto'>
      <div></div>
      <Image src={photo} alt='about_me_photo1' />
      <div>
        Daniel Franzese Bio
        <SocialMediaLinks />
      </div>
    </div>
  );
};

export default AboutDanny;
