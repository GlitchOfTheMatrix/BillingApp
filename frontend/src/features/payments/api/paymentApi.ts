import { api } from "../../../api/axios";
import type { Payment, PaymentListResponse, PaymentPayload } from "../types";

export async function getPayments() {
  const response = await api.get<PaymentListResponse>("/payments");

  return response.data;
}

export async function getPaymentById(id: string) {
  const response = await api.get<Payment>(`/payments/${id}`);

  return response.data;
}

export async function createPayment(payload: PaymentPayload) {
  const response = await api.post<Payment>("/payments", payload);

  return response.data;
}

export async function updatePayment(id: string, payload: PaymentPayload) {
  const response = await api.put<Payment>(`/payments/${id}`, payload);

  return response.data;
}

export async function deletePayment(id: string) {
  await api.delete(`/payments/${id}`);
}
