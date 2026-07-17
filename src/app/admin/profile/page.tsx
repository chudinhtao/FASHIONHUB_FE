import React from 'react';
import { ProfileView } from '@/features/auth/components/ProfileView';

export const metadata = {
  title: 'Hồ sơ Quản trị viên | FashionHub',
  description: 'Quản lý thông tin tài khoản Admin tại FashionHub.',
};

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl font-bold tracking-wide text-ink">
          Hồ Sơ Quản Trị Viên
        </h1>
        <p className="text-xs text-charcoal font-light mt-1">
          Thông tin chi tiết tài khoản Admin cấp cao của hệ thống.
        </p>
      </div>
      <div className="w-full flex justify-center">
        <ProfileView />
      </div>
    </div>
  );
}
