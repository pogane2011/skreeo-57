'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Check, X, AlertCircle } from 'lucide-react';

export default function NewDronePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    categoria: '',
    marca_modelo: '',
    num_matricula: '',
    num_serie: '',
    alias: '',
    poliza: '',
    fecha_compra: '',
    precio: '',
    vida_util: '',
    estado: 'activo',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.categoria || !formData.marca_modelo || !formData.num_matricula) {
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

      // Insertar drone
      const { data: droneData, error: insertError } = await supabase
        .from('drones')
        .insert({
          id_operadora: pilotoData.id_operadora,
          categoria: formData.categoria,
          marca_modelo: formData.marca_modelo,
          num_matricula: formData.num_matricula,
          num_serie: formData.num_serie || null,
          alias: formData.alias || null,
          poliza: formData.poliza || null,
          fecha_compra: formData.fecha_compra || null,
          precio: formData.precio ? parseFloat(formData.precio) : null,
          vida_util_estimada: formData.vida_util ? parseFloat(formData.vida_util) : null,
          estado: formData.estado,
          horas_voladas: 0,
          eliminado: false,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      alert('UAS añadido correctamente');
      router.push(`/fleet/${droneData.id}`);
      
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Error al crear el UAS');
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
          <h1 className="text-2xl font-bold text-gray-900">Añadir UAS</h1>
          <p className="text-gray-500">Registra un nuevo UAS en tu flota</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* FILA 1: Categoría, Marca/Modelo, Alias */}
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
                <option value="">Seleccionar...</option>
                <option value="C0">C0</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
                <option value="C3">C3</option>
                <option value="C4">C4</option>
                <option value="C5">C5</option>
                <option value="C6">C6</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca y Modelo *
              </label>
              <input
                type="text"
                value={formData.marca_modelo}
                onChange={(e) => setFormData({...formData, marca_modelo: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="DJI Mavic 3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alias
              </label>
              <input
                type="text"
                value={formData.alias}
                onChange={(e) => setFormData({...formData, alias: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Drone principal"
              />
            </div>

            {/* FILA 2: Nº Serie, Matrícula, Póliza */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Serie
              </label>
              <input
                type="text"
                value={formData.num_serie}
                onChange={(e) => setFormData({...formData, num_serie: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SN123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matrícula *
              </label>
              <input
                type="text"
                value={formData.num_matricula}
                onChange={(e) => setFormData({...formData, num_matricula: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ES-XXX-XXXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Póliza Seguro
              </label>
              <input
                type="text"
                value={formData.poliza}
                onChange={(e) => setFormData({...formData, poliza: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="POL-12345"
              />
            </div>

            {/* FILA 3: Precio, Fecha Compra, Estado */}
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
                placeholder="1500.00"
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
                <option value="mantenimiento">Mantenimiento</option>
                <option value="reparacion">Reparación</option>
                <option value="retirado">Retirado</option>
              </select>
            </div>

            {/* FILA 4: Vida Útil */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vida Útil (horas)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.vida_util}
                onChange={(e) => setFormData({...formData, vida_util: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1000"
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
                  <span>Crear UAS</span>
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
