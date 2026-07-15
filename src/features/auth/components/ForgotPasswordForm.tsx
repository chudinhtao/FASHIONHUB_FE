'use client';

import React from 'react';
import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { Form, Typography } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/components/ui';
import { useForgotPasswordForm } from '../hooks';

const { Title, Text, Paragraph } = Typography;

export function ForgotPasswordForm() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { control, errors, loading, onSubmit } = useForgotPasswordForm();

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
          {t('auth.forgotTitle')}
        </Title>
        <Text type="secondary" className="text-xs text-text-medium mt-1 block">
          {t('auth.forgotSub')}
        </Text>
      </div>

      <Form layout="vertical" onFinish={onSubmit} requiredMark={false}>
        {/* Email Field */}
        <Form.Item
          label={<span className="text-xs uppercase tracking-wider text-text-ink font-medium">{t('auth.emailReg')}</span>}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
          className="mb-6"
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

        {/* Submit Button */}
        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full elegant-button h-[45px] text-sm uppercase tracking-wider font-semibold"
          >
            {t('auth.forgotBtn')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
