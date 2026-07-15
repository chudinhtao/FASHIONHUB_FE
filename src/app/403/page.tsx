import React from 'react';
import { AccessDeniedView } from '@/features/auth/components/AccessDeniedView';

export const metadata = {
  title: '403 Từ chối truy cập | FashionHub',
  description: 'Bạn không có quyền truy cập vào tài nguyên yêu cầu.',
};

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] py-12 px-4 sm:px-6 lg:px-8">
      <AccessDeniedView />
    </div>
  );
}
