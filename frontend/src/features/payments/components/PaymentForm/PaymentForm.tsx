import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  paymentSchema,
  type PaymentFormValues,
} from "../../schemas/paymentSchema";
import type { Payment } from "../../types";
import styles from "./PaymentForm.module.css";

interface Props {
  readonly initialData?: Payment;
  readonly isSubmitting: boolean;
  readonly onSubmit: (values: PaymentFormValues) => Promise<void>;
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
  isSubmitting,
  onSubmit,
}: Props) {
  const { register, reset, handleSubmit } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),

    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Invoice ID" {...register("invoice_id")} />

      <input type="date" {...register("payment_date")} />

      <input placeholder="Amount" {...register("amount")} />

      <input placeholder="Mode" {...register("mode")} />

      <input placeholder="UTR Number" {...register("utr_number")} />

      <input placeholder="Bank Name" {...register("bank_name")} />

      <input placeholder="Status" {...register("status")} />

      <textarea placeholder="Remarks" {...register("remarks")} />

      <button disabled={isSubmitting} type="submit">
        Save
      </button>
    </form>
  );
}
