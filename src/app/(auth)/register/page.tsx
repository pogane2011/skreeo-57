'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

// Frases animadas para el lado derecho
const phrases = [
  "Tu TCO te roba ganancias. Cógelas.",
  "Deja de volar a ciegas en costes",
  "El margen neto real, al instante",
  "De logbook a máquina de decisiones",
  "Manda un audio. Nosotros calculamos."
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const router = useRouter();

  // Animación de frases
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        setFadeIn(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Este email ya está registrado');
        } else {
          setError(authError.message);
        }
        return;
      }

      if (authData.user) {
        router.push('/onboarding');
      }
    } catch (err) {
      setError('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LADO IZQUIERDO - Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link href="/" className="inline-block mb-8">
            <Image 
              src="/LogoSkreeo.png" 
              alt="Skreeo" 
              width={180} 
              height={48}
              className="h-12 w-auto"
            />
          </Link>

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-8 leading-tight uppercase">
            ¡Recupera tu<br />Margen!
          </h1>

          {/* Error */}
          {error && (
            <div className="skreeo-alert-error mb-6">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu email"
                required
                className="skreeo-input"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
                minLength={6}
                className="skreeo-input pr-12"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirma tu contraseña"
                required
                minLength={6}
                className="skreeo-input pr-12"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="skreeo-btn-primary w-full"
            >
              {loading ? (
                <>
                  <div className="skreeo-spinner border-white" />
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>

          {/* Link login */}
          <p className="mt-8 text-center text-[#6B7280]">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#3B82F6] font-medium hover:text-[#2563EB] transition-colors">
              Iniciar Sesión
            </Link>
          </p>

          {/* Términos */}
          <p className="mt-6 text-center">
            <Link 
              href="/terms" 
              className="text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
            >
              Términos y Condiciones
            </Link>
          </p>
        </div>
      </div>

      {/* LADO DERECHO - Frases animadas (solo desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#0EA5E9] items-center justify-center p-12">
        <div className="text-center">
          <h2 
            className={`text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white leading-tight transition-all duration-500 ${
              fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {phrases[currentPhrase]}
          </h2>
          
          {/* Indicadores de frase */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {phrases.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentPhrase 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
