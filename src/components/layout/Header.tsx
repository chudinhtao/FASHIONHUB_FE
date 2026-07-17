'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useCartView } from '@/features/cart/hooks';
import { ShoppingCartOutlined, UserOutlined, DownOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Badge, Space } from 'antd';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const user = useAuthStore((state) => state.user);
  const { totalCount } = useCartView();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-borderGray bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="font-outfit text-xl font-bold tracking-widest text-black">
            FASHIONHUB
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-wide h-full items-center">
            <Link href="/products?sortBy=newest" className="text-zinc-600 hover:text-black transition-colors py-4">
              {t('nav.newArrivals', 'MỚI VỀ')}
            </Link>

            {/* MEN Dropdown */}
            <div className="relative group h-full flex items-center">
              <Link href="/products?categorySlug=ao-nam" className="text-zinc-600 hover:text-black transition-colors flex items-center gap-1 py-4 cursor-pointer">
                {t('nav.men', 'ĐỒ NAM')} <DownOutlined className="text-[9px] opacity-70 group-hover:rotate-180 transition-transform duration-300" />
              </Link>
              <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-48 bg-white border border-borderGray shadow-[0_12px_30px_rgba(0,0,0,0.06)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2.5 z-50 flex flex-col">
                <Link href="/products?categorySlug=ao-polo" className="px-5 py-2 text-xs text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">
                  {t('nav.categories.polo', 'Áo Polo')}
                </Link>
                <Link href="/products?categorySlug=ao-so-mi" className="px-5 py-2 text-xs text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">
                  {t('nav.categories.shirt', 'Áo Sơ Mi')}
                </Link>
                <Link href="/products?categorySlug=ao-thun" className="px-5 py-2 text-xs text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">
                  {t('nav.categories.tshirt', 'Áo Thun')}
                </Link>
                <div className="h-[1px] bg-borderGray my-1.5 mx-4" />
                <Link href="/products?categorySlug=quan-jeans" className="px-5 py-2 text-xs text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">
                  {t('nav.categories.jeans', 'Quần Jeans')}
                </Link>
                <Link href="/products?categorySlug=quan-kaki" className="px-5 py-2 text-xs text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">
                  {t('nav.categories.kaki', 'Quần Kaki')}
                </Link>
              </div>
            </div>

            {/* WOMEN Dropdown */}
            <div className="relative group h-full flex items-center">
              <Link href="/products?categorySlug=ao-nu" className="text-zinc-600 hover:text-black transition-colors flex items-center gap-1 py-4 cursor-pointer">
                {t('nav.women', 'ĐỒ NỮ')} <DownOutlined className="text-[9px] opacity-70 group-hover:rotate-180 transition-transform duration-300" />
              </Link>
              <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-44 bg-white border border-borderGray shadow-[0_12px_30px_rgba(0,0,0,0.06)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2.5 z-50 flex flex-col">
                <Link href="/products?categorySlug=ao-nu" className="px-5 py-2 text-xs text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">
                  {t('nav.categories.blouse', 'Áo Blouse & Blazer')}
                </Link>
                <Link href="/products?categorySlug=vay-dam" className="px-5 py-2 text-xs text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">
                  {t('nav.categories.dress', 'Váy & Đầm')}
                </Link>
              </div>
            </div>

            {/* ACCESSORIES Dropdown */}
            <div className="relative group h-full flex items-center">
              <Link href="/products?categorySlug=phu-kien" className="text-zinc-600 hover:text-black transition-colors flex items-center gap-1 py-4 cursor-pointer">
                {t('nav.accessories', 'PHỤ KIỆN')} <DownOutlined className="text-[9px] opacity-70 group-hover:rotate-180 transition-transform duration-300" />
              </Link>
              <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-40 bg-white border border-borderGray shadow-[0_12px_30px_rgba(0,0,0,0.06)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2.5 z-50 flex flex-col">
                <Link href="/products?categorySlug=that-lung" className="px-5 py-2 text-xs text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">
                  {t('nav.categories.belt', 'Thắt Lưng')}
                </Link>
                <Link href="/products?categorySlug=vi-da" className="px-5 py-2 text-xs text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">
                  {t('nav.categories.wallet', 'Ví Da')}
                </Link>
              </div>
            </div>

            <Link href="/products" className="text-zinc-600 hover:text-black transition-colors py-4">
              {t('nav.allProducts', 'TẤT CẢ SẢN PHẨM')}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Space size="large">
              {/* Language Switcher */}
              <div className="hidden sm:flex gap-1.5 select-none text-[10px] font-bold font-outfit shrink-0 items-center">
                <span className={`cursor-pointer transition-colors ${currentLanguage === 'vi' ? 'text-primaryGold underline' : 'text-zinc-400 hover:text-black'}`} onClick={() => i18n.changeLanguage('vi')}>VI</span>
                <span className="text-zinc-200">|</span>
                <span className={`cursor-pointer transition-colors ${currentLanguage === 'en' ? 'text-primaryGold underline' : 'text-zinc-400 hover:text-black'}`} onClick={() => i18n.changeLanguage('en')}>EN</span>
              </div>

              {/* Account */}
              <Link href={user ? '/profile' : '/login'} className="text-zinc-600 hover:text-black transition-all-300">
                <Space size={4}>
                  <UserOutlined style={{ fontSize: '18px' }} />
                  <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider">
                    {user ? user.name : t('auth.loginBtn')}
                  </span>
                </Space>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="text-zinc-600 hover:text-black transition-all-300">
                <Badge count={totalCount} size="small" color="#C5A880">
                  <ShoppingCartOutlined style={{ fontSize: '22px' }} />
                </Badge>
              </Link>
            </Space>

            {/* Hamburger (mobile only) */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 text-ink hover:text-primaryGold transition-colors cursor-pointer border-none bg-transparent"
              onClick={() => setMobileOpen(true)}
              aria-label={t('nav.openMenu', 'Mở menu điều hướng')}
            >
              <MenuOutlined style={{ fontSize: '20px' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        onClick={closeMobile}
        className={`fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[90] shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-borderGray shrink-0">
          <Link href="/" onClick={closeMobile} className="font-outfit text-base font-bold tracking-widest text-black">
            FASHIONHUB
          </Link>
          <button onClick={closeMobile} className="w-8 h-8 flex items-center justify-center text-charcoal hover:text-ink transition-colors cursor-pointer border-none bg-transparent">
            <CloseOutlined style={{ fontSize: '16px' }} />
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex-grow overflow-y-auto py-2 font-outfit">
          <Link href="/products?sortBy=newest" onClick={closeMobile} className="flex px-6 py-4 text-xs font-bold uppercase tracking-wider border-b border-borderGray text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">
            {t('nav.newArrivals', 'Mới Về')}
          </Link>

          <div className="px-6 pt-4 pb-1 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{t('nav.men', 'Đồ Nam')}</div>
          <Link href="/products?categorySlug=ao-polo" onClick={closeMobile} className="flex pl-9 pr-6 py-3 text-xs font-medium text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">{t('nav.categories.polo', 'Áo Polo')}</Link>
          <Link href="/products?categorySlug=ao-so-mi" onClick={closeMobile} className="flex pl-9 pr-6 py-3 text-xs font-medium text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">{t('nav.categories.shirt', 'Áo Sơ Mi')}</Link>
          <Link href="/products?categorySlug=ao-thun" onClick={closeMobile} className="flex pl-9 pr-6 py-3 text-xs font-medium text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">{t('nav.categories.tshirt', 'Áo Thun')}</Link>
          <Link href="/products?categorySlug=quan-jeans" onClick={closeMobile} className="flex pl-9 pr-6 py-3 text-xs font-medium text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">{t('nav.categories.jeans', 'Quần Jeans')}</Link>
          <Link href="/products?categorySlug=quan-kaki" onClick={closeMobile} className="flex pl-9 pr-6 py-3 text-xs font-medium border-b border-borderGray text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">{t('nav.categories.kaki', 'Quần Kaki')}</Link>

          <div className="px-6 pt-4 pb-1 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{t('nav.women', 'Đồ Nữ')}</div>
          <Link href="/products?categorySlug=ao-nu" onClick={closeMobile} className="flex pl-9 pr-6 py-3 text-xs font-medium text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">{t('nav.categories.blouse', 'Áo Blouse & Blazer')}</Link>
          <Link href="/products?categorySlug=vay-dam" onClick={closeMobile} className="flex pl-9 pr-6 py-3 text-xs font-medium border-b border-borderGray text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">{t('nav.categories.dress', 'Váy & Đầm')}</Link>

          <div className="px-6 pt-4 pb-1 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{t('nav.accessories', 'Phụ Kiện')}</div>
          <Link href="/products?categorySlug=that-lung" onClick={closeMobile} className="flex pl-9 pr-6 py-3 text-xs font-medium text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">{t('nav.categories.belt', 'Thắt Lưng')}</Link>
          <Link href="/products?categorySlug=vi-da" onClick={closeMobile} className="flex pl-9 pr-6 py-3 text-xs font-medium border-b border-borderGray text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">{t('nav.categories.wallet', 'Ví Da')}</Link>

          <Link href="/products" onClick={closeMobile} className="flex px-6 py-4 text-xs font-bold uppercase tracking-wider text-charcoal hover:text-primaryGold hover:bg-zinc-50 transition-colors">
            {t('nav.allProducts', 'Tất Cả Sản Phẩm')}
          </Link>
        </nav>

        {/* Drawer Footer */}
        <div className="px-6 py-5 border-t border-borderGray shrink-0 flex items-center justify-between">
          <Link href={user ? '/profile' : '/login'} onClick={closeMobile} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal hover:text-ink transition-colors">
            <UserOutlined style={{ fontSize: '16px' }} />
            {user ? user.name : t('auth.loginBtn')}
          </Link>
          <div className="flex gap-2 text-[10px] font-bold font-outfit">
            <span className={`cursor-pointer ${currentLanguage === 'vi' ? 'text-primaryGold underline' : 'text-zinc-400'}`} onClick={() => i18n.changeLanguage('vi')}>VI</span>
            <span className="text-zinc-300">|</span>
            <span className={`cursor-pointer ${currentLanguage === 'en' ? 'text-primaryGold underline' : 'text-zinc-400'}`} onClick={() => i18n.changeLanguage('en')}>EN</span>
          </div>
        </div>
      </div>
    </>
  );
}
