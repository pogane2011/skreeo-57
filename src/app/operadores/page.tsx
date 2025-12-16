import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Building2, Plus } from 'lucide-react';

export default async function OperadoresPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookies().get(name)?.value } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Obtener operadores del usuario
  const { data: operadores } = await supabase
    .from('operadora_pilotos')
    .select(`
      id_operadora,
      id_rol,
      operadoras!inner (
        id,
        nombre,
        slug,
        num_aesa,
        tipo
      )
    `)
    .eq('id_piloto', user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Operadores</h1>
            <p className="text-gray-500 mt-1">{operadores?.length || 0} operadores</p>
          </div>
          <Link
            href="/operadores/nuevo"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="h-5 w-5" />
            Crear Operador
          </Link>
        </div>

        {/* Grid de operadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operadores?.map((op: any) => (
            <Link
              key={op.id_operadora}
              href={`/operador/${op.operadoras.slug}/dashboard`}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {op.operadoras.nombre}
                  </h3>
                  {op.operadoras.num_aesa && (
                    <p className="text-sm text-gray-500 mt-1">
                      {op.operadoras.num_aesa}
                    </p>
                  )}
                  <div className="mt-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      op.id_rol === 1 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {op.id_rol === 1 ? 'Admin' : 'Miembro'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {operadores?.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes operadores
            </h3>
            <p className="text-gray-500 mb-6">
              Crea tu primer operador para empezar
            </p>
            <Link
              href="/operadores/nuevo"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="h-5 w-5" />
              Crear Operador
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
