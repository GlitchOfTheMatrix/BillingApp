import type { PaginatedResponse } from "../../types/api";

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

export type ClientListResponse = PaginatedResponse<Client>;

export type ClientPayload = Omit<Client, "id" | "created_at" | "updated_at">;
