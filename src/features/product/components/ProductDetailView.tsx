'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MinusOutlined, PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { useProductDetailView } from '../hooks';
import { Button } from '@/components/ui';
import RelatedProducts from './RelatedProducts';
import { getImageUrl } from '@/lib/utils';
import { ReviewList, ReviewStats, ReviewForm, useProductStats, useCanReview } from '@/features/reviews';
import { useAuthStore } from '@/store/auth';

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
    activeVariant,
    hasStock,
    stockCount,
    handleQtyChange,
    handleAddToCart,
  } = useProductDetailView();

  const { isAuthenticated } = useAuthStore();
  const { data: stats } = useProductStats(product?.id || '');
  const { data: canReviewData, isLoading: canReviewLoading } = useCanReview(product?.id || '');



  if (isLoading) {
    return (
      <div className="bg-bgLight min-h-screen text-ink pb-16">
        <main className="max-w-7xl w-full mx-auto px-6 pt-4 pb-12 space-y-6">
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
        <main className="max-w-7xl w-full mx-auto px-6 pt-4 pb-24 text-center space-y-4">
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

  // Helper function to map standard colors to hex for circular preview capsules
  const getColorHex = (colorName: string) => {
    const name = colorName.toLowerCase();
    if (name.includes('black') || name.includes('đen')) return '#1A1A1A';
    if (name.includes('white') || name.includes('trắng')) return '#FFFFFF';
    if (name.includes('red') || name.includes('đỏ')) return '#A31D1D';
    if (name.includes('blue') || name.includes('xanh')) return '#1E3E62';
    if (name.includes('grey') || name.includes('xám') || name.includes('gray')) return '#808080';
    if (name.includes('gold') || name.includes('vàng')) return '#B3936B';
    if (name.includes('cream') || name.includes('kem')) return '#FFFDD0';
    if (name.includes('brown') || name.includes('nâu')) return '#5C4033';
    return null;
  };

  return (
    <div className="bg-bgLight min-h-screen text-ink pb-16">
      <main className="max-w-7xl w-full mx-auto px-6 pt-4 pb-12 flex-grow space-y-8">
        
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
          <div className="flex gap-4">
            {/* Thumbnails (vertical on the left) */}
            <div className="flex flex-col gap-3 w-16 sm:w-20 shrink-0 select-none">
              {product.images.map((img) => {
                const isActive = selectedImage === img.url;
                return (
                  <Button
                    type="text"
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`aspect-[3/4] bg-bg-neutral overflow-hidden transition-all duration-300 cursor-pointer p-0 h-auto rounded-none border relative w-full ${
                      isActive ? 'border-primaryGold border-2 scale-105 shadow-[0_4px_12px_rgba(197,168,128,0.25)] ring-1 ring-primaryGold/20' : 'border-border-gray hover:border-primaryGold'
                    }`}
                  >
                    <Image
                      src={getImageUrl(img.url)}
                      alt="thumbnail"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Button>
                );
              })}
            </div>

            {/* Main Large Image */}
            <div className="flex-grow aspect-[3/4] bg-bg-neutral border border-border-gray overflow-hidden select-none relative">
              <Image
                src={getImageUrl(selectedImage, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=700&q=80')}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
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



            {/* Dynamic Form Fields */}
            <div className="space-y-6 pt-6 border-t border-borderGray">
              
              {/* Color selection - Redesigned to be highly visual */}
              {colors.length > 0 && (
                <div className="space-y-3.5 select-none">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal block">
                    {t('product.fields.color', 'Màu sắc')}
                    {selectedColor && (
                      <span className="text-gold font-bold ml-2 uppercase text-[10px] tracking-widest">
                        — {selectedColor}
                      </span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => {
                      const isActive = selectedColor === color;
                      const hex = getColorHex(color);
                      return (
                        <Button
                          key={color}
                          onClick={() => {
                            setSelectedColor(color);
                            handleQtyChange(1 - quantity); // reset quantity selection safely
                          }}
                          className={`flex items-center gap-2.5 px-5 py-2.5 text-xs font-bold uppercase tracking-widest font-outfit transition-all duration-300 rounded-full h-auto cursor-pointer border ${
                            isActive
                              ? 'bg-primaryGold/10 text-primaryGold border-primaryGold scale-105 shadow-[0_4px_12px_rgba(197,168,128,0.15)] ring-2 ring-primaryGold/20 font-bold'
                              : 'bg-white text-charcoal border-border-light hover:border-primaryGold hover:text-primaryGold hover:scale-102'
                          }`}
                        >
                          {hex ? (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0 flex items-center justify-center"
                              style={{ backgroundColor: hex }}
                            >
                              {isActive && <CheckOutlined style={{ fontSize: '8px', color: hex === '#FFFFFF' ? '#000000' : '#ffffff' }} />}
                            </span>
                          ) : (
                            isActive && <CheckOutlined className="text-[9px] text-primaryGold" />
                          )}
                          <span>{color}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size selection - Redesigned square tiles */}
              {sizes.length > 0 && (
                <div className="space-y-3.5 select-none">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal block">
                    {t('product.fields.size', 'Kích cỡ (Size)')}
                    {selectedSize && (
                      <span className="text-gold font-bold ml-2 uppercase text-[10px] tracking-widest">
                        — {selectedSize}
                      </span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => {
                      const isActive = selectedSize === size;
                      return (
                        <Button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            handleQtyChange(1 - quantity); // reset quantity selection safely
                          }}
                          className={`w-12 h-12 flex flex-col items-center justify-center text-xs font-bold font-outfit transition-all duration-300 rounded-lg cursor-pointer border relative ${
                            isActive
                              ? 'bg-primaryGold/10 text-primaryGold border-primaryGold scale-110 shadow-[0_4px_12px_rgba(197,168,128,0.15)] font-black ring-2 ring-primaryGold/20'
                              : 'bg-white text-charcoal border-border-light hover:border-primaryGold hover:text-primaryGold hover:scale-105'
                          }`}
                        >
                          <span>{size}</span>
                          {isActive && (
                            <CheckOutlined className="absolute bottom-1 right-1 text-[8px] text-primaryGold" />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Level Status */}
              <div className="text-xs text-zinc-500 flex items-center space-x-2 font-outfit select-none pt-1">
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

              {/* Quantity selector and CTA button - Custom minimalist styling */}
              <div className="flex gap-5 pt-3 select-none items-center">
                
                {/* Custom Designer Quantity Picker */}
                <div className="flex items-center border border-borderGray h-12 bg-white rounded-none select-none shrink-0">
                  <Button
                    type="text"
                    disabled={!hasStock || quantity <= 1}
                    onClick={() => handleQtyChange(-1)}
                    className="w-10 h-full flex items-center justify-center text-charcoal hover:text-ink transition-colors cursor-pointer disabled:opacity-20 !p-0 !border-none"
                    icon={<MinusOutlined style={{ fontSize: '11px' }} />}
                  />
                  <div className="w-12 h-full flex items-center justify-center font-mono text-xs font-bold text-ink border-l border-r border-borderGray">
                    {hasStock ? quantity : 0}
                  </div>
                  <Button
                    type="text"
                    disabled={!hasStock || quantity >= stockCount}
                    onClick={() => handleQtyChange(1)}
                    className="w-10 h-full flex items-center justify-center text-charcoal hover:text-ink transition-colors cursor-pointer disabled:opacity-20 !p-0 !border-none"
                    icon={<PlusOutlined style={{ fontSize: '11px' }} />}
                  />
                </div>

                {/* Add to Cart CTA */}
                <Button
                  onClick={handleAddToCart}
                  disabled={!hasStock}
                  type="primary"
                  className={`flex-grow h-12 text-xs font-bold uppercase tracking-widest font-outfit transition-all duration-300 rounded-none cursor-pointer border-none flex items-center justify-center ${
                    hasStock
                      ? 'bg-ink hover:bg-primaryGold text-white hover:text-white shadow-md'
                      : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  {hasStock ? t('product.cta.addToCart', 'THÊM VÀO GIỎ HÀNG') : t('product.cta.outOfStock', 'HẾT HÀNG')}
                </Button>
              </div>
            </div>

          </div>

        </div>

        {/* Product Detailed Description Section */}
        <div className="border-t border-borderGray pt-12 mt-4 space-y-4">
          <h2 className="font-playfair text-sm font-bold uppercase tracking-widest text-ink">
            {t('product.descriptionTitle', 'Mô tả chi tiết sản phẩm')}
          </h2>
          <p className="text-xs text-charcoal leading-relaxed max-w-4xl font-light">
            {product.description || t('product.noDescription', 'Sản phẩm không có mô tả chi tiết.')}
          </p>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        <RelatedProducts productId={product.id} categorySlug={product.category.slug} />

        {/* REVIEWS SECTION */}
        <div className="border-t border-borderGray pt-16 mt-16 space-y-10">
          <h2 className="font-serif text-2xl uppercase tracking-wider text-ink mb-6">
            {t('product.reviews.sectionTitle', 'Đánh giá sản phẩm')}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-10 items-start">
            {/* Left side: Stats & list */}
            <div className="space-y-8">
              {stats && <ReviewStats stats={stats} />}
              <ReviewList productId={product.id} />
            </div>

            {/* Right side: Write review form / Warning placeholders */}
            <div className="sticky top-24">
              {isAuthenticated ? (
                canReviewLoading ? (
                  <div className="p-6 border border-border-light bg-[#FCFCFB] text-center">
                    <span className="text-xs text-charcoal">{t('reviews.loading', 'Đang kiểm tra điều kiện...')}</span>
                  </div>
                ) : canReviewData?.canReview ? (
                  <ReviewForm productId={product.id} />
                ) : (
                  <div className="border border-border-light p-8 text-center bg-[#FCFCFB] rounded-none">
                    <p className="text-xs font-light text-charcoal leading-relaxed">
                      {canReviewData?.reason === 'NOT_PURCHASED'
                        ? t('reviews.permission.notPurchased', 'Bạn cần mua sản phẩm này và nhận hàng thành công để viết đánh giá.')
                        : canReviewData?.reason === 'ALREADY_REVIEWED'
                        ? t('reviews.permission.alreadyReviewed', 'Cảm ơn bạn! Bạn đã gửi đánh giá cho sản phẩm này rồi.')
                        : t('reviews.permission.notAllowed', 'Bạn chưa đủ điều kiện để đánh giá sản phẩm này.')}
                    </p>
                  </div>
                )
              ) : (
                <div className="border border-border-light p-8 text-center bg-[#FCFCFB] rounded-none flex flex-col items-center">
                  <p className="text-xs font-light text-charcoal leading-relaxed mb-4">
                    {t('reviews.permission.guest', 'Đăng nhập bằng tài khoản thành viên để đánh giá trải nghiệm sản phẩm này.')}
                  </p>
                  <Link 
                    href="/login" 
                    className="border border-ink text-ink hover:bg-ink hover:text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 inline-block text-center w-full"
                  >
                    {t('reviews.permission.loginBtn', 'Đăng nhập ngay')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
