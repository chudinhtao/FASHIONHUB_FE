import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WarningOutlined, MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCartView } from '../hooks';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { CartItem } from '@/types';

export const CartList: React.FC = () => {
  const router = useRouter();
  const {
    t,
    items,
    isLoading,
    hasStockWarning,
    handleQtyChange,
    handleRemove,
    totalCount,
  } = useCartView();

  // 1. LOADING STATE
  if (isLoading) {
    return <LoadingSpinner tip={t('auth.loading', 'Đang tải giỏ hàng...')} height="400px" />;
  }

  // 2. EMPTY STATE
  if (items.length === 0) {
    return (
      <EmptyState
        title={t('cart.emptyTitle', 'GIỎ HÀNG CỦA BẠN ĐANG TRỐNG')}
        description={t('cart.emptyDesc', 'Bạn chưa thêm sản phẩm nào vào giỏ hàng của mình.')}
        actionText={t('cart.continueShopping', 'QUAY LẠI CỬA HÀNG')}
        onAction={() => router.push('/products')}
      />
    );
  }

  return (
    <div className="cart-items-wrapper w-full">
      {/* ⚠️ INVENTORY WARNING BANNER */}
      {hasStockWarning && (
        <div className="bg-[#FFFDF5] border border-[#FFE58F] p-3.5 mb-8 flex items-center gap-3 text-warning text-[13px] leading-relaxed">
          <WarningOutlined style={{ color: '#faad14', fontSize: '16px' }} />
          <div>
            <strong>{t('cart.warningTitle', 'Cảnh báo tồn kho:')}</strong>{' '}
            {t('cart.warningDesc', 'Có sản phẩm vượt quá số lượng trong kho. Vui lòng điều chỉnh lại trước khi thanh toán.')}
          </div>
        </div>
      )}

      {/* Header of Column 1 */}
      <div className="column-header flex justify-between items-end border-b-2 border-ink pb-4 mb-8 h-12">
        <h1 className="column-title font-serif text-2xl uppercase tracking-wider text-ink">{t('cart.title', 'Shopping Bag')}</h1>
        <span className="item-count-text font-sans text-[11px] font-semibold tracking-widest text-charcoal pb-1 uppercase">
          {totalCount} {totalCount === 1 ? t('cart.item', 'ITEM') : t('cart.items', 'ITEMS')}
        </span>
      </div>

      {/* Items list */}
      <div className="flex flex-col">
        {items.map((item: CartItem) => {
          const product = item.variant.product;
          const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
          const isOutOfStock = item.quantity > item.variant.stock;

          return (
            <div
              key={item.id}
              className={`cart-item-row flex justify-between items-center py-6 border-b border-border-light transition-all duration-400 group ${
                isOutOfStock ? 'border-l-2 border-l-warning pl-3' : ''
              }`}
            >
              {/* Product details */}
              <div className="item-product-info flex gap-5 items-center flex-1">
                <div className="product-img-holder w-[90px] aspect-[3/4] overflow-hidden bg-surface-light shrink-0">
                  <img
                    src={primaryImage?.url || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-800 group-hover:scale-103"
                  />
                </div>
                <div className="item-description flex flex-col gap-1">
                  <span className="item-brand text-[9px] font-bold tracking-widest uppercase text-gold">
                    FASHIONHUB SELECTION
                  </span>
                  <Link href={`/products/${product.slug}`} className="item-name font-serif text-[17px] font-normal leading-snug text-ink transition-colors duration-200 hover:text-gold">
                    {product.name}
                    {isOutOfStock && (
                      <span className="text-warning text-xs font-medium ml-2 uppercase">
                        ({t('cart.maxStock', 'Tối đa tồn kho')})
                      </span>
                    )}
                  </Link>
                  <span className="item-attributes text-[12.5px] font-light text-charcoal">
                    {t('cart.size', 'Kích thước')}: {item.variant.size || 'N/A'} | {t('cart.color', 'Màu sắc')}: {item.variant.color || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Quantity controls and price */}
              <div className="item-controls-info flex items-center justify-end gap-10 w-[280px] shrink-0">
                <div className="qty-selector flex items-center border border-border-light h-8">
                  <Button
                    type="text"
                    className="qty-btn w-7 h-full text-xs font-light text-charcoal cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-black/5 disabled:opacity-25 disabled:cursor-not-allowed !p-0 !border-none"
                    onClick={() => handleQtyChange(item, -1)}
                    disabled={item.quantity <= 1}
                    icon={<MinusOutlined style={{ fontSize: '10px' }} />}
                  />
                  <div className="qty-val w-8 h-full flex items-center justify-center font-mono text-xs border-l border-r border-border-light text-ink">
                    {item.quantity}
                  </div>
                  <Button
                    type="text"
                    className="qty-btn w-7 h-full text-xs font-light text-charcoal cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-black/5 !p-0 !border-none"
                    onClick={() => handleQtyChange(item, 1)}
                    icon={<PlusOutlined style={{ fontSize: '10px' }} />}
                  />
                </div>

                <div className="price-remove-group flex items-center gap-5 w-[130px] justify-end">
                  <div className="price-group text-right">
                    {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                      <span className="item-original-price font-mono text-[11px] line-through text-charcoal block mb-0.5">
                        {Number(product.originalPrice).toLocaleString('vi-VN')} ₫
                      </span>
                    )}
                    <span className={`item-price font-mono text-sm font-medium ${isOutOfStock ? 'text-error' : 'text-ink'}`}>
                      {Number(product.price).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>

                  <Button
                    type="text"
                    danger
                    className="item-remove-btn cursor-pointer transition-colors duration-200 p-1 flex items-center hover:text-error"
                    onClick={() => handleRemove(item.id)}
                    title={t('cart.deleteBtn', 'Xóa sản phẩm')}
                    icon={<DeleteOutlined style={{ fontSize: '15px' }} />}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
