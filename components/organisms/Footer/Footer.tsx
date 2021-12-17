import SocialMediaLinks from "@/components/atoms/Icons/SocialMediaLinks";

const Footer = () => {
  return (
    <div className='bg-opacity-50 bg-gray-800'>
      <SocialMediaLinks />
      <p>© 2021 Daniel Franzese All Rights Reserved</p>
      <p>Website by 
      <a href="https://github.com/margarita-poole"> Margarita Poole</a>
      </p>
    </div>
  );
};

export default Footer;
