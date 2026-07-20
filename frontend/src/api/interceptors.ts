import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { api } from "./axios";
import { tokenStorage } from "../services/tokenStorage";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Queue for requests that arrive while a token refresh is in progress
let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  pendingRequests = [];
}

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

    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        }).then((token) => {
          const headers = axios.AxiosHeaders.from(originalRequest.headers || {});
          headers.set("Authorization", `Bearer ${token}`);
          originalRequest.headers = headers;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await refreshClient.post<TokenResponse>(
          "/auth/refresh",
          { refresh_token: refreshToken },
        );

        const { access_token, refresh_token } = response.data;

        tokenStorage.setTokens(access_token, refresh_token);

        processQueue(null, access_token);

        const headers = axios.AxiosHeaders.from(originalRequest.headers || {});
        headers.set("Authorization", `Bearer ${access_token}`);
        originalRequest.headers = headers;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearTokens();

        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  },
);
