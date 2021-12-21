import MyButton from '@/components/atoms/Button/Button';
import SocialMediaLinks from '@/components/atoms/Icons/SocialMediaLinks';
import { slugs } from 'lib/constants';

const Footer = () => {
  return (
    <div className='bg-white/5 flex flex-col w-full items-center mt-12 py-16 text-lg font-sans'>
      <MyButton href={slugs.HOME} name='UP' />
      <SocialMediaLinks />
      <p className='mt-3'>
        © 2021
        <span className='text-orange-400 text-3xl'> Daniel Franzese </span>
        All Rights Reserved
      </p>
      <p>
        Website by
        <a href='https://github.com/margarita-poole' className='font-bold'>
          {' '}
          Margarita Poole
        </a>
      </p>
    </div>
  );
};

export default Footer;
