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
    <Link href={href} passHref>
      <a className="flex odd:hover:text-pink-500 even:hover:text-cyan-400">
        <div className="font-light p-3 self-center transition duration-150 hover:underline">
          onClick={onClickHandler}
          {name}
        </div>
      </a>
    </Link>
  );
};

export default MyButton;
