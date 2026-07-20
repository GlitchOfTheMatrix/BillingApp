import { api } from "../../../api/axios";
import type { Client, ClientListResponse, ClientPayload } from "../types";

export async function getClients() {
  const response = await api.get<ClientListResponse>("/clients");

  return response.data;
}

export async function getClientById(id: string) {
  const response = await api.get<Client>(`/clients/${id}`);

  return response.data;
}

export async function createClient(payload: ClientPayload) {
  const response = await api.post<Client>("/clients", payload);

  return response.data;
}

export async function updateClient(id: string, payload: ClientPayload) {
  const response = await api.put<Client>(`/clients/${id}`, payload);

  return response.data;
}

export async function deleteClient(id: string) {
  await api.delete(`/clients/${id}`);
}
