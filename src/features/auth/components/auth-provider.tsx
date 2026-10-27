"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "../hooks/auth-context";

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
