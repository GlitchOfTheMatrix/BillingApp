import LoginForm from "../../features/auth/components/LoginForm/LoginForm";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <LoginForm />
    </main>
  );
}
