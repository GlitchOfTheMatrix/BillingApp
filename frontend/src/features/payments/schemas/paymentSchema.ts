import { z } from "zod";

export const paymentSchema = z.object({
  invoice_id: z.uuid(),
  payment_date: z.string(),
  amount: z.string(),
  mode: z.string().min(1),
  utr_number: z.string(),
  bank_name: z.string(),
  status: z.string().min(1),
  remarks: z.string(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
