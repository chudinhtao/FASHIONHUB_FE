'use client';

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useCheckoutView, CheckoutForm, CheckoutSummary } from '@/features/orders';

export default function CheckoutPage() {
  const { formMethods, handlePlaceOrder } = useCheckoutView();

  return (
    <main className="max-w-[1200px] mx-auto px-6 pt-4 pb-10 min-h-[calc(100vh-64px)] flex flex-col justify-start">
      <FormProvider {...formMethods}>
        <form
          id="shipping-form"
          onSubmit={handlePlaceOrder}
          className="checkout-grid grid grid-cols-[1.35fr_1fr] gap-0 items-start max-md:grid-cols-1 max-md:gap-10"
        >
          <CheckoutForm />
          <CheckoutSummary />
        </form>
      </FormProvider>
    </main>
  );
}
