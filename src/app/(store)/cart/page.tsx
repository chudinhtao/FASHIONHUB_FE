'use client';

import React from 'react';
import { CartList, CartSummary } from '@/features/cart';

export default function CartPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-4 pb-10 min-h-[calc(100vh-64px)] flex flex-col justify-start overflow-x-hidden">
      <div className="cart-grid grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 items-start">
        <CartList />
        <CartSummary />
      </div>
    </main>
  );
}
