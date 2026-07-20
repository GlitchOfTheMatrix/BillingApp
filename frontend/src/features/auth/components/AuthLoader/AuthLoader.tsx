import styles from "./AuthLoader.module.css";

export default function AuthLoader() {
  return (
    <div className={styles.container} role="status" aria-label="Authenticating">
      <div className={styles.spinner} />
      <p>Loading...</p>
    </div>
  );
}
