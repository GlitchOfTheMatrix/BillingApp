import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  readonly icon?: string;
  readonly title: string;
  readonly message?: string;
  readonly children?: ReactNode;
}

export default function EmptyState({
  icon = "📋",
  title,
  message,
  children,
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon} aria-hidden="true">
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
      {children}
    </div>
  );
}
