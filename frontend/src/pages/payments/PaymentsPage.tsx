import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PaymentForm from "../../features/payments/components/PaymentForm/PaymentForm";
import {
  createPayment,
  deletePayment,
  getPayments,
  updatePayment,
} from "../../features/payments/api/paymentApi";
import type { Payment } from "../../features/payments/types";
import type { PaymentFormValues } from "../../features/payments/schemas/paymentSchema";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import Card, { CardHeader, CardActions } from "../../components/common/Card/Card";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import Button from "../../components/common/Button/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import { useLoader } from "../../contexts/LoaderContext";
import styles from "./PaymentsPage.module.css";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      showLoader();
      const response = await getPayments();
      setPayments(response.data ?? []);
    } catch {
      toast.error("Failed to load payments.");
    } finally {
      hideLoader();
    }
  }

  async function handleSubmit(values: PaymentFormValues) {
    try {
      showLoader();

      if (selectedPayment) {
        await updatePayment(selectedPayment.id, values);
        toast.success("Payment updated successfully");
      } else {
        await createPayment(values);
        toast.success("Payment created successfully");
      }

      setSelectedPayment(null);
      await loadPayments();
    } catch {
      toast.error("Failed to save payment.");
      hideLoader();
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      showLoader();
      await deletePayment(deleteTarget.id);
      toast.success("Payment deleted successfully");
      if (selectedPayment?.id === deleteTarget.id) {
        setSelectedPayment(null);
      }
      setDeleteTarget(null);
      await loadPayments();
    } catch {
      toast.error("Failed to delete payment.");
      hideLoader();
    }
  }

  function handleCancelEdit() {
    setSelectedPayment(null);
  }

  return (
    <>
      <PageHeader title="Payments" />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {selectedPayment ? "Edit Payment" : "Record Payment"}
        </h2>
        <PaymentForm
          initialData={selectedPayment ?? undefined}
          onSubmit={handleSubmit}
          onCancel={selectedPayment ? handleCancelEdit : undefined}
        />
      </div>

      <hr />

      <div className={styles.section}>
        {payments.length === 0 ? (
          <EmptyState
            icon="💰"
            title="No payments recorded"
            message="Record your first payment using the form above."
          />
        ) : (
          <div className={styles.listGrid}>
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader
                  title={`₹${payment.amount}`}
                  subtitle={payment.payment_date}
                />
                <div className={styles.paymentMeta}>
                  <span>Mode: {payment.mode}</span>
                  <span>Status: {payment.status}</span>
                  {payment.bank_name && <span>Bank: {payment.bank_name}</span>}
                </div>
                <CardActions>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteTarget(payment)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Payment"
        message={`Are you sure you want to delete this ₹${deleteTarget?.amount} payment? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
