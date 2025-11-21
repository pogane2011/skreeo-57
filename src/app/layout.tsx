import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Skreeo - Gestión de Flotas de Drones',
  description: 'Plataforma inteligente para gestionar tu flota de drones, vuelos, proyectos y TCO',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[#F8FAFC]`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
