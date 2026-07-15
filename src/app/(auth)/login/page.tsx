import React from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata = {
  title: 'Đăng nhập | FashionHub',
  description: 'Đăng nhập vào tài khoản FashionHub của bạn để tiếp tục mua sắm.',
};

export default function LoginPage() {
  return <LoginForm />;
}
