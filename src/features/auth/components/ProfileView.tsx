'use client';

import React from 'react';
import { Card, Avatar, Badge, Typography, Spin } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, PhoneOutlined, MailOutlined, KeyOutlined, CalendarOutlined } from '@ant-design/icons';
import { Button } from '@/components/ui';
import { useProfileView } from '../hooks';

const { Title, Text } = Typography;

export function ProfileView() {
  const {
    t,
    currentLanguage,
    router,
    user,
    isAuthenticated,
    loggingOut,
    mounted,
    formattedDate,
    logout,
  } = useProfileView();

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip={t('auth.loading')} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
        <Text className="text-sm text-text-muted mb-4">
          {currentLanguage === 'vi' ? 'Bạn chưa đăng nhập hoặc phiên làm việc đã kết thúc.' : 'You are not logged in or your session has expired.'}
        </Text>
        <Button
          type="primary"
          onClick={() => router.push('/login')}
          className="elegant-button h-[40px] px-6 uppercase tracking-wider text-xs font-semibold"
        >
          {t('auth.loginNow')}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl border border-border-light shadow-[0_4px_24px_rgba(0,0,0,0.02)] bg-white p-8 md:p-10 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cột trái: Ảnh đại diện & Thông tin tóm tắt */}
        <div className="lg:col-span-1 flex flex-col items-center text-center pb-8 lg:pb-0 lg:border-r border-border-extra-light lg:pr-8 space-y-6">
          <Avatar
            size={100}
            icon={<UserOutlined />}
            className="border-2 border-border-light shadow-sm bg-bg-avatar text-primary-gold shrink-0"
          />
          <div className="space-y-2 w-full">
            <Title level={3} className="!font-outfit !m-0 !text-text-dark !text-2xl !font-bold tracking-wide">
              {user.name}
            </Title>
            <div className="flex flex-col items-center gap-2">
              <span className={`text-[9px] uppercase tracking-wider px-2.5 py-1 font-bold font-outfit select-none shrink-0 ${
                user.role === 'ADMIN'
                  ? 'bg-black text-white'
                  : 'bg-bg-avatar text-primary-gold'
              }`}>
                {user.role === 'ADMIN' ? t('auth.adminRole') : t('auth.customerRole')}
              </span>
              <span className="text-[10px] text-text-muted font-mono break-all max-w-[220px]">
                {t('auth.id')}: {user.id}
              </span>
            </div>
          </div>

          <Button
            danger
            icon={<LogoutOutlined />}
            loading={loggingOut}
            onClick={logout}
            className="w-full h-[42px] rounded-none border-red-500/20 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 uppercase tracking-wider text-xs font-semibold transition-all duration-300"
          >
            {t('auth.logoutBtn')}
          </Button>
        </div>

        {/* Cột phải: Thông tin chi tiết tài khoản */}
        <div className="lg:col-span-2 space-y-6">
          <Title level={5} className="!font-outfit uppercase tracking-widest text-xs text-text-light font-bold pb-2 border-b border-border-extra-light">
            {t('auth.profileTitle')}
          </Title>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="p-4 bg-zinc-50 border border-border-subtle flex gap-3 items-start">
              <MailOutlined className="text-primary-gold mt-1" />
              <div>
                <Text className="text-[10px] uppercase tracking-wider text-text-light block">{t('auth.emailReg')}</Text>
                <Text className="text-sm text-text-dark font-medium">{user.email}</Text>
              </div>
            </div>

            {/* Điện thoại */}
            <div className="p-4 bg-zinc-50 border border-border-subtle flex gap-3 items-start">
              <PhoneOutlined className="text-primary-gold mt-1" />
              <div>
                <Text className="text-[10px] uppercase tracking-wider text-text-light block">{t('auth.phone')}</Text>
                <Text className="text-sm text-text-dark font-medium">{user.phone || t('auth.addressEmpty')}</Text>
              </div>
            </div>

            {/* Ngày tham gia */}
            <div className="p-4 bg-zinc-50 border border-border-subtle flex gap-3 items-start">
              <CalendarOutlined className="text-primary-gold mt-1" />
              <div>
                <Text className="text-[10px] uppercase tracking-wider text-text-light block">{t('auth.joinedDate')}</Text>
                <Text className="text-sm text-text-dark font-medium">{formattedDate}</Text>
              </div>
            </div>

            {/* Quyền hạn */}
            <div className="p-4 bg-zinc-50 border border-border-subtle flex gap-3 items-start">
              <KeyOutlined className="text-primary-gold mt-1" />
              <div>
                <Text className="text-[10px] uppercase tracking-wider text-text-light block">{t('auth.role')}</Text>
                <Text className="text-sm text-text-dark font-medium">
                  {user.role === 'ADMIN' ? t('auth.adminRole') : t('auth.customerRole')}
                </Text>
              </div>
            </div>
          </div>

          {/* Địa chỉ giao hàng mặc định */}
          <div className="p-4 bg-zinc-50 border border-border-subtle flex gap-3 items-start">
            <HomeOutlined className="text-primary-gold mt-1" />
            <div className="w-full">
              <Text className="text-[10px] uppercase tracking-wider text-text-light block">{t('auth.addressDefault')}</Text>
              <Text className="text-sm text-text-dark font-medium block mt-1">
                {user.address || t('auth.addressEmpty')}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
