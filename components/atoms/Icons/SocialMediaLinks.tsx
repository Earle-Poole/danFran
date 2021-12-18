import Facebook from '@/assets/svg/facebook';
import Instagram from '@/assets/svg/instagram';
import LinkedIn from '@/assets/svg/linkedin';
import Twitter from '@/assets/svg/twitter';
import IMDB from '@/assets/svg/imdb';

const commonSVGProps = {
  color: '#fff',
  width: 20,
  height: 20,
};

const socialMediaLinks = [
  {
    url: 'https://www.facebook.com/profile.php?id=659344013',
    icon: <Facebook {...commonSVGProps} />,
    name: 'Facebook',
  },
  {
    url: 'https://www.instagram.com/whatsupdanny/',
    icon: <Instagram {...commonSVGProps} />,
    name: 'Instagram',
  },
  {
    url: 'https://www.linkedin.com/in/daniel-franzese-84126a57/',
    icon: <LinkedIn {...commonSVGProps} />,
    name: 'LinkedIn',
  },
  {
    url: 'https://www.twitter.com/WhatsupDanny',
    icon: <Twitter {...commonSVGProps} />,
    name: 'Twitter',
  },
  {
    url: 'https://www.imdb.com/name/nm0291881/',
    icon: <IMDB {...commonSVGProps} />,
    name: 'IMDB',
  },
];

const SocialMediaLinks = () => {
  const socialMediaClassName =
    'odd:hover:text-pink-500 even:hover:text-cyan-400 transition duration-150 mx-4';

  return (
    <div className='flex w-fit mx-auto'>
      {socialMediaLinks.map((socialMediaLink) => {
        return (
          <div className={socialMediaClassName} key={socialMediaLink.name}>
            <a href={socialMediaLink.url}>{socialMediaLink.icon}</a>
          </div>
        );
      })}
    </div>
  );
};

export default SocialMediaLinks;
