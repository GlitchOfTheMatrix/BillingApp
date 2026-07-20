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

export interface PaymentListResponse {
  data: Payment[] | null;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export type PaymentPayload = Omit<Payment, "id" | "created_at" | "updated_at">;
