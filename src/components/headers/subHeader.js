import styles from "./subHeader.module.css";

export default function SubHeader(props) {
  const name = props.name;

  return (
    <header className={styles.head}>
      <h2>{name}</h2>
    </header>
  );
}
