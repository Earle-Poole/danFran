import Link from "next/link";

const SocialMediaLinks = () => {

  const socialMediaClassName = "odd:hover:text-pink-500 even:hover:text-cyan-400 transition duration-150"
  
    return (
    <div className="flex space-x-4 w-fit display-block mt-6 leading-6">
      <div className={socialMediaClassName}>
        <a href="https://twitter.com/WhatsupDanny">Twitter</a>
      </div>
      <div className={socialMediaClassName}>
        <a href="https://www.instagram.com/whatsupdanny/">Instagram</a>
      </div>
      <div className={socialMediaClassName}>
        <a href="https://www.linkedin.com/in/daniel-franzese-84126a57/">
          LinkedIn
        </a>
      </div>
      <div className={socialMediaClassName}>
        <a href="https://www.facebook.com/profile.php?id=659344013">Facebook</a>
      </div>
      <div className={socialMediaClassName}>
        <a href="https://www.imdb.com/name/nm0291881/">IMDB</a>
      </div>
    </div>
  );
};

export default SocialMediaLinks;
