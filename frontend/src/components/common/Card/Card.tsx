import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  readonly children: ReactNode;
  readonly className?: string;
}

interface CardHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
}

interface CardActionsProps {
  readonly children: ReactNode;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle }: CardHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}

export function CardActions({ children }: CardActionsProps) {
  return <div className={styles.actions}>{children}</div>;
}
