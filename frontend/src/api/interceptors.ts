import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { api } from "./axios";
import { tokenStorage } from "../services/tokenStorage";

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    throw error;
  },
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await refreshClient.post("/auth/refresh", {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;

        tokenStorage.setTokens(access_token, refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch {
        tokenStorage.clearTokens();

        window.location.href = "/login";
      }
    }

    throw error;
  },
);
