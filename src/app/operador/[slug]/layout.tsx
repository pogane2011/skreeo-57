"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Plane,
  LayoutDashboard,
  Compass,
  Users,
  FolderKanban,
  PlaneTakeoff,
  TrendingUp,
  Settings,
  Menu,
  X,
  LogOut,
  Building2,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mi Flota", href: "/drones", icon: Compass },
  { name: "Pilotos", href: "/pilots", icon: Users },
  { name: "Proyectos", href: "/projects", icon: FolderKanban },
  { name: "Vuelos", href: "/flights", icon: PlaneTakeoff },
  { name: "Mi Negocio", href: "/business", icon: TrendingUp },
  { name: "Configuración", href: "/settings", icon: Settings },
];

export default function OperadorLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slug = params.slug as string;
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [operador, setOperador] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOperador = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Obtener operador por slug
      const { data: ops } = await supabase
        .from('operadoras')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!ops) {
        router.push('/operadores');
        return;
      }

      // Verificar acceso
      const { data: access } = await supabase
        .from('operadora_pilotos')
        .select('*')
        .eq('id_piloto', user.id)
        .eq('id_operadora', ops.id)
        .single();

      if (!access) {
        router.push('/operadores');
        return;
      }

      setOperador(ops);
      setLoading(false);
    };

    loadOperador();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/operadores" className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Skreeo</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Operador actual */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {operador?.nombre}
              </p>
              <p className="text-xs text-gray-500">/{slug}</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const href = `/operador/${slug}${item.href}`;
            const isActive = pathname === href;
            return (
              <Link
                key={item.name}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-blue-700" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link
            href="/operadores"
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Building2 className="h-4 w-4" />
            Cambiar operador
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header mobile */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
