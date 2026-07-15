import React from 'react';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const metadata = {
  title: 'Đăng ký tài khoản | FashionHub',
  description: 'Đăng ký tài khoản FashionHub mới để nhận nhiều ưu đãi độc quyền.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
