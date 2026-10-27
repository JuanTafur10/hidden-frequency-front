"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/auth-context";
import { HttpError } from "@/features/common/http";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setNotice("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const nextErrors: Record<string, string> = {};
    if (name.length < 3) nextErrors.name = "Escribe tu nombre completo (mínimo 3 caracteres).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Ingresa un correo válido.";
    if (password.length < 8) nextErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    setBusy(true);
    try {
      await register({ name, email, password });
      router.replace(`/login?registered=1&email=${encodeURIComponent(email)}`);
    } catch (error) {
      if (error instanceof HttpError) setErrors({ ...error.fields, ...(error.status === 409 ? { email: error.message } : {}) });
      else setNotice("No se pudo conectar. Intenta de nuevo en un momento.");
    } finally { setBusy(false); }
  }

  return <form onSubmit={submit} noValidate className="space-y-5">
    {notice && <p role="alert" className="text-sm text-rose-600">{notice}</p>}
    <Field label="Nombre completo" name="name" type="text" autoComplete="name" error={errors.name} />
    <Field label="Correo electrónico" name="email" type="email" autoComplete="email" error={errors.email} />
    <Field label="Contraseña" name="password" type="password" autoComplete="new-password" error={errors.password} />
    <p className="-mt-3 text-xs text-muted">Usa al menos 8 caracteres.</p>
    <button disabled={busy} className="w-full rounded-lg bg-accent px-5 py-3 font-bold text-white transition hover:bg-rose-700 disabled:opacity-60">{busy ? "Creando cuenta…" : "Crear cuenta"}</button>
    <p className="text-center text-sm text-muted">¿Ya tienes cuenta? <Link className="font-semibold text-accent hover:underline" href="/login">Ingresar</Link></p>
  </form>;
}

function Field({ label, name, type, error, autoComplete }: { label: string; name: string; type: string; error?: string; autoComplete: string }) {
  return <div><label htmlFor={name} className="mb-1.5 block text-sm font-semibold">{label}</label>
    <input id={name} name={name} type={type} required autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none focus:border-accent dark:border-zinc-600" />
    {error && <p id={`${name}-error`} role="alert" className="mt-1 text-sm text-rose-600">{error}</p>}</div>;
}
