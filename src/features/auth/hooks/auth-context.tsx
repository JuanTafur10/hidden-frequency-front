"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { LoginRequest, RegisterRequest, User } from "../domain/auth";
import { authService } from "../services/auth-service";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (input: LoginRequest) => Promise<User>;
  register: (input: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try { setUser((await authService.session()).user); }
    catch { setUser(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    authService.session().then(({ user: currentUser }) => { if (active) setUser(currentUser); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });
    const handleExpired = () => { setUser(null); router.replace("/login?expired=1"); };
    window.addEventListener("hf:auth-expired", handleExpired);
    return () => { active = false; window.removeEventListener("hf:auth-expired", handleExpired); };
  }, [router]);

  const login = useCallback(async (input: LoginRequest) => {
    const result = await authService.login(input);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(async (input: RegisterRequest) => { await authService.register(input); }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); }
    finally { setUser(null); router.push("/"); router.refresh(); }
  }, [router]);

  const value = useMemo(() => ({ user, loading, login, register, logout, refresh }), [user, loading, login, register, logout, refresh]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider.");
  return context;
}
