import type { PaginatedResponse } from "../../types/api";

export interface Payment {
  id: string;
  invoice_id: string;
  payment_date: string;
  amount: string;
  mode: string;
  utr_number: string;
  bank_name: string;
  status: string;
  remarks: string;
  created_at: string;
  updated_at: string;
}

export type PaymentListResponse = PaginatedResponse<Payment>;

export type PaymentPayload = Omit<Payment, "id" | "created_at" | "updated_at">;
