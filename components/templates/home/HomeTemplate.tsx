import MyButton from "@/components/atoms/Button/Button";
import CoverPhoto from "@/components/atoms/CoverPhoto/CoverPhoto";
import SocialMediaLinks from "@/components/atoms/Icons/SocialMediaLinks";
import BookMeNow from "@/components/molecule/BusinessContactCard/BusinessContactCard";

const HomeTemplate = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <CoverPhoto />
      <div className="w-full max-w-7xl flex flex-col items-center">
        <div className="h-96 w-full">
          About Me Section
          <SocialMediaLinks />
        </div>
        <div className="h-96 w-full">Newsletter Sign up Section</div>
        <div className="h-96 w-full">
          <BookMeNow />
          <p>Book your personalized video shoutout from me now!</p>
          <MyButton />
        </div>
        <div>
          <SocialMediaLinks />
        </div>
      </div>
    </div>
  );
};

export default HomeTemplate;
