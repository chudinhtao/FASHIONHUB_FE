'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { OrderDetailView } from '@/features/orders';

export default function ProfileOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <main className="max-w-[1000px] mx-auto px-6 py-10 min-h-[calc(100vh-64px)] flex flex-col justify-start">
      <OrderDetailView orderId={id} />
    </main>
  );
}
