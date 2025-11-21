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

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleFinish = async () => {
    setSaving(true);
    try {
      router.push('/dashboard');
    } catch (error) {
      console.error('Error guardando datos:', error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="skreeo-page-center">
        <div className="skreeo-spinner border-[#3B82F6] w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="skreeo-page-center">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-skreeo-text mb-2">
            <span className="text-skreeo-primary">Skreeo</span>
          </h1>
          <p className="text-skreeo-muted">Configuración inicial</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`skreeo-progress-dot ${
                s === step
                  ? 'skreeo-progress-dot-active'
                  : s < step
                  ? 'skreeo-progress-dot-completed'
                  : 'skreeo-progress-dot-pending'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="skreeo-auth-card max-w-lg">
          
          {/* Step 1: Bienvenida */}
          {step === 1 && (
            <div className="text-center">
              <div className="text-6xl mb-6">🚁</div>
              <h2 className="text-2xl font-semibold text-skreeo-text mb-4">
                ¡Bienvenido a Skreeo!
              </h2>
              <p className="text-skreeo-muted mb-2">
                Hola <span className="text-skreeo-primary font-medium">{user?.email}</span>
              </p>
              <p className="text-skreeo-light mb-8">
                Vamos a configurar tu cuenta en unos sencillos pasos.
              </p>
              <button onClick={handleNext} className="skreeo-btn-primary w-full">
                Empezar configuración
              </button>
            </div>
          )}

          {/* Step 2: Datos operadora */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-skreeo-text mb-2 text-center">
                Datos de la operadora
              </h2>
              <p className="text-skreeo-light mb-6 text-center text-sm">
                Esta información aparecerá en tus informes y documentos
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="skreeo-label">Nombre de la operadora *</label>
                  <input
                    name="nombre_operadora"
                    type="text"
                    value={formData.nombre_operadora}
                    onChange={handleChange}
                    placeholder="Mi Empresa de Drones S.L."
                    className="skreeo-input"
                  />
                </div>

                <div>
                  <label className="skreeo-label">CIF/NIF (opcional)</label>
                  <input
                    name="cif"
                    type="text"
                    value={formData.cif}
                    onChange={handleChange}
                    placeholder="B12345678"
                    className="skreeo-input"
                  />
                </div>

                <div>
                  <label className="skreeo-label">Teléfono de contacto</label>
                  <input
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+34 600 000 000"
                    className="skreeo-input"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={handleBack} className="skreeo-btn-secondary flex-1">
                  Atrás
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.nombre_operadora}
                  className="skreeo-btn-primary flex-1"
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
              <h2 className="text-2xl font-semibold text-skreeo-text mb-4">
                Vincula tu Telegram
              </h2>
              <p className="text-skreeo-light mb-6">
                Registra tus vuelos enviando mensajes de voz al bot de Telegram
              </p>

              <div className="skreeo-card p-4 mb-6 text-left">
                <p className="text-skreeo-muted text-sm mb-2">
                  1. Abre Telegram y busca:
                </p>
                <p className="text-skreeo-primary font-mono font-bold text-lg mb-4 text-center">
                  @SkreeoBot
                </p>
                <p className="text-skreeo-muted text-sm mb-2">
                  2. Envía este comando:
                </p>
                <div className="bg-[#F1F5F9] rounded px-3 py-2 font-mono text-skreeo-primary text-center">
                  /vincular
                </div>
              </div>

              <p className="text-skreeo-light text-xs mb-6">
                Puedes hacer esto más tarde desde Ajustes
              </p>

              <div className="flex gap-3">
                <button onClick={handleBack} className="skreeo-btn-secondary flex-1">
                  Atrás
                </button>
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="skreeo-btn-primary flex-1"
                >
                  {saving ? (
                    <>
                      <div className="skreeo-spinner border-white" />
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
