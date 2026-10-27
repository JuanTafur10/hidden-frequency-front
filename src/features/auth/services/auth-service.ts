import { http } from "@/features/common/http";
import type { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse, User } from "../domain/auth";

export const authService = {
  login: (input: LoginRequest) => http<AuthResponse>("auth/login", { method: "POST", body: JSON.stringify(input) }),
  register: (input: RegisterRequest) => http<RegisterResponse>("auth/register", { method: "POST", body: JSON.stringify(input) }),
  session: () => http<{ user: User | null }>("auth/session"),
  logout: () => http<void>("auth/logout", { method: "POST" })
};
