'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';
import { useLogout } from '@/features/auth/hooks';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { logout } = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    {
      name: t('admin.menu.categories', 'Quản Lý Danh Mục'),
      path: '/admin/categories',
    },
    {
      name: t('admin.menu.products', 'Quản Lý Sản Phẩm'),
      path: '/admin/products',
    },
    {
      name: t('admin.menu.orders', 'Quản Lý Đơn Hàng'),
      path: '/admin/orders',
    },
    {
      name: t('admin.menu.profile', 'Hồ Sơ Cá Nhân'),
      path: '/admin/profile',
    },
  ];

  return (
    <div className="min-h-screen bg-bgLight text-ink flex relative overflow-x-hidden">
      {/* BACKGROUND OVERLAY FOR MOBILE */}
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ADMIN SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#121212] text-zinc-400 border-r border-borderGray z-50 select-none flex flex-col justify-between font-outfit transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Admin Logo */}
          <div className="h-[72px] border-b border-zinc-800 flex items-center justify-between px-6">
            <Link href="/" className="font-playfair text-white text-base font-bold tracking-[0.15em] uppercase hover:text-primaryGold transition-colors">
              FASHIONHUB ADMIN
            </Link>
            <button
              onClick={closeSidebar}
              className="md:hidden w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
            >
              <CloseOutlined style={{ fontSize: '16px' }} />
            </button>
          </div>
          {/* Nav Links */}
          <nav className="p-4 space-y-2 text-xs font-semibold uppercase tracking-wider">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-none transition-colors ${
                    isActive
                      ? 'bg-primaryGold text-ink font-bold border-l-4 border-white'
                      : 'hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* User profile section at bottom of sidebar */}
        <Link href="/admin/profile" onClick={closeSidebar} className="p-4 border-t border-zinc-800 text-xs block hover:bg-zinc-900 transition-colors">
          <div className="text-white font-bold font-outfit">
            {user ? user.name : 'Administrator'}
          </div>
          <div className="text-zinc-500 mt-1 font-mono">
            {user ? user.email : 'admin@fashionhub.com'}
          </div>
        </Link>
      </aside>
 
      {/* RIGHT CONTAINER */}
      <div className="flex-grow pl-0 md:pl-64 flex flex-col min-h-screen w-full">
        {/* ADMIN TOPBAR */}
        <header className="sticky top-0 z-30 h-[72px] px-4 md:px-6 bg-bgLight border-b border-borderGray flex items-center justify-between font-outfit">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex items-center justify-center w-9 h-9 text-ink hover:text-primaryGold transition-colors cursor-pointer border-none bg-transparent"
              aria-label="Mở sidebar admin"
            >
              <MenuOutlined style={{ fontSize: '18px' }} />
            </button>

            {/* Breadcrumb */}
            <div className="text-[10px] font-medium uppercase tracking-wider text-charcoal">
              <span>{t('admin.breadcrumb.admin', 'Quản trị')}</span>
              <span className="mx-2 text-borderGray">/</span>
              <span className="text-ink font-semibold">
                {pathname.includes('categories')
                  ? t('admin.breadcrumb.categories', 'Danh mục')
                  : pathname.includes('orders')
                  ? t('admin.breadcrumb.orders', 'Đơn hàng')
                  : pathname.includes('profile')
                  ? t('admin.breadcrumb.profile', 'Hồ sơ cá nhân')
                  : t('admin.breadcrumb.products', 'Sản phẩm')}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Language Switcher */}
            <div className="flex gap-1.5 select-none text-[10px] font-bold font-outfit shrink-0 items-center">
              <span 
                className={`cursor-pointer transition-colors ${currentLanguage === 'vi' ? 'text-primaryGold underline' : 'text-zinc-400 hover:text-black'}`}
                onClick={() => i18n.changeLanguage('vi')}
              >
                VI
              </span>
              <span className="text-zinc-300">|</span>
              <span 
                className={`cursor-pointer transition-colors ${currentLanguage === 'en' ? 'text-primaryGold underline' : 'text-zinc-400 hover:text-black'}`}
                onClick={() => i18n.changeLanguage('en')}
              >
                EN
              </span>
            </div>

            <Button
              type="link"
              danger
              onClick={handleLogout}
              className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider cursor-pointer p-0 h-auto"
            >
              {t('admin.topbar.logout', 'Đăng Xuất')}
            </Button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="px-4 md:px-6 py-6 md:py-8 flex-grow w-full">
          <div className="max-w-[1360px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
