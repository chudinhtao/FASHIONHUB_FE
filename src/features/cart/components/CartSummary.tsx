import React from 'react';
import Link from 'next/link';
import { useCartView } from '../hooks';
import { Button } from '@/components/ui/Button';

export const CartSummary: React.FC = () => {
  const {
    t,
    items,
    isLoading,
    subtotal,
    shippingFee,
    total,
    hasStockWarning,
  } = useCartView();

  if (isLoading || items.length === 0) {
    return (
      <div className="receipt-sidebar w-full pl-[56px] sticky top-28 max-md:pl-0 max-md:static">
        <div className="column-header flex justify-between items-end border-b-2 border-ink pb-4 mb-8 h-12">
          <h2 className="column-title font-serif text-2xl uppercase tracking-wider text-ink">
            {t('cart.summaryTitle', 'Order Summary')}
          </h2>
        </div>
        <div className="h-6 w-full bg-surface-light shimmer-pulse mb-4" />
        <div className="h-6 w-full bg-surface-light shimmer-pulse mb-4" />
        <div className="h-10 w-full bg-surface-light shimmer-pulse mt-8" />
      </div>
    );
  }

  return (
    <div className="receipt-sidebar w-full pl-[56px] sticky top-28 max-md:pl-0 max-md:static">
      {/* Header of Column 2 */}
      <div className="column-header flex justify-between items-end border-b-2 border-ink pb-4 mb-8 h-12">
        <h2 className="column-title font-serif text-2xl uppercase tracking-wider text-ink">
          {t('cart.summaryTitle', 'Order Summary')}
        </h2>
      </div>

      {/* Subtotal */}
      <div className="receipt-row flex justify-between mb-4 text-[13.5px] text-charcoal">
        <span>{t('cart.subtotal', 'Tạm tính')}</span>
        <span className="receipt-price font-mono text-ink">
          {subtotal.toLocaleString('vi-VN')} ₫
        </span>
      </div>

      {/* Shipping Fee */}
      <div className="receipt-row flex justify-between mb-4 text-[13.5px] text-charcoal">
        <span>{t('cart.shippingFee', 'Phí vận chuyển')}</span>
        <span className="receipt-price font-mono text-ink">
          {shippingFee.toLocaleString('vi-VN')} ₫
        </span>
      </div>

      {/* Total */}
      <div className="receipt-row total flex justify-between border-t border-border-light pt-5 mt-5 mb-7 text-sm text-ink font-semibold">
        <span>{t('cart.total', 'Tổng cộng')}</span>
        <span className="receipt-price font-mono text-lg font-bold">
          {total.toLocaleString('vi-VN')} ₫
        </span>
      </div>

      {/* Checkout Button */}
      {hasStockWarning ? (
        <Button
          disabled
          block
          className="w-full bg-charcoal text-white border-charcoal py-4 h-auto font-sans font-semibold text-xs uppercase tracking-[0.15em] text-center cursor-not-allowed opacity-75"
        >
          {t('orders.checkout.submitErrorStock', 'ĐẶT HÀNG (CÓ LỖI TỒN KHO)')}
        </Button>
      ) : (
        <Link href="/checkout" className="w-full block">
          <Button
            type="primary"
            block
            className="w-full bg-ink text-white border-ink py-4 h-auto font-sans font-semibold text-xs uppercase tracking-[0.15em] text-center flex items-center justify-center transition-all duration-400 hover:bg-transparent hover:text-ink hover:-translate-y-0.5"
          >
            {t('cart.checkoutBtn', 'Tiến hành thanh toán')}
          </Button>
        </Link>
      )}

      {/* Guarantee and COD support details */}
      <p className="shopping-guarantee mt-6 text-[11.5px] text-charcoal text-center leading-relaxed">
        {t('cart.guarantee', 'Đổi trả miễn phí trong vòng 30 ngày. COD nhận hàng kiểm tra trước khi thanh toán.')}
      </p>
    </div>
  );
};
