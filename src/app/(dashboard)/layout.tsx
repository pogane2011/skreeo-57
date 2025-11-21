"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Plane,
  Users,
  FolderKanban,
  PlaneTakeoff,
  TrendingUp,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  MoreHorizontal,
} from "lucide-react";

// Navegación principal
const navigation = [
  { 
    name: "Dashboard", 
    href: "/operator", 
    icon: LayoutDashboard,
    description: "Resumen general"
  },
  { 
    name: "Mi Flota", 
    href: "/fleet", 
    icon: Plane,
    description: "UAS y Accesorios",
    badge: null
  },
  { 
    name: "Pilotos", 
    href: "/pilots", 
    icon: Users,
    description: "Equipo de vuelo"
  },
  { 
    name: "Proyectos", 
    href: "/projects", 
    icon: FolderKanban,
    description: "Gestión de trabajos"
  },
  { 
    name: "Vuelos", 
    href: "/flights", 
    icon: PlaneTakeoff,
    description: "Registro de operaciones"
  },
  { 
    name: "Mi Negocio", 
    href: "/business", 
    icon: TrendingUp,
    description: "Finanzas y analítica"
  },
];

const bottomNavigation = [
  { name: "Inicio", href: "/operator", icon: LayoutDashboard },
  { name: "Flota", href: "/fleet", icon: Plane },
  { name: "Proyectos", href: "/projects", icon: FolderKanban },
  { name: "Vuelos", href: "/flights", icon: PlaneTakeoff },
  { name: "Más", href: "/settings", icon: MoreHorizontal },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/operator") {
      return pathname === "/operator";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="page-container">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "sidebar",
          sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <Link href="/operator" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
              <Plane className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold text-[#0F172A]">Skreeo</span>
            )}
          </Link>
          
          {/* Botón cerrar móvil */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Botón colapsar desktop */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex ml-auto p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            {!sidebarCollapsed && (
              <p className="sidebar-section-title">Principal</p>
            )}
            
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "sidebar-item",
                  isActive(item.href) && "sidebar-item-active"
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={cn(
                  "sidebar-item-icon",
                  isActive(item.href) ? "text-[#3B82F6]" : "text-[#64748B]"
                )} />
                
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="sidebar-item-badge">{item.badge}</span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </div>

          {/* Separador y Configuración */}
          <div className="sidebar-section mt-auto">
            {!sidebarCollapsed && (
              <p className="sidebar-section-title">Sistema</p>
            )}
            
            <Link
              href="/settings"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "sidebar-item",
                isActive("/settings") && "sidebar-item-active"
              )}
              title={sidebarCollapsed ? "Configuración" : undefined}
            >
              <Settings className={cn(
                "sidebar-item-icon",
                isActive("/settings") ? "text-[#3B82F6]" : "text-[#64748B]"
              )} />
              {!sidebarCollapsed && <span>Configuración</span>}
            </Link>
          </div>
        </nav>

        {/* Usuario */}
        <div className="sidebar-footer">
          <div className={cn(
            "sidebar-user",
            sidebarCollapsed && "justify-center"
          )}>
            <div className="sidebar-user-avatar">
              AD
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="sidebar-user-info">
                  <p className="sidebar-user-name">Admin Skreeo</p>
                  <p className="sidebar-user-email">admin@skreeo.com</p>
                </div>
                <button className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className={cn(
        sidebarCollapsed ? "main-with-sidebar-collapsed" : "main-with-sidebar"
      )}>
        {/* Header móvil/tablet */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] lg:hidden">
          <div className="flex items-center h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-1 flex items-center justify-center">
              <Link href="/operator" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#3B82F6] flex items-center justify-center">
                  <Plane className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-[#0F172A]">Skreeo</span>
              </Link>
            </div>
            
            <button className="p-2 -mr-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Header desktop (mínimo, estilo Claude) */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b border-[#E2E8F0]">
          <div className="flex items-center gap-4">
            {/* Breadcrumb o búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <input 
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 w-64 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#EF4444] rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="page-content animate-in">
          {children}
        </main>
      </div>

      {/* Bottom Navigation (solo móvil) */}
      <nav className="bottom-nav">
        {bottomNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "bottom-nav-item",
              isActive(item.href) && "bottom-nav-item-active"
            )}
          >
            <item.icon className="bottom-nav-icon" />
            <span className="bottom-nav-label">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
