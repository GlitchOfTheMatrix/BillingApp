import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.loaderOverlay} aria-label="Loading" role="status">
      <div className={styles.spinner} />
    </div>
  );
}
