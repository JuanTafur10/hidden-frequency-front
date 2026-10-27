import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hidden Frequency | Vinilos y Music Gear",
  description: "Vinilos underground, pedales y equipo de producción. Explora Hidden Frequency.",
  applicationName: "Hidden Frequency"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" suppressHydrationWarning><body>{children}</body></html>;
}
