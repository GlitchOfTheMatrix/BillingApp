import RegisterForm from "../../features/auth/components/RegisterForm/RegisterForm";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <RegisterForm />
    </main>
  );
}
