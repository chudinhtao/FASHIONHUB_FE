'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { Form, Typography } from 'antd';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Button, Password } from '@/components/ui';
import { useResetPasswordForm } from '../hooks';

const { Title, Text, Paragraph } = Typography;

function ResetPasswordFormContent() {
  const { t, i18n, currentLanguage, token, control, errors, loading, onSubmit } = useResetPasswordForm();

  return (
    <div className="w-full max-w-[420px] bg-white border border-border-light p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all duration-300 relative">
      {/* Back to Login Button */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/login"
          className="inline-flex items-center text-xs text-text-muted hover:text-primary-gold transition-colors gap-2"
        >
          <ArrowLeftOutlined /> {t('auth.backToLogin')}
        </Link>

        {/* Language Switcher */}
        <div className="flex gap-2 select-none">
          <span 
            className={`text-[10px] cursor-pointer font-bold font-outfit uppercase transition-colors ${currentLanguage === 'vi' ? 'text-primary-gold underline' : 'text-text-gray hover:text-black'}`}
            onClick={() => i18n.changeLanguage('vi')}
          >
            VI
          </span>
          <span className="text-[10px] text-separator font-outfit">|</span>
          <span 
            className={`text-[10px] cursor-pointer font-bold font-outfit uppercase transition-colors ${currentLanguage === 'en' ? 'text-primary-gold underline' : 'text-text-gray hover:text-black'}`}
            onClick={() => i18n.changeLanguage('en')}
          >
            EN
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <Title level={2} className="uppercase tracking-[0.1em] !font-outfit !m-0 !text-black !text-2xl">
          {t('auth.brandName')}
        </Title>
        <Paragraph className="!text-xs uppercase tracking-widest text-text-light mt-1 mb-6">
          {t('auth.brandSub')}
        </Paragraph>
        <Title level={4} className="!font-outfit !m-0 !text-text-dark !text-lg">
          {t('auth.resetTitle')}
        </Title>
        <Text type="secondary" className="text-xs text-text-medium mt-1 block">
          {t('auth.resetSub')}
        </Text>
      </div>

      {!token && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs text-center">
          {t('auth.resetTokenMissing')}
        </div>
      )}

      <Form layout="vertical" onFinish={onSubmit} requiredMark={false}>
        {/* Mật khẩu mới */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-text-ink font-medium">{t('auth.newPassword')}</span>}
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
          className="mb-4"
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                prefix={<LockOutlined className="text-text-gray" />}
                placeholder={t('auth.newPasswordPlaceholder')}
                className="elegant-input h-[42px]"
                disabled={loading || !token}
              />
            )}
          />
        </Form.Item>

        {/* Xác nhận mật khẩu mới */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-text-ink font-medium">{t('auth.confirmNewPassword')}</span>}
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
          className="mb-6"
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                prefix={<LockOutlined className="text-text-gray" />}
                placeholder={t('auth.confirmNewPasswordPlaceholder')}
                className="elegant-input h-[42px]"
                disabled={loading || !token}
              />
            )}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!token}
            className="w-full elegant-button h-[45px] text-sm uppercase tracking-wider font-semibold"
          >
            {t('auth.resetBtn')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

// Bọc Suspense để tránh lỗi lúc build tĩnh (Static Generation Mismatch) của Next.js do dùng useSearchParams()
export function ResetPasswordForm() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[420px] bg-white border border-border-light p-8 md:p-10 text-center text-sm text-text-muted">
        Đang tải cấu hình khôi phục...
      </div>
    }>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
