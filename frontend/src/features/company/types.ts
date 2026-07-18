export interface CompanyDetails {
  id: string;
  company_name: string;
  gst_number: string;
  pan_number: string;
  msme_number: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  branch: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyListResponse {
  data: CompanyDetails[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export type CompanyPayload = Omit<
  CompanyDetails,
  "id" | "created_at" | "updated_at"
>;
