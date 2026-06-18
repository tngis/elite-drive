"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  AuthResponse,
  OtpRequestInput,
  OtpRequestResponse,
  OtpVerifyInput,
  PublicUser,
} from "@elite-drive/types";
import { api, setAccessToken, API_URL } from "@/lib/api-client";

interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  requestOtp: (input: OtpRequestInput) => Promise<OtpRequestResponse>;
  verifyOtp: (input: OtpVerifyInput) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  setUser: (user: PublicUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Сэргээх: refresh cookie байвал сесс сэргээнэ
  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as AuthResponse;
        if (!active) return;
        setAccessToken(data.accessToken);
        setUserState(data.user);
      })
      .catch(() => undefined)
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const requestOtp = useCallback(
    (input: OtpRequestInput) =>
      api.post<OtpRequestResponse>("/auth/otp/request", input),
    [],
  );

  const verifyOtp = useCallback(async (input: OtpVerifyInput) => {
    const res = await api.post<AuthResponse>("/auth/otp/verify", input);
    setAccessToken(res.accessToken);
    setUserState(res.user);
    return res;
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout").catch(() => undefined);
    setAccessToken(null);
    setUserState(null);
  }, []);

  const setUser = useCallback((u: PublicUser) => setUserState(u), []);

  return (
    <AuthContext.Provider
      value={{ user, loading, requestOtp, verifyOtp, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
