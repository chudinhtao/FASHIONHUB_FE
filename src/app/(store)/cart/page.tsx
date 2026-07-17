'use client';

import React from 'react';
import { CartList, CartSummary } from '@/features/cart';

export default function CartPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-10 min-h-[calc(100vh-64px)] flex flex-col justify-start">
      <div className="cart-grid grid grid-cols-[1.35fr_1fr] gap-0 items-start max-md:grid-cols-1 max-md:gap-10">
        <CartList />
        <CartSummary />
      </div>
    </main>
  );
}
