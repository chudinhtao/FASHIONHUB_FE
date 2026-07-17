'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AdminOrderDetail } from '@/features/admin-orders';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <main className="max-w-[1200px] mx-auto my-14 px-6">
      <AdminOrderDetail orderId={id} />
    </main>
  );
}
