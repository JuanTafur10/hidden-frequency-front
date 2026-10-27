import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/features/auth/components/auth-provider";
import { SiteHeader } from "@/features/common/components/site-header";

export const metadata: Metadata = {
  title: "Hidden Frequency | Vinilos y Music Gear",
  description: "Vinilos underground, pedales y equipo de producción. Explora Hidden Frequency.",
  applicationName: "Hidden Frequency"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" suppressHydrationWarning><body><AuthSessionProvider><SiteHeader />{children}</AuthSessionProvider></body></html>;
}
