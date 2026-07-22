import { api } from "../../../api/axios";

import type {
  CreateDocumentPayload,
  Document,
  DocumentListResponse,
  DocumentType,
} from "../types";

import type { PaginationParams } from "../../../types/api";

export async function getDocuments(params?: PaginationParams) {
  const response = await api.get<DocumentListResponse>("/documents", {
    params,
  });

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

export async function downloadDocumentPDF(id: string, documentNumber: string) {
  const response = await api.get(`/documents/${id}/pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `invoice_${documentNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
}

export async function duplicateDocument(id: string) {
  const response = await api.post<Document>(`/documents/${id}/duplicate`);
  return response.data;
}

export async function generateDocumentFromSource(id: string, targetType: DocumentType) {
  const response = await api.post<Document>(`/documents/${id}/generate`, { target_type: targetType });
  return response.data;
}
