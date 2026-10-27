export type UserRole = "admin" | "user";

export interface User { id: string; name: string; email: string; role: UserRole }
export interface LoginRequest { email: string; password: string }
export interface RegisterRequest extends LoginRequest { name: string }
export interface AuthResponse { user: User }
export interface RegisterResponse { data: User }
