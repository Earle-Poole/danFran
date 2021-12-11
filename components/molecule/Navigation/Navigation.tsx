import NavItem from "@/components/atoms/NavItem/NavItem";
import { slugs, urls } from "lib/constants";
import Link from "next/link";

const Navigation = () => {
  return (
    <nav className="flex flex-wrap justify-end items-stretch">
      <Link href={slugs.HOME} passHref>
        <a className="flex">
          <NavItem name={slugs.toLabel(slugs.HOME)} />
        </a>
      </Link>
      <Link href={"/#about"} passHref>
        <a className="flex">
          <NavItem name={"About"} />
        </a>
      </Link>
      <Link href={slugs.PRESS_KIT} passHref>
        <a className="flex">
          <NavItem name={slugs.toLabel(slugs.PRESS_KIT)} />
        </a>
      </Link>
      <Link href={slugs.MODELLING_GALLERY} passHref>
        <a className="flex">
          <NavItem name={slugs.toLabel(slugs.MODELLING_GALLERY)} />
        </a>
      </Link>
      <Link href={slugs.VIDEO_GALLERY} passHref>
        <a className="flex">
          <NavItem name={slugs.toLabel(slugs.VIDEO_GALLERY)} />
        </a>
      </Link>
      <Link href={urls.CALENDAR} passHref>
        <a className="flex" target="_blank" rel="noopener noreferrer">
          <NavItem name={"Calender"} />
        </a>
      </Link>
      <Link href={urls.STORE} passHref>
        <a className="flex" target="_blank" rel="noopener noreferrer">
          <NavItem name={"Store"} />
        </a>
      </Link>
      <Link href={"/#contact"} passHref>
        <a className="flex">
          <NavItem name={"Book Me Now!"} />
        </a>
      </Link>
    </nav>
  );
};

export default Navigation;
