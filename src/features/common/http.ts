"use client";

export interface ApiValidationIssue { field: string; message: string }
interface ErrorResponse { error?: string; code?: string; details?: ApiValidationIssue[] }

export class HttpError extends Error {
  constructor(message: string, public readonly status: number, public readonly fields: Record<string, string> = {}) {
    super(message);
    this.name = "HttpError";
  }
}

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const response = await fetch(`/api/${path.replace(/^\//, "")}`, { ...init, headers, credentials: "include", cache: "no-store" });

  if (response.status === 401) {
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
