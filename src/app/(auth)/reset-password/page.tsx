import React from 'react';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export const metadata = {
  title: 'Đặt lại mật khẩu | FashionHub',
  description: 'Cập nhật mật khẩu mới cho tài khoản FashionHub của bạn.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
