import styles from "./stripes.module.css";
import classNames from "classnames";

const Stripes = () => {
  return <div className={classNames(styles.stripes, "h-24")} />;
};

export default Stripes;
