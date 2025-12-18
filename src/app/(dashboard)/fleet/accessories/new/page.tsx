'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Check, X, AlertCircle } from 'lucide-react';

export default function NewAccesoryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    categoria: 'Batería',
    marca_modelo: '',
    alias: '',
    num_serie: '',
    fecha_compra: '',
    precio: '',
    vida_util: '',
    estado: 'activo',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.categoria || !formData.alias) {
      setError('Por favor completa los campos obligatorios');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const supabase = createClient();
      
      // Obtener usuario y operador activo
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: pilotoData } = await supabase
        .from('operadora_pilotos')
        .select('id_operadora')
        .eq('id_piloto', user.id)
        .eq('operador_activo', true)
        .single();

      if (!pilotoData?.id_operadora) {
        setError('No se encontró operador activo');
        setSaving(false);
        return;
      }

      // Insertar accesorio
      const { data: accesorioData, error: insertError } = await supabase
        .from('accesorios')
        .insert({
          id_operadora: pilotoData.id_operadora,
          categoria: formData.categoria,
          marca_modelo: formData.marca_modelo || null,
          alias: formData.alias,
          num_serie: formData.num_serie || null,
          fecha_compra: formData.fecha_compra || null,
          precio: formData.precio ? parseFloat(formData.precio) : null,
          vida_util: formData.vida_util ? parseInt(formData.vida_util) : null,
          estado: formData.estado,
          ciclos_usados: 0,
          eliminado: false,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      alert('Accesorio añadido correctamente');
      router.push(`/fleet/accessories/${accesorioData.id}`);
      
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Error al crear el accesorio');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/fleet" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Añadir Accesorio</h1>
          <p className="text-gray-500">Registra un nuevo accesorio en tu inventario</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* FILA 1: Categoría, Alias, Marca/Modelo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Batería">Batería</option>
                <option value="Hélice">Hélice</option>
                <option value="Cámara">Cámara</option>
                <option value="Control">Control</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alias *
              </label>
              <input
                type="text"
                value={formData.alias}
                onChange={(e) => setFormData({...formData, alias: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Batería principal"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca y Modelo
              </label>
              <input
                type="text"
                value={formData.marca_modelo}
                onChange={(e) => setFormData({...formData, marca_modelo: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="DJI TB30"
              />
            </div>
          </div>

          {/* FILA 2: Nº Serie, Precio, Fecha Compra */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Serie
              </label>
              <input
                type="text"
                value={formData.num_serie}
                onChange={(e) => setFormData({...formData, num_serie: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SN123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="150.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Compra
              </label>
              <input
                type="date"
                value={formData.fecha_compra}
                onChange={(e) => setFormData({...formData, fecha_compra: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* FILA 3: Estado, Vida Útil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vida Útil (ciclos)
              </label>
              <input
                type="number"
                value={formData.vida_util}
                onChange={(e) => setFormData({...formData, vida_util: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="500"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center gap-3 pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  <span>Crear Accesorio</span>
                </>
              )}
            </button>
            <Link
              href="/fleet"
              className="inline-flex items-center gap-2 border border-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              <X className="h-5 w-5" />
              <span>Cancelar</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
