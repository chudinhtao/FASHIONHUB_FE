'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, Typography, Space } from 'antd';
import { SafetyCertificateOutlined, HomeOutlined, SwapOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';

const { Title, Text, Paragraph } = Typography;

export function AccessDeniedView() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <Card
      className="w-full max-w-md border border-[#EBEBEB] text-center shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative"
      style={{ borderRadius: 0 }}
      bodyStyle={{ padding: '3rem 2rem' }}
    >
      {/* Language Switcher */}
      <div className="flex justify-end gap-2 mb-2 select-none absolute top-4 right-6">
        <span 
          className={`text-[10px] cursor-pointer font-bold font-outfit uppercase transition-colors ${currentLanguage === 'vi' ? 'text-[#C5A880] underline' : 'text-[#999999] hover:text-black'}`}
          onClick={() => i18n.changeLanguage('vi')}
        >
          VI
        </span>
        <span className="text-[10px] text-[#DDDDDD] font-outfit">|</span>
        <span 
          className={`text-[10px] cursor-pointer font-bold font-outfit uppercase transition-colors ${currentLanguage === 'en' ? 'text-[#C5A880] underline' : 'text-[#999999] hover:text-black'}`}
          onClick={() => i18n.changeLanguage('en')}
        >
          EN
        </span>
      </div>

      {/* Icon Shield Lock */}
      <div className="flex justify-center mb-6 mt-4">
        <div className="w-16 h-16 bg-[#FFF2E8] border border-[#FFD596] text-[#FA541C] rounded-none flex items-center justify-center text-3xl shadow-sm">
          <SafetyCertificateOutlined />
        </div>
      </div>

      {/* Heading */}
      <Title level={2} className="uppercase tracking-[0.05em] !font-outfit !m-0 !text-black !text-xl">
        {t('auth.forbiddenTitle')}
      </Title>
      <Text type="secondary" className="text-[10px] uppercase tracking-widest text-[#FA541C] font-semibold mt-1 block">
        {t('auth.forbiddenSub')}
      </Text>

      {/* Description */}
      <Paragraph className="text-sm text-[#555555] leading-relaxed mt-6 mb-8">
        {t('auth.forbiddenDesc')}
      </Paragraph>

      {/* Actions */}
      <Space direction="vertical" className="w-full" size="middle">
        <Button
          type="primary"
          icon={<HomeOutlined />}
          onClick={() => router.push('/')}
          className="w-full elegant-button h-[42px] uppercase tracking-wider text-xs font-semibold"
        >
          {t('auth.backToHome')}
        </Button>
        <Button
          icon={<SwapOutlined />}
          onClick={() => router.push('/login')}
          className="w-full h-[42px] rounded-none border-black hover:border-primary-gold hover:text-primary-gold uppercase tracking-wider text-xs font-semibold"
        >
          {t('auth.loginOther')}
        </Button>
      </Space>
    </Card>
  );
}
