'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NuevoOperadorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    num_aesa: '',
    tipo: 'individual',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    try {
      // Generar slug
      const slug = formData.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Crear operador
      const { data: operador, error: opError } = await supabase
        .from('operadoras')
        .insert({
          nombre: formData.nombre,
          num_aesa: formData.num_aesa || null,
          tipo: formData.tipo,
          slug: slug,
        })
        .select()
        .single();

      if (opError) throw opError;

      // Crear relación como admin (id_rol = 1)
      const { error: relError } = await supabase
        .from('operadora_pilotos')
        .insert({
          id_operadora: operador.id,
          id_piloto: user.id,
          id_rol: 1, // admin
          estado_membresia: 'activo',
          operador_activo: true,
        });

      if (relError) throw relError;

      // Redirigir al dashboard del nuevo operador
      router.push(`/operador/${slug}/dashboard`);
    } catch (err: any) {
      setError(err.message || 'Error al crear operador');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* Header */}
        <Link
          href="/operator"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Crear Nuevo Operador
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del operador *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Drones Sevilla"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {formData.nombre && (
                <p className="text-xs text-gray-500 mt-1">
                  Slug: /{formData.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                </p>
              )}
            </div>

            {/* Número AESA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número AESA (opcional)
              </label>
              <input
                type="text"
                value={formData.num_aesa}
                onChange={(e) => setFormData({ ...formData, num_aesa: e.target.value })}
                placeholder="ES.OP.001234"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de operador
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="individual">Individual</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <Link
                href="/operadores"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Operador'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
