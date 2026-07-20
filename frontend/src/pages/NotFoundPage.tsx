import { Link } from "react-router-dom";
import { ROUTES } from "../app/router/routes";
import Button from "../components/common/Button/Button";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.message}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to={ROUTES.DASHBOARD}>
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
