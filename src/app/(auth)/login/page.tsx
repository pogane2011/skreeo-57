'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      setError('Error al conectar con Google');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="skreeo-page-center">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold text-skreeo-text mb-2">
              <span className="text-skreeo-primary">Skreeo</span>
            </h1>
          </Link>
          <p className="text-skreeo-muted">Gestión inteligente de flotas de drones</p>
        </div>

        {/* Card */}
        <div className="skreeo-auth-card">
          <h2 className="text-2xl font-semibold text-skreeo-text mb-6 text-center">
            Iniciar Sesión
          </h2>

          {/* Error */}
          {error && (
            <div className="skreeo-alert-error mb-6">
              {error}
            </div>
          )}

          {/* Botón Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="skreeo-btn-google mb-6"
          >
            {googleLoading ? (
              <div className="skreeo-spinner border-gray-400" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'Conectando...' : 'Continuar con Google'}
          </button>

          {/* Separador */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="skreeo-separator w-full"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-skreeo-muted">o con email</span>
            </div>
          </div>

          {/* Form Email */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="skreeo-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="skreeo-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="skreeo-label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="skreeo-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="skreeo-btn-primary w-full"
            >
              {loading ? (
                <>
                  <div className="skreeo-spinner border-white" />
                  Entrando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <Link href="/forgot-password" className="text-sm skreeo-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-skreeo-muted text-sm mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/pricing" className="skreeo-link">
            Ver planes y precios
          </Link>
        </p>
      </div>
    </div>
  );
}
  
