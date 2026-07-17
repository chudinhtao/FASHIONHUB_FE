'use client';

import React from 'react';
import { AdminOrderList } from '@/features/admin-orders';

export default function AdminOrdersPage() {
  return (
    <main className="max-w-[1200px] mx-auto my-14 px-6">
      <AdminOrderList />
    </main>
  );
}
