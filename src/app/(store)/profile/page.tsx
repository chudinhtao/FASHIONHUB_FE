import React from 'react';
import { ProfileView } from '@/features/auth/components/ProfileView';

export const metadata = {
  title: 'Trang cá nhân | FashionHub',
  description: 'Quản lý thông tin tài khoản cá nhân, lịch sử đơn hàng tại FashionHub.',
};

export default function ProfilePage() {
  return (
    <div className="bg-bgLight min-h-screen text-ink pb-16">
      <main className="max-w-7xl w-full mx-auto px-6 py-12 flex justify-center">
        <ProfileView />
      </main>
    </div>
  );
}
