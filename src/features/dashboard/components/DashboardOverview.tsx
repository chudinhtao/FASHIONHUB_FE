'use client';

import React from 'react';
import { useDashboardOverview } from '../hooks';
import { Card, Button, Spin } from 'antd';
import {
  AppstoreOutlined,
  ShoppingOutlined,
  DollarCircleOutlined,
  InboxOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from '@ant-design/icons';

export function DashboardOverview() {
  const { t, router, isLoading, statCards, activities } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip={t('auth.loading', 'Đang tải...')} />
      </div>
    );
  }

  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <ShoppingOutlined className="text-2xl text-primaryGold" />;
      case 1:
        return <AppstoreOutlined className="text-2xl text-primaryGold" />;
      case 2:
        return <DollarCircleOutlined className="text-2xl text-green-600" />;
      case 3:
        return <InboxOutlined className="text-2xl text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 font-outfit text-xs text-ink">
      <div>
        <h1 className="font-playfair text-2xl font-bold tracking-wide text-ink">
          {t('admin.dashboard.title')}
        </h1>
        <p className="text-xs text-charcoal font-light mt-1">
          {t('admin.dashboard.subtitle')}
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`border border-borderGray p-6 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] rounded-none ${card.bg}`}
          >
            <div className="space-y-1">
              <span className="text-[10px] text-charcoal uppercase tracking-wider font-semibold">
                {card.title}
              </span>
              <div className="text-xl font-bold text-ink font-mono">{card.value}</div>
            </div>
            <div>{getIcon(idx)}</div>
          </div>
        ))}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shortcuts */}
        <div className="lg:col-span-2 bg-white border border-borderGray p-6 space-y-6 rounded-none">
          <h3 className="font-playfair text-sm font-bold uppercase tracking-widest text-primaryGold border-b border-borderGray pb-3">
            {t('admin.dashboard.shortcuts')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              type="default"
              onClick={() => router.push('/admin/products')}
              className="h-24 flex flex-col items-center justify-center gap-2 border border-borderGray hover:border-primaryGold rounded-none text-xs font-semibold text-ink uppercase tracking-wider cursor-pointer"
            >
              <ShoppingOutlined className="text-lg text-primaryGold" />
              Quản lý sản phẩm
            </Button>
            <Button
              type="default"
              onClick={() => router.push('/admin/categories')}
              className="h-24 flex flex-col items-center justify-center gap-2 border border-borderGray hover:border-primaryGold rounded-none text-xs font-semibold text-ink uppercase tracking-wider cursor-pointer"
            >
              <AppstoreOutlined className="text-lg text-primaryGold" />
              Quản lý danh mục
            </Button>
            <Button
              type="default"
              onClick={() => router.push('/admin/profile')}
              className="h-24 flex flex-col items-center justify-center gap-2 border border-borderGray hover:border-primaryGold rounded-none text-xs font-semibold text-ink uppercase tracking-wider cursor-pointer"
            >
              <UserOutlined className="text-lg text-primaryGold" />
              Thông tin cá nhân
            </Button>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white border border-borderGray p-6 space-y-6 rounded-none">
          <h3 className="font-playfair text-sm font-bold uppercase tracking-widest text-primaryGold border-b border-borderGray pb-3">
            {t('admin.dashboard.activity')}
          </h3>
          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="flex justify-between items-start text-xs border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                <div className="space-y-1 pr-4">
                  <p className="text-ink font-light leading-relaxed">{act.text}</p>
                  <span className="text-[9px] text-zinc-400 block font-mono">{act.time}</span>
                </div>
                <ArrowRightOutlined className="text-[9px] text-zinc-300 mt-1 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
