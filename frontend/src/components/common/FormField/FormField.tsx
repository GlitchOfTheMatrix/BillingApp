import type { ReactNode } from "react";
import styles from "./FormField.module.css";

interface FormFieldProps {
  readonly label: string;
  readonly htmlFor?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly children: ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      {children}

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
