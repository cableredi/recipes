import styles from "./subHeader.module.css";

export default function SubHeader({ name }) {
  return (
    <header className={styles.head}>
      <h2>{name}</h2>
    </header>
  );
}
