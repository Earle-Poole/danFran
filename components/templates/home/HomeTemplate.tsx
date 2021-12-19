import MyButton from '@/components/atoms/Button/Button';
import ContentSectionWrapper from '@/components/organisms/ContentSectionWrapper/ContentSectionWrapper';
import CoverPhoto from '@/components/atoms/CoverPhoto/CoverPhoto';
import SocialMediaLinks from '@/components/atoms/Icons/SocialMediaLinks';
import AboutDanny from '@/components/molecule/AboutDanny/AboutDanny';
import BookMeNow from '@/components/molecule/BusinessContactCard/BusinessContactCard';
import { urls } from 'lib/constants';

const HomeTemplate = () => {
  return (
    <div className='w-full flex flex-col items-center'>
      <CoverPhoto />
      <div className='w-full max-w-7xl flex flex-col items-center'>
        <ContentSectionWrapper wrapperBackgroundColor='bg-white/5'>
          <AboutDanny />
        </ContentSectionWrapper>
        <ContentSectionWrapper wrapperBackgroundColor='bg-black'>
          <p className='text-center text-2xl'>
            Sign up now to get early notifications of what I&apos;m doing!
          </p>
          <div className='flex mx-auto w-fit my-4'>
            <input
              type='email'
              placeholder='email'
              className='w-80 text-black text-xl p-2'
            ></input>
            <MyButton href={urls.MAILCHIMP} name='Subscribe to Me' />
          </div>
        </ContentSectionWrapper>
        <ContentSectionWrapper wrapperBackgroundColor='bg-white/5'>
          <BookMeNow />
          <div className='flex flex-col items-center mx-auto text-2xl my-20 w-fit'>
            <p className='my-4'>
              Book your personalized video shoutout from me now!
            </p>
            <MyButton href={urls.CAMEO} name='Find Me On Cameo' />
          </div>
        </ContentSectionWrapper>
      </div>
    </div>
  );
};

export default HomeTemplate;
