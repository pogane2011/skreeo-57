'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Rocket,
  Users,
  FolderKanban,
  PlaneTakeoff,
  Menu,
  X,
  Bell,
  Search,
  User,
  Settings as SettingsIcon,
  CreditCard,
  Star,
  HelpCircle,
  MessageSquare,
  LogOut,
  Building2,
  Check,
  Settings,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [operadores, setOperadores] = useState<any[]>([]);
  const [operadorActivo, setOperadorActivo] = useState<any>(null);
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: piloto } = await supabase
        .from('pilotos')
        .select('nombre')
        .eq('id_piloto', user.id)
        .single();
      
      setUsuario(piloto);

      const { data: relaciones } = await supabase
        .from('operadora_pilotos')
        .select('id_operadora, id_rol, operador_activo')
        .eq('id_piloto', user.id);
      
      if (!relaciones || relaciones.length === 0) {
        setLoading(false);
        return;
      }

      const operadorasIds = relaciones.map(r => r.id_operadora);
      const { data: ops } = await supabase
        .from('operadoras')
        .select('id, nombre, slug, num_aesa, logo_url')
        .in('id', operadorasIds);

      const operadoresConRol = relaciones.map(rel => {
        const operadora = ops?.find(o => o.id === rel.id_operadora);
        return {
          id_operadora: rel.id_operadora,
          id_rol: rel.id_rol,
          operador_activo: rel.operador_activo,
          operadoras: operadora
        };
      });

      setOperadores(operadoresConRol);
      
      // Operador activo
      const activo = operadoresConRol.find(op => op.operador_activo);
      setOperadorActivo(activo);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarOperador = async (idOperadora: string) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // 1. Poner todos en false
      await supabase
        .from('operadora_pilotos')
        .update({ operador_activo: false })
        .eq('id_piloto', user.id);

      // 2. Poner el seleccionado en true
      await supabase
        .from('operadora_pilotos')
        .update({ operador_activo: true })
        .eq('id_piloto', user.id)
        .eq('id_operadora', idOperadora);

      // 3. Recargar datos SIN cambiar URL
      await loadData();
      
      // 4. Si estamos en dashboard, forzar recarga de página para actualizar datos
      if (pathname === '/dashboard') {
        window.location.reload();
      }
      
    } catch (error) {
      console.error('Error cambiando operador:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mi Flota', href: '/fleet', icon: Rocket },
    { name: 'Pilotos', href: '/pilots', icon: Users },
    { name: 'Proyectos', href: '/projects', icon: FolderKanban },
    { name: 'Vuelos', href: '/flights', icon: PlaneTakeoff },
  ];

  const accountMenu = [
    { name: 'Mi Perfil', href: '/profile', icon: User },
    { name: 'Configuración', href: '/settings', icon: SettingsIcon },
    { name: 'Facturación', href: '/billing', icon: CreditCard },
    { name: 'Mejorar Plan', href: '/pricing', icon: Star, highlight: true },
    { name: 'Centro de Ayuda', href: '/help', icon: HelpCircle },
    { name: 'Vincular Telegram', href: '/settings?tab=integrations', icon: MessageSquare },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex-col z-50">
        <div className="h-16 px-4 flex items-center border-b border-gray-200">
          <Link href="/dashboard">
            <img src="/LogoSkreeo.png" alt="Skreeo" className="h-10" />
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {/* MIS OPERADORES */}
          <div className="mb-4">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Mis Operadores
            </p>
            {operadores.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-500">
                No se encontraron operadores
              </div>
            ) : (
              <div className="space-y-1">
                {operadores.map((op: any) => {
                  const isActivo = op.operador_activo;
                  return (
                    <button
                      key={op.id_operadora}
                      onClick={() => cambiarOperador(op.id_operadora)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full ${
                        isActivo
                          ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {op.operadoras?.logo_url ? (
                        <img 
                          src={op.operadoras.logo_url} 
                          alt={op.operadoras.nombre}
                          className="h-8 w-8 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActivo ? 'bg-blue-600' : 'bg-gray-100'
                        }`}>
                          <Building2 className={`h-4 w-4 ${isActivo ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                      )}
                      
                      <div className="flex-1 text-left min-w-0">
                        <p className="truncate">{op.operadoras?.nombre || 'Sin nombre'}</p>
                        {isActivo && (
                          <p className="text-xs text-blue-600">Activo</p>
                        )}
                      </div>
                      
                      {isActivo && <Check className="h-4 w-4 text-blue-700 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* GESTIONAR OPERADORES */}
            <Link
              href="/operadores"
              className="flex items-center gap-2 px-3 py-2 mt-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Gestionar operadores</span>
            </Link>
          </div>

          {/* GESTIÓN OPERACIONAL */}
          <div className="pt-4 border-t border-gray-200">
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
                    active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

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
                    active ? 'bg-blue-50 text-blue-700' : item.highlight ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active || item.highlight ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full mt-2"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
              {usuario?.nombre?.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{usuario?.nombre || 'Usuario'}</p>
              <p className="text-xs text-gray-500">Piloto</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile - MISMA estructura */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
          <img src="/LogoSkreeo.png" alt="Skreeo" className="h-10" />
          <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="mb-4">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase">Mis Operadores</p>
            {operadores.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-500">No operadores</div>
            ) : (
              operadores.map((op: any) => {
                const isActivo = op.operador_activo;
                return (
                  <button
                    key={op.id_operadora}
                    onClick={() => {
                      cambiarOperador(op.id_operadora);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full ${
                      isActivo
                        ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {op.operadoras?.logo_url ? (
                      <img 
                        src={op.operadoras.logo_url} 
                        alt={op.operadoras.nombre}
                        className="h-8 w-8 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        isActivo ? 'bg-blue-600' : 'bg-gray-100'
                      }`}>
                        <Building2 className={`h-4 w-4 ${isActivo ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                    )}
                    
                    <div className="flex-1 text-left min-w-0">
                      <p className="truncate">{op.operadoras?.nombre || 'Sin nombre'}</p>
                      {isActivo && <p className="text-xs text-blue-600">Activo</p>}
                    </div>
                    
                    {isActivo && <Check className="h-4 w-4 text-blue-700" />}
                  </button>
                );
              })
            )}

            <Link
              href="/operadores"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 px-3 py-2 mt-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
            >
              <Settings className="h-4 w-4" />
              <span>Gestionar operadores</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase">Cuenta</p>
            {accountMenu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    active ? 'bg-blue-50 text-blue-700' : item.highlight ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active || item.highlight ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}

            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full mt-2">
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
              {usuario?.nombre?.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{usuario?.nombre || 'Usuario'}</p>
              <p className="text-xs text-gray-500">Piloto</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64 pb-20 lg:pb-0">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center h-16 px-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex justify-center">
              <img src="/LogoSkreeo.png" alt="Skreeo" className="h-10" />
            </div>
            <button className="p-2 -mr-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar vuelos, proyectos, UAS..."
              className="pl-10 pr-4 py-2 w-80 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-gray-400 bg-gray-100 border border-gray-200 rounded">⌘K</kbd>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-1 z-40 lg:hidden">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg flex-1 ${
                active ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium truncate w-full text-center">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}