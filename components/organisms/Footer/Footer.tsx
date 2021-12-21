import MyButton from '@/components/atoms/Button/Button';
import SocialMediaLinks from '@/components/atoms/Icons/SocialMediaLinks';
import { slugs } from 'lib/constants';

const Footer = () => {
 
 
  return (
    <div className='bg-white/5 flex flex-col w-full items-center mt-12 py-16 text-lg font-sans'>
      <a
        className='flex text-2xl hover:bg-pink-500 bg-cyan-400 transition duration-150 w-fit font-light p-3 self-center hover:underline'
        onClick={() => {}}
      >
        UP
      </a>
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
