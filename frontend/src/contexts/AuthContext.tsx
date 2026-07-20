import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { tokenStorage } from "../services/tokenStorage";
import type {
  AuthContextType,
  LoginRequest,
  User,
} from "../features/auth/types";
import { loginApi, meApi } from "../features/auth/api/authApi";

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  readonly children: React.ReactNode;
}

export function AuthContextProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {
    try {
      const token = tokenStorage.getAccessToken();

      if (!token) {
        return;
      }

      const currentUser = await meApi();

      setUser(currentUser);
    } catch {
      tokenStorage.clearTokens();

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const login = useCallback(async (payload: LoginRequest) => {
    try {
      setIsLoading(true);

      const response = await loginApi(payload);

      tokenStorage.setTokens(response.access_token, response.refresh_token);

      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clearTokens();

    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,

      isAuthenticated: user !== null,

      isLoading,

      login,

      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
