'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Plane,
  Users,
  FolderKanban,
  PlaneTakeoff,
  TrendingUp,
  Menu,
  X,
  Bell,
  Search,
  BookOpen,
  FileText,
} from 'lucide-react';
import UserMenu from '@/components/dashboard/UserMenu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // TODO: Obtener del usuario logueado (Supabase)
  const user = {
    name: 'Abraham Skreeo',
    email: 'admin@skreeo.com',
    initials: 'AS',
    plan: 'OPERADOR',
  };

  const navigation = [
    { name: 'Dashboard', href: '/operator', icon: LayoutDashboard },
    { name: 'Mi Flota', href: '/fleet', icon: Plane },
    { name: 'Pilotos', href: '/pilots', icon: Users },
    { name: 'Proyectos', href: '/projects', icon: FolderKanban },
    { name: 'Vuelos', href: '/flights', icon: PlaneTakeoff },
    { name: 'Mi Negocio', href: '/business', icon: TrendingUp },
  ];

  // Bottom Nav: Solo 5 acciones principales (SIN botón "Más")
  const bottomNav = [
    { name: 'Dashboard', href: '/operator', icon: LayoutDashboard },
    { name: 'Flota', href: '/fleet', icon: Plane },
    { name: 'Proyectos', href: '/projects', icon: FolderKanban },
    { name: 'Vuelos', href: '/flights', icon: PlaneTakeoff },
    { name: 'Negocio', href: '/business', icon: TrendingUp },
  ];

  const isActive = (href: string) => {
    if (href === '/operator') return pathname === '/operator';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
          <Link href="/operator" className="flex items-center gap-3">
             <img src="/LogoSkreeo.png" alt="Skreeo Logo" className="h-10 w-auto" loading="eager" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Principal
          </p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Usuario con UserMenu */}
        <div className="p-4 border-t border-gray-200">
          <UserMenu user={user} />
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="lg:ml-64 pb-20 lg:pb-0">
        {/* Header móvil */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex items-center justify-center">
              <Link href="/operator" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Plane className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Skreeo</span>
              </Link>
            </div>
            <button className="p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Header Desktop */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200 sticky top-0 z-30">
          {/* Búsqueda */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar vuelos, proyectos, UAS..."
                className="pl-10 pr-4 py-2 w-80 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-semibold text-gray-400 bg-gray-100 border border-gray-200 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Enlaces y acciones */}
          <div className="flex items-center gap-2">
            {/* Enlaces externos */}
            <Link
              href="https://docs.skreeo.com"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Docs</span>
            </Link>
            <Link
              href="https://blog.skreeo.com"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Blog</span>
            </Link>

            {/* Notificaciones */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>

      {/* Bottom Navigation móvil - SOLO 5 opciones principales */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around py-2 px-2 z-40 lg:hidden">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg min-w-0 ${
                active ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon className="h-6 w-6 flex-shrink-0" />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
