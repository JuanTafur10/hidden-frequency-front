"use client";

export interface ApiValidationIssue { field: string; message: string }
interface ErrorResponse { error?: string; code?: string; details?: ApiValidationIssue[] }

export class HttpError extends Error {
  constructor(message: string, public readonly status: number, public readonly fields: Record<string, string> = {}) {
    super(message);
    this.name = "HttpError";
  }
}

function getSessionToken(): string | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith("hf_session="));
  return entry ? decodeURIComponent(entry.slice("hf_session=".length)) : null;
}

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getSessionToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const response = await fetch(`/api/${path.replace(/^\//, "")}`, { ...init, headers, credentials: "include", cache: "no-store" });

  const normalizedPath = path.replace(/^\//, "");
  if (response.status === 401 && !["auth/login", "auth/register"].includes(normalizedPath)) {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    if (typeof window !== "undefined") window.dispatchEvent(new Event("hf:auth-expired"));
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as ErrorResponse;
    const fields = Object.fromEntries((payload.details ?? []).map(({ field, message }) => [field, message]));
    throw new HttpError(payload.error ?? "No fue posible completar la solicitud.", response.status, fields);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
