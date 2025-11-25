'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Loader2, ArrowRight } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  stripe_price_monthly: string;
  stripe_price_yearly: string;
  limit_vuelos: number;
  limit_pilotos: number;
  limit_operadores: number;
  limit_proyectos: number;
  limit_drones_tco: number;
  limit_accesorios_tco: number;
  has_alertas: boolean;
  has_func_avanzadas: boolean;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans');
        const data = await response.json();
        
        if (data.plans) {
          setPlans(data.plans);
        }
      } catch (error) {
        console.error('Error loading plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (centimos: number) => {
    return (centimos / 100).toFixed(2);
  };

  const getPlanFeatures = (plan: Plan) => {
    const features = [
      {
        text: plan.limit_vuelos === 99999 ? 'Vuelos ilimitados' : `${plan.limit_vuelos} vuelos/mes`,
        included: true
      },
      {
        text: plan.limit_pilotos === 99999 ? 'Pilotos ilimitados' : `${plan.limit_pilotos} ${plan.limit_pilotos === 1 ? 'piloto' : 'pilotos'}`,
        included: true
      },
      {
        text: plan.limit_operadores === 99999 ? 'Operadores ilimitados' : `${plan.limit_operadores} ${plan.limit_operadores === 1 ? 'operador' : 'operadores'}`,
        included: true
      },
      {
        text: plan.limit_proyectos === 99999 ? 'Proyectos ilimitados' : `${plan.limit_proyectos} proyectos activos`,
        included: true
      },
      {
        text: plan.limit_drones_tco === 99999 ? 'Drones TCO ilimitados' : `${plan.limit_drones_tco} ${plan.limit_drones_tco === 1 ? 'dron' : 'drones'} con TCO`,
        included: true
      },
      {
        text: plan.limit_accesorios_tco === 99999 ? 'Accesorios ilimitados' : `${plan.limit_accesorios_tco} accesorios/baterías`,
        included: true
      },
      {
        text: 'Alertas de depreciación',
        included: plan.has_alertas
      },
      {
        text: 'Funciones avanzadas',
        included: plan.has_func_avanzadas
      },
      {
        text: 'Registro por voz (Telegram)',
        included: true
      },
      {
        text: 'Export CSV y PDF',
        included: true
      }
    ];

    return features;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <img src="/LogoSkreeo.png" alt="Skreeo" className="h-8" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#como-funciona" className="text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors">
                Cómo funciona
              </Link>
              <Link href="/pricing" className="text-[#3B82F6] font-medium">
                Precios
              </Link>
              <Link href="/sobre-nosotros" className="text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors">
                Sobre nosotros
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-4">
              Planes que se adaptan a tu <span className="text-[#3B82F6]">negocio</span>
            </h1>
            <p className="text-xl text-[#6B7280]">
              Desde pilotos freelance hasta grandes operadoras. Sin compromiso, cancela cuando quieras.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`font-medium ${billingCycle === 'monthly' ? 'text-[#1F2937]' : 'text-[#6B7280]'}`}>
              Mensual
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-[#3B82F6]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`font-medium ${billingCycle === 'yearly' ? 'text-[#1F2937]' : 'text-[#6B7280]'}`}>
              Anual
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                Ahorra 1 mes
              </span>
            )}
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const isPopular = plan.id === 'operador';
              const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
              const priceMonthly = billingCycle === 'yearly' ? plan.price_yearly / 12 : plan.price_monthly;
              const features = getPlanFeatures(plan);

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 ${
                    isPopular ? 'border-[#3B82F6] scale-105' : 'border-[#E5E7EB]'
                  } p-8 flex flex-col`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white text-sm font-bold px-4 py-1 rounded-full">
                      MÁS POPULAR
                    </div>
                  )}

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-[#1F2937] mb-2">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#1F2937]">
                        {formatPrice(priceMonthly)}€
                      </span>
                      <span className="text-[#6B7280]">/mes</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-[#6B7280] mt-1">
                        Facturado anualmente ({formatPrice(price)}€/año)
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/register?plan=${plan.id}&cycle=${billingCycle}`}
                    className={`w-full py-3 rounded-lg font-semibold text-center transition-all mb-6 ${
                      isPopular
                        ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                        : 'bg-white hover:bg-gray-50 text-[#3B82F6] border-2 border-[#3B82F6]'
                    }`}
                  >
                    Empezar ahora
                  </Link>

                  {/* Features */}
                  <ul className="space-y-3 flex-grow">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <div className="h-5 w-5 flex-shrink-0 mt-0.5"></div>
                        )}
                        <span className={`text-sm ${feature.included ? 'text-[#1F2937]' : 'text-[#9CA3AF]'}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Trial Info */}
          <div className="text-center mt-12">
            <p className="text-lg text-[#6B7280] mb-4">
              🎉 <strong>Prueba gratis 14 días.</strong> Sin tarjeta de crédito.
            </p>
            <p className="text-sm text-[#9CA3AF]">
              Cancela cuando quieras. Sin preguntas.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-12 text-center">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            <div className="border-b border-[#E5E7EB] pb-6">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                ¿Necesito tarjeta de crédito para la prueba?
              </h3>
              <p className="text-[#6B7280]">
                No. La prueba de 14 días es completamente gratuita y no requiere tarjeta.
              </p>
            </div>

            <div className="border-b border-[#E5E7EB] pb-6">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                ¿Puedo cambiar de plan en cualquier momento?
              </h3>
              <p className="text-[#6B7280]">
                Sí, puedes hacer upgrade o downgrade cuando quieras. El cambio se aplica inmediatamente.
              </p>
            </div>

            <div className="border-b border-[#E5E7EB] pb-6">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                ¿Qué pasa si cancelo mi suscripción?
              </h3>
              <p className="text-[#6B7280]">
                Mantienes acceso hasta el final de tu periodo de facturación. Tus datos se conservan 30 días por si decides volver.
              </p>
            </div>

            <div className="border-b border-[#E5E7EB] pb-6">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                ¿Ofrecen descuentos para equipos grandes?
              </h3>
              <p className="text-[#6B7280]">
                Sí, contacta con nosotros si necesitas más de 10 licencias. Tenemos planes empresariales personalizados.
              </p>
            </div>

            <div className="pb-6">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                ¿Qué métodos de pago aceptan?
              </h3>
              <p className="text-[#6B7280]">
                Tarjeta de crédito/débito (Visa, Mastercard, American Express) a través de Stripe. Totalmente seguro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-[#3B82F6] to-[#2563EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            ¿Listo para controlar tu rentabilidad?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Únete a cientos de pilotos que ya gestionan su negocio con Skreeo
          </p>
          <Link 
            href="/register"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#3B82F6] px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl"
          >
            <span>Empezar gratis 14 días</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/LogoSkreeo.png" alt="Skreeo" className="h-8 mb-4 brightness-0 invert" />
              <p className="text-gray-400 text-sm">
                Gestión inteligente de flotas de drones
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Producto</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/#como-funciona" className="hover:text-white">Cómo funciona</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Precios</Link></li>
                <li><Link href="/sobre-nosotros" className="hover:text-white">Sobre nosotros</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/ayuda" className="hover:text-white">Centro de ayuda</Link></li>
                <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/aviso-legal" className="hover:text-white">Aviso Legal</Link></li>
                <li><Link href="/privacidad" className="hover:text-white">Privacidad</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
                <li><Link href="/terminos" className="hover:text-white">Términos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Skreeo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
