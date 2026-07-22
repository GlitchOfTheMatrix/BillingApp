import { z } from "zod";

export const documentItemSchema = z.object({
  serial_no: z.number(),
  software_name: z.string(),
  description: z.string(),
  hsn_code: z.string(),
  license_type: z.string(),
  subscription_duration: z.string(),
  quantity: z.number().min(1),
  unit: z.string(),
  rate: z.string(),
  discount: z.string(),
  tax_rate: z.string(),
  total: z.string(),
  extra: z.record(z.string(), z.unknown()),
});

export const documentSchema = z.object({
  document_type: z.enum(["quotation", "proforma", "tax_invoice"]),
  document_number: z.string().min(1, "Document number is required"),
  document_date: z.string().min(1, "Document date is required"),
  client_id: z.string().min(1, "Client is required"),
  order_number: z.string().optional().or(z.literal("")),
  order_date: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "sent", "accepted", "paid", "cancelled"]),
  subtotal: z.string(),
  shipping: z.string(),
  discount: z.string(),
  cgst: z.string(),
  sgst: z.string(),
  igst: z.string(),
  grand_total: z.string(),
  amount_in_words: z.string(),
  remarks: z.string(),
  items: z.array(documentItemSchema),
});

export type DocumentFormValues = z.infer<typeof documentSchema>;
