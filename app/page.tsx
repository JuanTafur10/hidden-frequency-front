import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <header className="bg-zinc-900 px-6 py-6 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-black tracking-tight">Hidden Frequency</Link>
          <nav aria-label="Navegación principal" className="flex flex-wrap gap-5 text-sm font-medium">
            <a href="#catalogo" className="hover:text-rose-500">Catálogo</a>
            <a href="#reserva" className="hover:text-rose-500">Reserva de Gear</a>
            <a href="/login" className="hover:text-rose-500">Ingresar</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <section className="mb-16 border-l-4 border-rose-600 py-4 pl-6">
          <p className="mb-2 text-sm font-bold uppercase tracking-[.2em] text-rose-600">Música para escuchar distinto</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Encuentra tu próximo sonido.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">Vinilos underground, pedales y equipo de producción seleccionados para músicos y coleccionistas.</p>
        </section>
        <section id="catalogo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold">Catálogo de equipos y vinilos</h2>
          <p className="text-muted">El catálogo conectado a la API aparecerá aquí.</p>
        </section>
        <section id="reserva" className="rounded-xl bg-surface p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Reserva bajo pedido</h2>
          <p className="mt-2 text-muted">¿Buscas una edición específica o un pedal difícil de conseguir? Inicia sesión para enviar tu solicitud.</p>
        </section>
      </main>
      <footer className="bg-zinc-900 px-6 py-8 text-center text-sm text-zinc-300">© 2026 Hidden Frequency, todos los derechos reservados.</footer>
    </>
  );
}
