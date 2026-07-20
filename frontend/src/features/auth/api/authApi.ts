import { api } from "../../../api/axios";

import type { LoginRequest, LoginResponse, User } from "../types";

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", payload);

  return response.data;
}

export async function meApi(): Promise<User> {
  const response = await api.get<User>("/auth/me");

  return response.data;
}
