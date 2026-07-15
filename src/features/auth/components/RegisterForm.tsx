'use client';

import React from 'react';
import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { Form, Typography } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Button, Input, Password } from '@/components/ui';
import { useRegisterForm } from '../hooks';

const { Title, Text, Paragraph } = Typography;

export function RegisterForm() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { control, errors, loading, onSubmit } = useRegisterForm();

  return (
    <div className="w-full max-w-[460px] bg-white border border-border-light p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all duration-300 relative">
      {/* Language Switcher */}
      <div className="flex justify-end gap-2 mb-2 select-none">
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

      {/* Logo & Header */}
      <div className="text-center mb-8">
        <Title level={2} className="uppercase tracking-[0.1em] !font-outfit !m-0 !text-black !text-2xl">
          {t('auth.brandName')}
        </Title>
        <Paragraph className="!text-xs uppercase tracking-widest text-text-light mt-1 mb-6">
          {t('auth.brandSub')}
        </Paragraph>
        <Title level={4} className="!font-outfit !m-0 !text-text-dark !text-lg">
          {t('auth.registerTitle')}
        </Title>
        <Text type="secondary" className="text-xs text-text-medium mt-1 block">
          {t('auth.registerSub')}
        </Text>
      </div>

      <Form layout="vertical" onFinish={onSubmit} requiredMark={false}>
        {/* Họ tên Field */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-text-ink font-medium">{t('auth.fullName')}</span>}
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
          className="mb-4"
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<UserOutlined className="text-text-gray" />}
                placeholder={t('auth.fullNamePlaceholder')}
                className="elegant-input h-[42px]"
                disabled={loading}
              />
            )}
          />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-text-ink font-medium">{t('auth.email')}</span>}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
          className="mb-4"
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<MailOutlined className="text-text-gray" />}
                placeholder={t('auth.emailPlaceholder')}
                className="elegant-input h-[42px]"
                disabled={loading}
              />
            )}
          />
        </Form.Item>

        {/* Số điện thoại (Optional) */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-text-ink font-medium">{t('auth.phone')}</span>}
          validateStatus={errors.phone ? 'error' : ''}
          help={errors.phone?.message}
          className="mb-4"
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<PhoneOutlined className="text-text-gray" />}
                placeholder={t('auth.phonePlaceholder')}
                className="elegant-input h-[42px]"
                disabled={loading}
              />
            )}
          />
        </Form.Item>

        {/* Địa chỉ (Optional) */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-text-ink font-medium">{t('auth.address')}</span>}
          validateStatus={errors.address ? 'error' : ''}
          help={errors.address?.message}
          className="mb-4"
        >
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<HomeOutlined className="text-text-gray" />}
                placeholder={t('auth.addressPlaceholder')}
                className="elegant-input h-[42px]"
                disabled={loading}
              />
            )}
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-text-ink font-medium">{t('auth.password')}</span>}
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
                placeholder={t('auth.passwordPlaceholder')}
                className="elegant-input h-[42px]"
                disabled={loading}
              />
            )}
          />
        </Form.Item>

        {/* Confirm Password Field */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-text-ink font-medium">{t('auth.confirmPassword')}</span>}
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
                placeholder={t('auth.confirmPasswordPlaceholder')}
                className="elegant-input h-[42px]"
                disabled={loading}
              />
            )}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item className="mb-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full elegant-button h-[45px] text-sm uppercase tracking-wider font-semibold"
          >
            {t('auth.registerBtn')}
          </Button>
        </Form.Item>
      </Form>

      {/* Login Link */}
      <div className="text-center mt-6 pt-4 border-t border-border-extra-light">
        <Text className="text-xs text-text-muted">
          {t('auth.hasAccount')}{' '}
          <Link
            href="/login"
            className="text-xs text-primary-gold hover:text-[#B3936B] transition-colors font-semibold"
          >
            {t('auth.loginNow')}
          </Link>
        </Text>
      </div>
    </div>
  );
}
