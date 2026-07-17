'use client';

import React, { Suspense } from 'react';
import { CheckoutSuccess } from '@/features/orders';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-sans text-xs uppercase tracking-widest text-charcoal">Loading...</div>}>
      <CheckoutSuccess />
    </Suspense>
  );
}
