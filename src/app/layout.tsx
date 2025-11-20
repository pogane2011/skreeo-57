import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skreeo - Gestión Profesional de Drones",
  description: "Manda un audio. Y punto. Gestiona tu flota de drones con inteligencia artificial.",
  keywords: ["drones", "gestión", "TCO", "vuelos", "operadora"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
