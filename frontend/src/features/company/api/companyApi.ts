import { api } from "../../../api/axios";

import type {
  CompanyDetails,
  CompanyListResponse,
  CompanyPayload,
} from "../types";

export async function getCompanies() {
  const response = await api.get<CompanyListResponse>("/company-details");

  return response.data;
}

export async function getCompanyById(id: string) {
  const response = await api.get<CompanyDetails>(`/company-details/${id}`);

  return response.data;
}

export async function createCompany(payload: CompanyPayload) {
  const response = await api.post<CompanyDetails>("/company-details", payload);

  return response.data;
}

export async function updateCompany(id: string, payload: CompanyPayload) {
  const response = await api.put<CompanyDetails>(
    `/company-details/${id}`,
    payload,
  );

  return response.data;
}

export async function deleteCompany(id: string) {
  await api.delete(`/company-details/${id}`);
}
