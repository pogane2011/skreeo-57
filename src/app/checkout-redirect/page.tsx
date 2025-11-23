'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Price IDs de Stripe
const priceIds: Record<string, { monthly: string; yearly: string }> = {
  despegue: {
    monthly: 'price_1SVt3bHcyKksEXpEej7xdg4P',
    yearly: 'price_1SVt3bHcyKksEXpE528LrsBy',
  },
  operador: {
    monthly: 'price_1SVsN3HcyKksEXpEBfACl6US',
    yearly: 'price_1SVsNeHcyKksEXpEd22ffINw',
  },
  controlador: {
    monthly: 'price_1SVsOnHcyKksEXpEQgN8VwHy',
    yearly: 'price_1SVsPQHcyKksEXpEAzZJh3q4',
  },
};

function CheckoutRedirectContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'operador';
  const cycle = (searchParams.get('cycle') as 'monthly' | 'yearly') || 'monthly';

  useEffect(() => {
    const createCheckout = async () => {
      try {
        const priceId = priceIds[plan]?.[cycle] || priceIds.operador.monthly;

        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId,
            planId: plan,
            billingCycle: cycle,
          }),
        });

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          // Error, volver a pricing
          window.location.href = '/pricing?error=checkout_failed';
        }
      } catch (error) {
        window.location.href = '/pricing?error=checkout_failed';
      }
    };

    createCheckout();
  }, [plan, cycle]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="h-12 w-12 animate-spin text-[#3B82F6] mb-4" />
      <h2 className="text-xl font-semibold text-[#1F2937] mb-2">
        Preparando tu suscripción...
      </h2>
      <p className="text-[#6B7280]">
        Serás redirigido a la página de pago en unos segundos.
      </p>
    </div>
  );
}

export default function CheckoutRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-12 w-12 animate-spin text-[#3B82F6]" />
      </div>
    }>
      <CheckoutRedirectContent />
    </Suspense>
  );
}
