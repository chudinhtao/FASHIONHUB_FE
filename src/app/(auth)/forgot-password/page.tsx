import React from 'react';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export const metadata = {
  title: 'Quên mật khẩu | FashionHub',
  description: 'Khôi phục mật khẩu tài khoản FashionHub của bạn.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
