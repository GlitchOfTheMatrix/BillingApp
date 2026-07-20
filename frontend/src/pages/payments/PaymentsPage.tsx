import { useEffect, useState } from "react";

import PaymentForm from "../../features/payments/components/PaymentForm/PaymentForm";
import {
  createPayment,
  deletePayment,
  getPayments,
  updatePayment,
} from "../../features/payments/api/paymentApi";
import type { Payment } from "../../features/payments/types";
import type { PaymentFormValues } from "../../features/payments/schemas/paymentSchema";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      const response = await getPayments();

      setPayments(response.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(values: PaymentFormValues) {
    try {
      setSaving(true);

      if (selectedPayment) {
        await updatePayment(selectedPayment.id, values);
      } else {
        await createPayment(values);
      }

      await loadPayments();

      setSelectedPayment(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deletePayment(id);

    await loadPayments();

    if (selectedPayment?.id === id) {
      setSelectedPayment(null);
    }
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <h1>Payments</h1>

      <PaymentForm
        initialData={selectedPayment ?? undefined}
        isSubmitting={saving}
        onSubmit={handleSubmit}
      />

      <hr />

      {payments.map((payment) => (
        <div key={payment.id}>
          <h3>₹{payment.amount}</h3>

          <p>{payment.mode}</p>

          <p>{payment.status}</p>

          <button onClick={() => setSelectedPayment(payment)}>Edit</button>

          <button onClick={() => handleDelete(payment.id)}>Delete</button>
        </div>
      ))}
    </>
  );
}
