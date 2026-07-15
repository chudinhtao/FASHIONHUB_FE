'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProductDetailView } from '../hooks';
import { Button } from '@/components/ui';
import { InputNumber } from 'antd';
import { getImageUrl } from '@/lib/utils';

export default function ProductDetailView() {
  const {
    t,
    product,
    isLoading,
    isError,
    refetch,
    selectedImage,
    setSelectedImage,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    activeVariant,
    hasStock,
    stockCount,
    handleQtyChange,
    handleAddToCart,
  } = useProductDetailView();

  if (isLoading) {
    return (
      <div className="bg-bgLight min-h-screen text-ink pb-16">
        <main className="max-w-7xl w-full mx-auto px-6 py-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-zinc-150 animate-pulse border border-borderGray"></div>
            <div className="space-y-6">
              <div className="h-4 w-24 bg-zinc-200 animate-pulse"></div>
              <div className="h-8 w-3/4 bg-zinc-200 animate-pulse"></div>
              <div className="h-6 w-32 bg-zinc-200 animate-pulse"></div>
              <div className="h-24 w-full bg-zinc-200 animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="bg-bgLight min-h-screen text-ink pb-16">
        <main className="max-w-7xl w-full mx-auto px-6 py-24 text-center space-y-4">
          <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-red-800">
            {t('product.state.errorTitle', 'Không thể tải thông tin sản phẩm')}
          </h4>
          <Button
            onClick={() => refetch()}
            className="bg-red-800 hover:bg-red-900 border-none text-white text-xs font-semibold px-6 py-2.5 uppercase tracking-widest font-outfit transition-colors rounded-none cursor-pointer h-auto"
          >
            {t('product.state.retry', 'Thử Lại')}
          </Button>
        </main>
      </div>
    );
  }

  const colors = Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean))) as string[];
  const sizes = Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean))) as string[];

  const currentPrice = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;

  return (
    <div className="bg-bgLight min-h-screen text-ink pb-16">
      <main className="max-w-7xl w-full mx-auto px-6 py-12 flex-grow space-y-8">
        
        {/* Breadcrumbs */}
        <div className="text-[10px] uppercase tracking-wider text-charcoal font-outfit select-none">
          <Link href="/" className="hover:text-ink">
            {t('product.breadcrumbs.home', 'Trang chủ')}
          </Link>
          <span className="mx-2 text-borderGray">/</span>
          <Link href="/products" className="hover:text-ink">
            {t('product.breadcrumbs.shop', 'Cửa hàng')}
          </Link>
          <span className="mx-2 text-borderGray">/</span>
          <span className="text-ink font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Large Image */}
            <div className="w-full aspect-[3/4] bg-bg-neutral border border-border-gray overflow-hidden select-none relative">
              <Image
                src={getImageUrl(selectedImage, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=700&q=80')}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnails Grid */}
            <div className="grid grid-cols-4 gap-4 select-none">
              {product.images.map((img) => {
                const isActive = selectedImage === img.url;
                return (
                  <Button
                    type="text"
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`aspect-[3/4] bg-bg-neutral overflow-hidden transition-all duration-300 cursor-pointer p-0 h-auto rounded-none border relative w-full ${
                      isActive ? 'border-ink' : 'border-border-gray hover:border-ink'
                    }`}
                  >
                    <Image
                      src={getImageUrl(img.url)}
                      alt="thumbnail"
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Info & Options */}
          <div className="space-y-6">
            <div>
              <span className="text-[10px] text-charcoal font-semibold uppercase tracking-wider">
                {product.category.name}
              </span>
              <h1 className="font-playfair text-2xl md:text-3xl font-bold tracking-wide text-ink mt-1">
                {product.name}
              </h1>
              {activeVariant && (
                <div className="text-xs text-charcoal font-mono mt-2 uppercase tracking-widest">
                  SKU: {activeVariant.sku}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-baseline space-x-4 border-b border-borderGray pb-6">
              <span className="text-xl font-semibold font-mono text-primaryGold">
                {currentPrice.toLocaleString('vi-VN')} ₫
              </span>
              {originalPrice && (
                <span className="text-sm text-charcoal line-through font-mono">
                  {originalPrice.toLocaleString('vi-VN')} ₫
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs text-charcoal leading-relaxed max-w-md font-light">
              {product.description || t('product.noDescription', 'Sản phẩm không có mô tả chi tiết.')}
            </p>

            {/* Dynamic Form Fields */}
            <div className="space-y-6 pt-6 border-t border-borderGray">
              {/* Color selection */}
              {colors.length > 0 && (
                <div className="space-y-2 select-none">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal">
                    {t('product.fields.color', 'Màu sắc')}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => {
                      const isActive = selectedColor === color;
                      return (
                        <Button
                          key={color}
                          onClick={() => {
                            setSelectedColor(color);
                            setQuantity(1);
                          }}
                          className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest font-outfit bg-white transition-all cursor-pointer h-auto rounded-none ${
                            isActive
                              ? 'border-2 border-ink text-ink font-bold'
                              : 'border border-borderGray hover:border-ink text-charcoal hover:text-ink'
                          }`}
                        >
                          {color}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size selection */}
              {sizes.length > 0 && (
                <div className="space-y-2 select-none">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal">
                    {t('product.fields.size', 'Kích cỡ (Size)')}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => {
                      const isActive = selectedSize === size;
                      return (
                        <Button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setQuantity(1);
                          }}
                          className={`w-10 h-10 flex items-center justify-center text-xs font-semibold font-outfit bg-white transition-all cursor-pointer rounded-none ${
                            isActive
                              ? 'border-2 border-ink text-ink font-bold'
                              : 'border border-borderGray hover:border-ink text-charcoal hover:text-ink'
                          }`}
                        >
                          {size}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Level Status */}
              <div className="text-xs text-zinc-500 flex items-center space-x-2 font-outfit select-none">
                <span className={`w-1.5 h-1.5 rounded-full ${hasStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>
                  {hasStock
                    ? t('product.stock.available', {
                        count: stockCount,
                        defaultValue: `Tồn kho của phân loại: Còn lại ${stockCount} sản phẩm`,
                      })
                    : t('product.stock.outOfStock', 'Phân loại này hiện đã HẾT HÀNG')}
                </span>
              </div>

              {/* Quantity selector and CTA button */}
              <div className="flex gap-4 pt-2 select-none items-center">
                {/* Quantity picker */}
                <InputNumber
                  min={1}
                  max={activeVariant?.stock || 1}
                  value={hasStock ? quantity : 0}
                  onChange={(val) => val && setQuantity(val)}
                  disabled={!hasStock}
                  size="large"
                  className="h-12 flex items-center rounded-none font-mono text-xs border-borderGray w-24"
                  controls={true}
                />

                {/* Add to Cart CTA */}
                <Button
                  onClick={handleAddToCart}
                  disabled={!hasStock}
                  type="primary"
                  className={`flex-grow h-12 text-xs font-bold uppercase tracking-widest font-outfit transition-all duration-300 rounded-none cursor-pointer border-none flex items-center justify-center ${
                    hasStock
                      ? 'bg-ink hover:bg-primaryGold text-white hover:text-white'
                      : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  {hasStock ? t('product.cta.addToCart', 'THÊM VÀO GIỎ HÀNG') : t('product.cta.outOfStock', 'HẾT HÀNG')}
                </Button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
