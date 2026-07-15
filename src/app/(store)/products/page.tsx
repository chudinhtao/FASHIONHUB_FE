'use client';

import React, { Suspense } from 'react';
import ProductList from '@/features/product/components/ProductList';

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-bgLight min-h-screen text-ink pb-16 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-black animate-spin rounded-full"></div>
        </div>
      }
    >
      <ProductList />
    </Suspense>
  );
}
