'use client';

import React from 'react';
import { OrderHistoryList } from '@/features/orders';

export default function ProfileOrdersPage() {
  return (
    <main className="max-w-[1000px] mx-auto px-6 py-10 min-h-[calc(100vh-64px)] flex flex-col justify-start">
      <OrderHistoryList />
    </main>
  );
}
