import Image from "next/image";
import photo from "@/assets/home_cover.jpg";

const CoverPhoto = () => {
  return (
    <div className="relative w-screen">
      <Image src={photo} alt="cover-photo" />
      <div className="absolute bottom-10 left-10 text-shadow font-extrabold text-9xl">
          Daniel Franzese
      </div>
    </div>
  );
};

export default CoverPhoto;
