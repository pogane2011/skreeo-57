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
  Menu,
  X,
  Bell,
  Search,
  BookOpen,
  FileText,
  User,
  Settings,
  CreditCard,
  Star,
  HelpCircle,
  MessageSquare,
  LogOut,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navegación principal
  const navigation = [
    { name: 'Dashboard', href: '/operator', icon: LayoutDashboard },
    { name: 'Proyectos', href: '/projects', icon: FolderKanban },
    { name: 'Pilotos', href: '/pilots', icon: Users },
    { name: 'Mi Flota', href: '/fleet', icon: Plane },
    { name: 'Vuelos', href: '/flights', icon: PlaneTakeoff },
  ];

  // Bottom Nav Mobile (mismas opciones que navegación principal)
  const bottomNav = navigation;

  // Sección CUENTA (para sidebar y hamburguesa móvil)
  const accountMenu = [
    { name: 'Mi Perfil', href: '/profile', icon: User },
    { name: 'Configuración', href: '/settings', icon: Settings },
    { name: 'Facturación', href: '/billing', icon: CreditCard },
    { name: 'Mejorar Plan', href: '/pricing', icon: Star, highlight: true },
    { name: 'Centro de Ayuda', href: '/help', icon: HelpCircle },
    { name: 'Vincular Telegram', href: '/settings?tab=integrations', icon: MessageSquare },
  ];

  const isActive = (href: string) => {
    if (href === '/operator') return pathname === '/operator';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = () => {
    // TODO: Implementar logout con Supabase
    window.location.href = '/login';
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

      {/* Sidebar Desktop - Con PRINCIPAL y CUENTA */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex-col z-50">
        {/* Logo */}
        <div className="h-16 px-4 flex items-center border-b border-gray-200">
          <Link href="/operator" className="flex items-center gap-3">
            <img src="/LogoSkreeo.png" alt="Skreeo Logo" className="h-10 md:h-12" loading="eager" />
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {/* PRINCIPAL */}
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Gestión Operacional
          </p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
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

          {/* CUENTA */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Cuenta
            </p>
            {accountMenu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700'
                      : item.highlight
                      ? 'text-blue-600 hover:bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active || item.highlight ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Cerrar Sesión */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full mt-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>

        {/* Info usuario (solo visual, sin click) */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Abraham Skreeo</p>
              <p className="text-xs text-gray-500 truncate">Plan OPERADOR</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile (Hamburguesa) - SOLO CUENTA */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src="/LogoSkreeo.png" alt="Skreeo Logo" className="h-10 md:h-12" loading="eager" />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SOLO sección CUENTA en móvil */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Cuenta
          </p>
          {accountMenu.map((item) => {
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
                    : item.highlight
                    ? 'text-blue-600 hover:bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${active || item.highlight ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full mt-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </nav>

        {/* Info usuario */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Abraham Skreeo</p>
              <p className="text-xs text-gray-500 truncate">Plan OPERADOR</p>
            </div>
          </div>
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
                <img src="/LogoSkreeo.png" alt="Skreeo Logo" className="h-10 md:h-12" loading="eager" />
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

          {/* Enlaces y notificaciones */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>

      {/* Bottom Navigation móvil - 5 opciones de navegación principal */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around py-2 px-1 z-40 lg:hidden">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg flex-1 min-w-0 ${
                active ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon className="h-6 w-6 flex-shrink-0" />
              <span className="text-xs font-medium truncate w-full text-center">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
