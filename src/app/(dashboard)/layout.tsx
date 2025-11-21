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
  LucideIcon,
} from "lucide-react";

// Tipos
interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: number | null;
}

interface BottomNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

// Navegación principal
const navigation: NavItem[] = [
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

const bottomNavigation: BottomNavItem[] = [
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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-[#E2E8F0] flex flex-col z-50 transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 px-4 flex items-center gap-3 border-b border-[#E2E8F0]">
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
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="mb-6">
            {!sidebarCollapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Principal
              </p>
            )}
            
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.href) 
                    ? "bg-[#EFF6FF] text-[#3B82F6]" 
                    : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive(item.href) ? "text-[#3B82F6]" : "text-[#64748B]"
                )} />
                
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-[#3B82F6] text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </div>

          {/* Separador y Configuración */}
          <div className="mt-auto">
            {!sidebarCollapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Sistema
              </p>
            )}
            
            <Link
              href="/settings"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive("/settings") 
                  ? "bg-[#EFF6FF] text-[#3B82F6]" 
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              )}
              title={sidebarCollapsed ? "Configuración" : undefined}
            >
              <Settings className={cn(
                "h-5 w-5 flex-shrink-0",
                isActive("/settings") ? "text-[#3B82F6]" : "text-[#64748B]"
              )} />
              {!sidebarCollapsed && <span>Configuración</span>}
            </Link>
          </div>
        </nav>

        {/* Usuario */}
        <div className="p-4 border-t border-[#E2E8F0]">
          <div className={cn(
            "flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer",
            sidebarCollapsed && "justify-center"
          )}>
            <div className="h-9 w-9 rounded-full bg-[#DBEAFE] flex items-center justify-center text-sm font-semibold text-[#3B82F6]">
              AD
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] truncate">Admin Skreeo</p>
                  <p className="text-xs text-[#64748B] truncate">admin@skreeo.com</p>
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
        "pb-20 lg:pb-0 transition-all duration-300",
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
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

        {/* Header desktop */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b border-[#E2E8F0]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <input 
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 w-64 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
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
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Bottom Navigation (solo móvil) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] flex items-center justify-around py-2 px-4 z-50 lg:hidden">
        {bottomNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
              isActive(item.href) ? "text-[#3B82F6]" : "text-[#64748B]"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
