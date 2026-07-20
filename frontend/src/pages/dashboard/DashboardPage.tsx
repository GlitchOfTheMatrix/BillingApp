import { Link } from "react-router-dom";
import { ROUTES } from "../../app/router/routes";
import { useAuth } from "../../features/auth/hooks/useAuth";
import styles from "./DashboardPage.module.css";

const QUICK_LINKS = [
  {
    icon: "👥",
    label: "Clients",
    description: "Manage your clients",
    path: ROUTES.CLIENTS,
  },
  {
    icon: "📄",
    label: "Documents",
    description: "Invoices & quotations",
    path: ROUTES.DOCUMENTS,
  },
  {
    icon: "💰",
    label: "Payments",
    description: "Track payments",
    path: ROUTES.PAYMENTS,
  },
  {
    icon: "🏢",
    label: "Company",
    description: "Business details",
    path: ROUTES.COMPANY,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.greeting}>
        Welcome{user?.name ? `, ${user.name}` : ""}
      </h1>
      <p className={styles.subtitle}>
        What would you like to do today?
      </p>

      <div className={styles.quickLinks}>
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={styles.linkCard}
          >
            <span className={styles.linkIcon} aria-hidden="true">{link.icon}</span>
            <span className={styles.linkLabel}>{link.label}</span>
            <span className={styles.linkDesc}>{link.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
