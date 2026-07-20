export interface Client {
  id: string;
  name: string;
  organisation: string;
  address: string;
  city: string;
  state: string;
  country: string;
  gst_number: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface ClientListResponse {
  data: Client[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export type ClientPayload = Omit<Client, "id" | "created_at" | "updated_at">;
