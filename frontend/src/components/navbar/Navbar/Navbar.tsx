import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../../app/router/routes";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import Button from "../../common/Button/Button";
import styles from "./Navbar.module.css";

interface NavbarProps {
  readonly onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
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
      <button
        className={styles.menuButton}
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
      >
        <svg
          className={styles.menuIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <div className={styles.userInfo}>
        <span className={styles.userName}>{user?.name}</span>
        <span className={styles.userRole}>{user?.role}</span>
      </div>

      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
}
