import Menu from "@/components/atoms/Icons/Menu";
import { useState } from "react";
import Navigation from "./Navigation";

const HamburgerNavigation = () => {
  const [hamNavOpen, setHamNavOpen] = useState(false);

  const handleToggle = () => {
    setHamNavOpen((prev) => !prev);
  };

  return (
    <>
      <button className="absolute top-10 right-4" onClick={handleToggle}>
        <Menu isOpen={hamNavOpen} />
      </button>
      {hamNavOpen ? <Navigation /> : ""}
    </>
  );
};

export default HamburgerNavigation;
