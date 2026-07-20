export type DocumentType = "quotation" | "proforma" | "tax_invoice";

export type DocumentStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "paid"
  | "cancelled";

export interface DocumentItem {
  id?: string;
  document_id?: string;
  serial_no: number;
  software_name: string;
  description: string;
  hsn_code: string;
  license_type: string;
  subscription_duration: string;
  quantity: number;
  unit: string;
  rate: string;
  discount: string;
  tax_rate: string;
  total: string;
  extra: Record<string, unknown>;
}

export interface Document {
  id: string;
  document_type: DocumentType;
  document_number: string;
  document_date: string;
  client_id: string;
  source_document_id?: string | null;
  order_number: string;
  order_date?: string | null;
  status: DocumentStatus;
  subtotal: string;
  shipping: string;
  discount: string;
  cgst: string;
  sgst: string;
  igst: string;
  grand_total: string;
  amount_in_words: string;
  remarks: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  items: DocumentItem[];
}

export interface DocumentListResponse {
  data: Document[] | null;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export type CreateDocumentPayload = Omit<
  Document,
  "id" | "created_by" | "created_at" | "updated_at"
>;
