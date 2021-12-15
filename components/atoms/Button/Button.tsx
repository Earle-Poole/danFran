import { URLsValue } from "lib/constants";
import Link from "next/link";
import { FC } from "react";

type MyButtonProps = {
  name: string;
  href: URLsValue;
};


const MyButton: FC<MyButtonProps> = ({ name, href }) => {
    const onClickHandler = () => {
      window.open(href);
    };
  return (
    <button type="button" onClick={onClickHandler}>
      {name}
    </button>
  );
};

export default MyButton;
