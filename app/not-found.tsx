import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center px-6 text-center">
    <div><p className="font-bold text-accent">404</p><h1 className="mt-2 text-4xl font-black">No encontramos esa página</h1>
      <p className="mt-3 text-muted">Puede que el enlace haya cambiado.</p><Link className="mt-6 inline-flex rounded-lg bg-accent px-5 py-3 font-bold text-white" href="/">Volver al inicio</Link></div>
  </main>;
}
