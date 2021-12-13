import classNames from "classnames";
import { FC } from "react";

interface MenuProps {
  isOpen: boolean;
}

const Menu: FC<MenuProps> = ({ isOpen }) => {
    const pattyClass = "w-4/5 border rounded-full my-1 self-center bg-white"
  return (
    <div className="flex flex-col w-10 box-border">
      {isOpen ? (
        <div className="text-3xl leading-none">&#10005;</div>
      ) : (
        <>
          <div className={pattyClass} />
          <div className={pattyClass} />
          <div className={pattyClass} />
        </>
      )}
    </div>
  );
};

export default Menu;
