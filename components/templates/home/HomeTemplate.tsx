import CoverPhoto from "@/components/atoms/CoverPhoto/CoverPhoto";
import SocialMediaLinks from "@/components/atoms/Icons/SocialMediaLinks";

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
          Newsletter Sign up Section
        </div>
        <div className="h-96 w-full">
          Book Me Section
          <SocialMediaLinks />
        </div>
      </div>
    </div>
  );
};

export default HomeTemplate;
