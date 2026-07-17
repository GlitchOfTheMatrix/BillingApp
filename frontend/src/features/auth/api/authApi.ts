import { api } from "../../../api/axios";

import type {
    LoginRequest,
    LoginResponse,
} from "../types";

export async function loginApi(
    payload: LoginRequest
): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
        "/auth/login",
        payload
    );

    return response.data;
}

export async function meApi() {
    const response = await api.get("/auth/me");

    return response.data;
}