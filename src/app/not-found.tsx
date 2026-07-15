'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="bg-bgLight text-ink min-h-screen flex flex-col justify-between">
      {/* Header (Simplified Mock) */}
      <header className="bg-bgLight/90 backdrop-blur-md border-b border-borderGray sticky top-0 z-50 select-none">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="font-playfair text-[1.8rem] font-bold tracking-[0.2em] text-ink uppercase">
              FASHIONHUB
            </Link>
          </div>
        </div>
      </header>

      {/* Main 404 Display */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20 select-none">
        <div className="max-w-md space-y-6">
          <h1 className="font-playfair text-[8rem] font-bold text-ink leading-none tracking-tighter">404</h1>

          <div className="space-y-2">
            <h2 className="font-playfair text-xl font-bold uppercase tracking-wider text-ink">
              {t('error.404.title', 'Không tìm thấy trang yêu cầu')}
            </h2>
            <div className="w-12 h-[1px] bg-primaryGold mx-auto mt-3"></div>
          </div>

          <p className="text-xs text-charcoal leading-relaxed font-light">
            {t('error.404.description', 'Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi cấu trúc liên kết. Vui lòng quay lại trang chủ cửa hàng.')}
          </p>

          <div className="pt-4">
            <Button
              onClick={() => router.push('/')}
              className="bg-ink hover:bg-primaryGold text-white hover:text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest font-outfit transition-all duration-300 rounded-none cursor-pointer border-none h-auto"
            >
              {t('error.404.cta', 'QUAY LẠI TRANG CHỦ')}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-bgLight border-t border-zinc-800 font-outfit py-8 text-center text-xs">
        <span className="text-zinc-500 font-light">
          © 2026 FashionHub. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
