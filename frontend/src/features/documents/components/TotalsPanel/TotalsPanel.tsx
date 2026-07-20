import styles from "./TotalsPanel.module.css";

interface Props {
  readonly subtotal: string;
  readonly grandTotal: string;
}

export default function TotalsPanel({ subtotal, grandTotal }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.row}>
        <span className={styles.label}>Subtotal</span>
        <span className={styles.value}>₹{subtotal}</span>
      </div>

      <div className={`${styles.row} ${styles.grandTotal}`}>
        <span className={styles.label}>Grand Total</span>
        <span className={styles.value}>₹{grandTotal}</span>
      </div>
    </div>
  );
}
