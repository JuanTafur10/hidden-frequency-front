import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return <main className="mx-auto grid min-h-[75vh] max-w-6xl place-items-center px-5 py-12">
    <section className="w-full max-w-md rounded-2xl bg-surface p-7 shadow-lg sm:p-9">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-accent">Hidden Frequency</p>
      <h1 className="mt-2 text-3xl font-black">Crea tu cuenta</h1>
      <p className="mb-7 mt-2 text-muted">Regístrate para guardar y consultar tus solicitudes.</p>
      <RegisterForm />
    </section>
  </main>;
}
