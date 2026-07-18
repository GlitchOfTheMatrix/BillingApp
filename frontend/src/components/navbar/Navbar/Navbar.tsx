import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../../app/router/routes";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  function handleLogout() {
    logout();

    navigate(ROUTES.LOGIN, {
      replace: true,
    });
  }

  return (
    <header className={styles.navbar}>
      <div>
        <h3>{user?.name}</h3>

        <p>{user?.role}</p>
      </div>

      <button onClick={handleLogout} className={styles.button}>
        Logout
      </button>
    </header>
  );
}
