import React from 'react';
import { DashboardOverview } from '@/features/dashboard/components/DashboardOverview';

export const metadata = {
  title: 'Bảng điều khiển | FashionHub Admin',
  description: 'Bảng quản lý hoạt động tổng quan của FashionHub.',
};

export default function AdminDashboardIndexPage() {
  return <DashboardOverview />;
}
