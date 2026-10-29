"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/auth-context";
import { HttpError } from "@/features/common/http";
import { Button } from "@/features/common/components/button";
import { Input } from "@/features/common/components/input";

export function LoginForm({ expired, registered, email: initialEmail }: { expired?: boolean; registered?: boolean; email?: string }) {
  const { login } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(registered ? "Tu cuenta quedó creada. Ya puedes ingresar." : "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setNotice("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const nextErrors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Ingresa un correo válido.";
    if (password.length < 8) nextErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    setBusy(true);
    try {
      await login({ email, password });
      const candidate = new URLSearchParams(window.location.search).get("next");
      router.replace(candidate?.startsWith("/") && !candidate.startsWith("//") ? candidate : "/");
      router.refresh();
    } catch (error) {
      if (error instanceof HttpError) setErrors({ ...error.fields, ...(error.status === 401 ? { password: error.message } : {}) });
      else setNotice("No se pudo conectar. Intenta de nuevo en un momento.");
    } finally { setBusy(false); }
  }

  return <form onSubmit={submit} noValidate className="space-y-5">
    {expired && <p className="rounded-lg bg-amber-100 p-3 text-sm text-amber-900">Tu sesión venció. Ingresa de nuevo para continuar.</p>}
    {notice && <p role="alert" className="text-sm text-rose-600">{notice}</p>}
    <Input id="email" name="email" type="email" label="Correo electrónico" error={errors.email} autoComplete="email" defaultValue={initialEmail} required />
    <Input id="password" name="password" type="password" label="Contraseña" error={errors.password} autoComplete="current-password" required />
    <Button type="submit" disabled={busy} className="w-full">{busy ? "Ingresando…" : "Ingresar"}</Button>
    <p className="text-center text-sm text-muted">¿Aún no tienes cuenta? <Link className="font-semibold text-accent hover:underline" href="/registro">Regístrate</Link></p>
  </form>;
}
