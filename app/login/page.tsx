import { LoginForm } from "@/features/auth/components/login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ expired?: string; registered?: string; email?: string }> }) {
  const params = await searchParams;
  return <main className="mx-auto grid min-h-[75vh] max-w-6xl place-items-center px-5 py-12">
    <section className="w-full max-w-md rounded-2xl bg-surface p-7 shadow-lg sm:p-9">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-accent">Tu cuenta</p>
      <h1 className="mt-2 text-3xl font-black">Bienvenido de vuelta</h1>
      <p className="mb-7 mt-2 text-muted">Ingresa para continuar con tus reservas.</p>
      <LoginForm expired={params.expired === "1"} registered={params.registered === "1"} email={params.email} />
    </section>
  </main>;
}
