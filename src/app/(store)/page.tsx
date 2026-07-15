'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/features/product/hooks';
import { ProductShort } from '@/types';
import { Button } from '@/components/ui';

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  
  // Fetch top 4 products for new arrivals
  const { data: response, isLoading } = useProducts({ limit: 4, sortBy: 'newest' });
  const products: ProductShort[] = response?.data || [];

  return (
    <div className="bg-bgLight min-h-screen text-ink pb-12">
      {/* Editorial Lookbook Hero Banner */}
      <section className="relative h-[650px] w-full bg-zinc-900 overflow-hidden select-none">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
          alt="Main Campaign Banner"
          className="w-full h-full object-cover opacity-80"
        />
        {/* Center text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 space-y-6">
          <span className="text-[10px] text-primaryGold font-bold uppercase tracking-[0.3em] font-outfit">
            {t('home.hero.subtitle', 'BỘ SƯU TẬP MÙA HÈ 2026')}
          </span>
          <h1 className="font-playfair text-white text-4xl md:text-6xl font-bold uppercase tracking-wider leading-tight max-w-3xl">
            {t('home.hero.title', 'Khai Phóng Sự Tinh Tế & Phóng Khoáng')}
          </h1>
          <p className="text-xs text-zinc-300 font-light max-w-md tracking-wider font-outfit">
            {t('home.hero.description', 'Trải nghiệm phom dáng tối giản hiện đại được định hình từ các loại chất liệu dệt tự nhiên thượng hạng.')}
          </p>
          <Button
            onClick={() => router.push('/products')}
            className="bg-[#FCFCFB] text-ink hover:bg-primaryGold hover:text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-none cursor-pointer border-none h-auto"
          >
            {t('home.hero.cta', 'KHÁM PHÁ NGAY')}
          </Button>
        </div>
      </section>

      {/* 3-Column Asymmetric Category Banners */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-6">
        <div className="text-center space-y-2 select-none">
          <span className="text-[9px] text-primaryGold font-bold uppercase tracking-widest">
            {t('home.categories.subtitle', 'Danh Mục Phổ Biến')}
          </span>
          <h2 className="font-playfair text-2xl font-bold tracking-wider text-ink">
            {t('home.categories.title', 'BỘ SƯU TẬP NỔI BẬT')}
          </h2>
          <div className="w-12 h-[1px] bg-primaryGold mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Category 1 */}
          <div
            onClick={() => router.push('/products?categorySlug=ao-nam')}
            className="relative aspect-[3/4] bg-zinc-800 overflow-hidden cursor-pointer group rounded-none"
          >
            <img
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80"
              alt="Ao Nam"
              className="w-full h-full object-cover opacity-80 group-hover:scale-[1.04] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
            <div className="absolute bottom-6 left-6 text-white space-y-1">
              <h3 className="font-playfair text-xl font-bold tracking-wider">{t('home.categories.mens', 'ĐỒ NAM')}</h3>
              <span className="text-[10px] text-primaryGold font-semibold uppercase tracking-widest font-outfit block">
                {t('home.categories.explore', 'Xem chi tiết >')}
              </span>
            </div>
          </div>

          {/* Category 2 */}
          <div
            onClick={() => router.push('/products?categorySlug=ao-polo')}
            className="relative aspect-[3/4] bg-zinc-800 overflow-hidden cursor-pointer group rounded-none"
          >
            <img
              src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80"
              alt="Ao Polo"
              className="w-full h-full object-cover opacity-80 group-hover:scale-[1.04] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
            <div className="absolute bottom-6 left-6 text-white space-y-1">
              <h3 className="font-playfair text-xl font-bold tracking-wider">{t('home.categories.polos', 'ÁO POLO')}</h3>
              <span className="text-[10px] text-primaryGold font-semibold uppercase tracking-widest font-outfit block">
                {t('home.categories.explore', 'Xem chi tiết >')}
              </span>
            </div>
          </div>

          {/* Category 3 */}
          <div
            onClick={() => router.push('/products?categorySlug=phu-kien')}
            className="relative aspect-[3/4] bg-zinc-800 overflow-hidden cursor-pointer group rounded-none"
          >
            <img
              src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&q=80"
              alt="Phu Kien"
              className="w-full h-full object-cover opacity-80 group-hover:scale-[1.04] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
            <div className="absolute bottom-6 left-6 text-white space-y-1">
              <h3 className="font-playfair text-xl font-bold tracking-wider">{t('home.categories.accessories', 'PHỤ KIỆN')}</h3>
              <span className="text-[10px] text-primaryGold font-semibold uppercase tracking-widest font-outfit block">
                {t('home.categories.explore', 'Xem chi tiết >')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Featured Grid Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20 space-y-6">
        <div className="text-center space-y-2 select-none">
          <span className="text-[9px] text-primaryGold font-bold uppercase tracking-widest">
            {t('home.arrivals.subtitle', 'Sản Phẩm Lựa Chọn')}
          </span>
          <h2 className="font-playfair text-2xl font-bold tracking-wider text-ink">
            {t('home.arrivals.title', 'MỚI VỀ TRONG TUẦN')}
          </h2>
          <div className="w-12 h-[1px] bg-primaryGold mx-auto mt-3"></div>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-borderGray p-4 flex flex-col justify-between rounded-none">
                <div>
                  <div className="w-full aspect-[3/4] bg-zinc-100 mb-4 animate-pulse"></div>
                  <div className="h-3 w-16 bg-zinc-200 animate-pulse mb-2"></div>
                  <div className="h-4 w-40 bg-zinc-200 animate-pulse"></div>
                </div>
                <div className="mt-6 pt-2 border-t border-zinc-100">
                  <div className="h-4 w-20 bg-zinc-200 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 4-Column Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-bgLight border border-borderGray p-4 flex flex-col justify-between group hover:shadow-[0_4px_24px_rgba(28,27,26,0.03)] hover:border-primaryGold transition-all duration-300 rounded-none cursor-pointer"
              >
                <div>
                  <div className="w-full aspect-[3/4] bg-zinc-100 mb-4 overflow-hidden relative">
                    <img
                      src={product.primaryImage || 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] text-charcoal font-semibold uppercase tracking-wider font-outfit">
                    {product.category.name}
                  </span>
                  <h4 className="font-outfit text-sm font-medium text-ink mt-1 line-clamp-1">{product.name}</h4>
                </div>
                <div className="mt-4 pt-2 border-t border-zinc-100 flex items-baseline justify-between">
                  <span className="text-sm font-semibold font-mono text-primaryGold">
                    {Number(product.price).toLocaleString('vi-VN')} ₫
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-charcoal line-through font-mono">
                      {Number(product.originalPrice).toLocaleString('vi-VN')} ₫
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
