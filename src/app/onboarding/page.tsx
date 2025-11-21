'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre_operadora: '',
    cif: '',
    telefono: '',
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFinish = async () => {
    setSaving(true);
    
    // Aquí guardarías los datos en Supabase
    // Por ahora redirigimos al dashboard
    
    try {
      // Ejemplo: actualizar perfil del usuario
      // await supabase.from('operadoras').insert({...})
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error guardando datos:', error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-sky-400">Skreeo</span>
          </h1>
          <p className="text-slate-400">Configuración inicial</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                s === step
                  ? 'bg-sky-400 scale-125'
                  : s < step
                  ? 'bg-sky-600'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
          
          {/* Step 1: Bienvenida */}
          {step === 1 && (
            <div className="text-center">
              <div className="text-6xl mb-6">🚁</div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                ¡Bienvenido a Skreeo!
              </h2>
              <p className="text-slate-300 mb-2">
                Hola <span className="text-sky-400 font-medium">{user?.email}</span>
              </p>
              <p className="text-slate-400 mb-8">
                Vamos a configurar tu cuenta en unos sencillos pasos.
              </p>
              <button
                onClick={handleNext}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg py-3 px-4 transition-all"
              >
                Empezar configuración
              </button>
            </div>
          )}

          {/* Step 2: Datos operadora */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2 text-center">
                Datos de la operadora
              </h2>
              <p className="text-slate-400 mb-6 text-center text-sm">
                Esta información aparecerá en tus informes y documentos
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre de la operadora *
                  </label>
                  <input
                    name="nombre_operadora"
                    type="text"
                    value={formData.nombre_operadora}
                    onChange={handleChange}
                    placeholder="Mi Empresa de Drones S.L."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    CIF/NIF (opcional)
                  </label>
                  <input
                    name="cif"
                    type="text"
                    value={formData.cif}
                    onChange={handleChange}
                    placeholder="B12345678"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Teléfono de contacto
                  </label>
                  <input
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+34 600 000 000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg py-3 px-4 transition-all"
                >
                  Atrás
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.nombre_operadora}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg py-3 px-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Vincular Telegram */}
          {step === 3 && (
            <div className="text-center">
              <div className="text-6xl mb-6">📱</div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Vincula tu Telegram
              </h2>
              <p className="text-slate-400 mb-6">
                Registra tus vuelos enviando mensajes de voz al bot de Telegram
              </p>

              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <p className="text-slate-300 text-sm mb-2">
                  1. Abre Telegram y busca:
                </p>
                <p className="text-sky-400 font-mono font-bold text-lg mb-4">
                  @SkreeoBot
                </p>
                <p className="text-slate-300 text-sm mb-2">
                  2. Envía este comando:
                </p>
                <div className="bg-slate-800 rounded px-3 py-2 font-mono text-sky-300">
                  /vincular
                </div>
              </div>

              <p className="text-slate-500 text-xs mb-6">
                Puedes hacer esto más tarde desde Ajustes
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg py-3 px-4 transition-all"
                >
                  Atrás
                </button>
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg py-3 px-4 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    '¡Empezar a volar!'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
