import MyButton from "@/components/atoms/Button/Button";
import CoverPhoto from "@/components/atoms/CoverPhoto/CoverPhoto";
import SocialMediaLinks from "@/components/atoms/Icons/SocialMediaLinks";
import BookMeNow from "@/components/molecule/BusinessContactCard/BusinessContactCard";
import { urls, URLsValue } from "lib/constants";

const HomeTemplate = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <CoverPhoto />
      <div className="w-full max-w-7xl flex flex-col items-center">
        <div className="h-96 w-full">
          About Me Section
          <SocialMediaLinks />
        </div>
        <div className="h-96 w-full">
          <p>Sign up now to get early notifications of what I'm doing!</p>
          <MyButton href={urls.MAILCHIMP} name="Subscribe to Me" />
        </div>
        <div className="h-96 w-full">
          <BookMeNow />
          <p>Book your personalized video shoutout from me now!</p>
          <MyButton href={urls.CAMEO} name="Find Me On Cameo" />
        </div>
      </div>
    </div>
  );
};

export default HomeTemplate;
