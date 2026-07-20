import { api } from "../../../api/axios";

import type {
  CreateDocumentPayload,
  Document,
  DocumentListResponse,
} from "../types";

export async function getDocuments() {
  const response = await api.get<DocumentListResponse>("/documents");

  return response.data;
}

export async function getDocumentById(id: string) {
  const response = await api.get<Document>(`/documents/${id}`);

  return response.data;
}

export async function createDocument(payload: CreateDocumentPayload) {
  const response = await api.post<Document>("/documents", payload);

  return response.data;
}

export async function updateDocument(
  id: string,
  payload: CreateDocumentPayload,
) {
  const response = await api.put<Document>(`/documents/${id}`, payload);

  return response.data;
}

export async function deleteDocument(id: string) {
  await api.delete(`/documents/${id}`);
}
