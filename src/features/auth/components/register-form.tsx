"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/auth-context";
import { HttpError } from "@/features/common/http";
import { Button } from "@/features/common/components/button";
import { Input } from "@/features/common/components/input";

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
    <Input id="name" name="name" type="text" label="Nombre completo" autoComplete="name" error={errors.name} required />
    <Input id="email" name="email" type="email" label="Correo electrónico" autoComplete="email" error={errors.email} required />
    <Input id="password" name="password" type="password" label="Contraseña" autoComplete="new-password" error={errors.password} hint="Usa al menos 8 caracteres." required />
    <Button type="submit" disabled={busy} className="w-full">{busy ? "Creando cuenta…" : "Crear cuenta"}</Button>
    <p className="text-center text-sm text-muted">¿Ya tienes cuenta? <Link className="font-semibold text-accent hover:underline" href="/login">Ingresar</Link></p>
  </form>;
}
