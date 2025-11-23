'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Check, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Planes con Price IDs de Stripe
const plans = [
  {
    id: 'despegue',
    name: 'DESPEGUE',
    description: 'Para pilotos individuales',
    priceMonthly: 14.95,
    priceYearly: 164.45,
    priceIdMonthly: 'price_1SVt3bHcyKksEXpEej7xdg4P',
    priceIdYearly: 'price_1SVt3bHcyKksEXpE528LrsBy',
    features: {
      vuelos: 'Ilimitados',
      pilotos: '1',
      operadores: '1',
      proyectos: '3',
      dronesTco: '1',
      accesoriosTco: '3',
      alertas: true,
      funcAvanzadas: false,
    },
    popular: false,
  },
  {
    id: 'operador',
    name: 'OPERADOR',
    description: 'Para pequeñas operadoras',
    priceMonthly: 39.95,
    priceYearly: 439.45,
    priceIdMonthly: 'price_1SVsN3HcyKksEXpEBfACl6US',
    priceIdYearly: 'price_1SVsNeHcyKksEXpEd22ffINw',
    features: {
      vuelos: 'Ilimitados',
      pilotos: '3',
      operadores: '1',
      proyectos: '15',
      dronesTco: '3',
      accesoriosTco: '10',
      alertas: true,
      funcAvanzadas: true,
    },
    popular: true,
  },
  {
    id: 'controlador',
    name: 'CONTROLADOR',
    description: 'Para grandes operaciones',
    priceMonthly: 99.95,
    priceYearly: 1099.45,
    priceIdMonthly: 'price_1SVsOnHcyKksEXpEQgN8VwHy',
    priceIdYearly: 'price_1SVsPQHcyKksEXpEAzZJh3q4',
    features: {
      vuelos: 'Ilimitados',
      pilotos: 'Ilimitados',
      operadores: 'Ilimitados',
      proyectos: 'Ilimitados',
      dronesTco: 'Ilimitados',
      accesoriosTco: 'Ilimitados',
      alertas: true,
      funcAvanzadas: true,
    },
    popular: false,
  },
];

const featureLabels = {
  vuelos: 'Vuelos',
  pilotos: 'Pilotos',
  operadores: 'Operadores',
  proyectos: 'Proyectos',
  dronesTco: 'Drones con TCO',
  accesoriosTco: 'Accesorios TCO',
  alertas: 'Alertas depreciación',
  funcAvanzadas: 'Funciones avanzadas',
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get('canceled');

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    setLoading(plan.id);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Si no está logueado, redirigir a register con el plan seleccionado
      router.push(`/register?plan=${plan.id}&cycle=${billingCycle}`);
      return;
    }

    // Si está logueado, crear checkout directamente
    try {
      const priceId = billingCycle === 'monthly' ? plan.priceIdMonthly : plan.priceIdYearly;

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          planId: plan.id,
          billingCycle,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(null);
        return;
      }

      // Redirigir a Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError('Error al procesar. Inténtalo de nuevo.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image src="/LogoSkreeo.png" alt="Skreeo" width={140} height={40} className="h-10 w-auto" />
            </Link>
            <Link href="/login" className="text-[#6B7280] hover:text-[#1F2937] font-medium">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1F2937] mb-4">
            Elige tu plan
          </h1>
          <p className="text-lg text-[#6B7280] mb-8">
            14 días de prueba gratis. Cancela cuando quieras.
          </p>

          {/* Toggle mensual/anual */}
          <div className="inline-flex items-center gap-4 bg-white p-1 rounded-lg border border-[#E5E7EB]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              Anual <span className="text-xs ml-1 text-green-600">-1 mes gratis</span>
            </button>
          </div>
        </div>

        {/* Error/Canceled */}
        {canceled && (
          <div className="max-w-md mx-auto mb-8 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-center">
            Proceso cancelado. Selecciona un plan para continuar.
          </div>
        )}
        {error && (
          <div className="max-w-md mx-auto mb-8 skreeo-alert-error text-center">
            {error}
          </div>
        )}

        {/* Planes */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 transition-all ${
                plan.popular
                  ? 'border-[#3B82F6] shadow-lg scale-105'
                  : 'border-[#E5E7EB] hover:border-[#3B82F6]/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#3B82F6] text-white text-sm font-bold px-4 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}

              <div className="p-6 lg:p-8">
                {/* Header del plan */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-[#1F2937] mb-1">{plan.name}</h3>
                  <p className="text-sm text-[#6B7280]">{plan.description}</p>
                </div>

                {/* Precio */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-[#1F2937]">
                      {billingCycle === 'monthly'
                        ? plan.priceMonthly.toFixed(2)
                        : (plan.priceYearly / 12).toFixed(2)}€
                    </span>
                    <span className="text-[#6B7280]">/mes</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-[#6B7280] mt-1">
                      Facturado {plan.priceYearly.toFixed(2)}€/año
                    </p>
                  )}
                </div>

                {/* Botón */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loading !== null}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                      : 'bg-white border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white'
                  } disabled:opacity-50`}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Empezar prueba gratis'
                  )}
                </button>

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {Object.entries(plan.features).map(([key, value]) => (
                    <li key={key} className="flex items-center gap-3">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )
                      ) : (
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                      <span className="text-sm text-[#6B7280]">
                        {typeof value === 'boolean'
                          ? featureLabels[key as keyof typeof featureLabels]
                          : `${value} ${featureLabels[key as keyof typeof featureLabels].toLowerCase()}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ o info adicional */}
        <div className="mt-16 text-center">
          <p className="text-[#6B7280]">
            ¿Dudas? <Link href="/contact" className="text-[#3B82F6] font-medium hover:underline">Contáctanos</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
