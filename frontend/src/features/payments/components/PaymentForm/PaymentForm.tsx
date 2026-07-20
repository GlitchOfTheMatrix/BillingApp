import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  paymentSchema,
  type PaymentFormValues,
} from "../../schemas/paymentSchema";
import type { Payment } from "../../types";
import FormField from "../../../../components/common/FormField/FormField";
import Button from "../../../../components/common/Button/Button";
import styles from "./PaymentForm.module.css";

interface Props {
  readonly initialData?: Payment;
  readonly onSubmit: (values: PaymentFormValues) => Promise<void>;
  readonly onCancel?: () => void;
}

const EMPTY_VALUES: PaymentFormValues = {
  invoice_id: "",
  payment_date: "",
  amount: "",
  mode: "",
  utr_number: "",
  bank_name: "",
  status: "",
  remarks: "",
};

export default function PaymentForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset(EMPTY_VALUES);
    }
  }, [initialData, reset]);

  async function onFormSubmit(values: PaymentFormValues) {
    await onSubmit(values);
    if (!initialData) {
      reset(EMPTY_VALUES);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onFormSubmit)}>
      <FormField label="Invoice ID" htmlFor="pay-invoice" error={errors.invoice_id?.message} required>
        <input id="pay-invoice" placeholder="Invoice UUID" {...register("invoice_id")} />
      </FormField>

      <FormField label="Payment Date" htmlFor="pay-date" error={errors.payment_date?.message} required>
        <input id="pay-date" type="date" {...register("payment_date")} />
      </FormField>

      <FormField label="Amount" htmlFor="pay-amount" error={errors.amount?.message} required>
        <input id="pay-amount" placeholder="0.00" {...register("amount")} />
      </FormField>

      <FormField label="Mode" htmlFor="pay-mode" error={errors.mode?.message} required>
        <select id="pay-mode" {...register("mode")}>
          <option value="">Select mode</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="upi">UPI</option>
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
        </select>
      </FormField>

      <FormField label="UTR Number" htmlFor="pay-utr" error={errors.utr_number?.message}>
        <input id="pay-utr" placeholder="Transaction reference" {...register("utr_number")} />
      </FormField>

      <FormField label="Bank Name" htmlFor="pay-bank" error={errors.bank_name?.message}>
        <input id="pay-bank" placeholder="Bank name" {...register("bank_name")} />
      </FormField>

      <FormField label="Status" htmlFor="pay-status" error={errors.status?.message} required>
        <select id="pay-status" {...register("status")}>
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </FormField>

      <div className={styles.fullWidth}>
        <FormField label="Remarks" htmlFor="pay-remarks" error={errors.remarks?.message}>
          <textarea id="pay-remarks" placeholder="Optional notes" {...register("remarks")} />
        </FormField>
      </div>

      <div className={styles.actions}>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? "Update Payment" : "Record Payment"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
