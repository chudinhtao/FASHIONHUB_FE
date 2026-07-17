'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useRelatedProducts } from '../hooks';
import { getImageUrl } from '@/lib/utils';

interface RelatedProductsProps {
  productId: string;
  categorySlug: string;
}

export default function RelatedProducts({ productId, categorySlug }: RelatedProductsProps) {
  const { t } = useTranslation();
  const { relatedProducts } = useRelatedProducts(productId, categorySlug);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="border-t border-borderGray pt-16 mt-16 space-y-8 select-none">
      <div className="text-center space-y-2 select-none">
        <span className="text-[9px] text-primaryGold font-bold uppercase tracking-[0.2em] font-outfit">
          {t('product.related.subtitle', 'CÓ THỂ BẠN CŨNG THÍCH')}
        </span>
        <h2 className="font-playfair text-2xl md:text-3xl font-bold tracking-wider text-ink">
          {t('product.related.title', 'SẢN PHẨM LIÊN QUAN')}
        </h2>
        <div className="w-12 h-[1px] bg-primaryGold mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {relatedProducts.map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.slug}`}
            className="bg-white border border-borderGray p-4 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-primaryGold transition-all duration-300 relative rounded-none"
          >
            <div>
              <div className="w-full aspect-[3/4] bg-zinc-100 mb-4 overflow-hidden relative">
                <img
                  src={getImageUrl(item.primaryImage, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80')}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute bottom-0 left-0 w-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm border-t border-borderGray">
                  <span className="w-full block text-center bg-[#000000] text-white hover:bg-primaryGold transition-all duration-300 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-none">
                    {t('product.cta.viewDetail', 'XEM CHI TIẾT')}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-charcoal font-semibold uppercase tracking-wider font-outfit">
                {item.category?.name}
              </span>
              <h4 className="font-outfit text-sm font-medium text-ink mt-1 line-clamp-1">{item.name}</h4>
            </div>
            <div className="mt-4 pt-3 border-t border-borderGray flex items-baseline justify-between">
              <span className="text-sm font-semibold font-mono text-primaryGold">
                {Number(item.price).toLocaleString('vi-VN')} ₫
              </span>
              {item.originalPrice && (
                <span className="text-xs text-charcoal line-through font-mono">
                  {Number(item.originalPrice).toLocaleString('vi-VN')} ₫
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
