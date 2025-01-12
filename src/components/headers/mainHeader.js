import Link from "next/link";

import { IoIosAddCircleOutline } from "react-icons/io";
import styles from "./mainHeader.module.css";

export default function MainHeader({ name, link }) {
  return (
    <header className={styles.head}>
      <h2>{name}</h2>

      <Link href={link}>
        <IoIosAddCircleOutline />
      </Link>
    </header>
  );
}
