import React from 'react';
import { useCheckoutView } from '../hooks';
import { Button } from '@/components/ui/Button';

export const CheckoutSummary: React.FC = () => {
  const {
    t,
    items,
    isLoading,
    subtotal,
    shippingFee,
    total,
    hasStockWarning,
    isSubmitting,
  } = useCheckoutView();

  if (isLoading || items.length === 0) {
    return (
      <div className="receipt-sidebar w-full pl-14 sticky top-28 max-md:pl-0 max-md:static">
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
    <div className="receipt-sidebar w-full pl-14 sticky top-28 max-md:pl-0 max-md:static">
      {/* Header of Column 2 */}
      <div className="column-header flex justify-between items-end border-b-2 border-ink pb-4 mb-8 h-12">
        <h2 className="column-title font-serif text-2xl uppercase tracking-wider text-ink">
          {t('cart.summaryTitle', 'Order Summary')}
        </h2>
      </div>

      {/* Mini items list */}
      <div className="flex flex-col gap-5 mb-6">
        {items.map((item) => {
          const product = item.variant.product;
          const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
          const isOutOfStock = item.quantity > item.variant.stock;

          return (
            <div key={item.id} className="mini-product-row flex justify-between items-center text-sm">
              <div className="mini-product-info flex items-center gap-4">
                <img
                  src={primaryImage?.url || '/images/placeholder.jpg'}
                  alt={product.name}
                  className={`mini-img w-16 aspect-[3/4] object-cover bg-surface-light ${
                    isOutOfStock ? 'grayscale opacity-75' : ''
                  }`}
                />
                <div>
                  <div
                    className="mini-name font-serif text-[15px] text-ink leading-tight"
                    style={{ textDecoration: isOutOfStock ? 'line-through' : 'none' }}
                  >
                    {product.name}
                  </div>
                  {isOutOfStock ? (
                    <div className="mini-qty text-[11px] font-bold text-error mt-0.5 uppercase">
                      {t('orders.checkout.outOfStockText', 'ĐÃ HẾT HÀNG')}
                    </div>
                  ) : (
                    <div className="mini-qty text-xs text-charcoal mt-0.5">
                      Size: {item.variant.size || 'N/A'} | Qty: {item.quantity}
                    </div>
                  )}
                </div>
              </div>
              <span className="mini-price font-mono text-sm text-ink">
                {(Number(product.price) * item.quantity).toLocaleString('vi-VN')} ₫
              </span>
            </div>
          );
        })}
      </div>

      <div className="divider h-[1px] bg-border-light my-6" />

      {/* Prices breakdown */}
      <div className="receipt-row flex justify-between mb-3 text-[13.5px] text-charcoal">
        <span>{t('cart.subtotal', 'Tạm tính')}</span>
        <span className="receipt-price font-mono text-ink">
          {subtotal.toLocaleString('vi-VN')} ₫
        </span>
      </div>
      <div className="receipt-row flex justify-between mb-3 text-[13.5px] text-charcoal">
        <span>{t('cart.shippingFee', 'Phí vận chuyển')}</span>
        <span className="receipt-price font-mono text-ink">
          {shippingFee.toLocaleString('vi-VN')} ₫
        </span>
      </div>
      <div className="receipt-row total flex justify-between border-t border-border-light pt-5 mt-5 mb-7 text-sm text-ink font-semibold">
        <span>{t('cart.total', 'Tổng cộng')}</span>
        <span className="receipt-price font-mono text-lg font-bold">
          {total.toLocaleString('vi-VN')} ₫
        </span>
      </div>

      {/* Submit Button connected to shipping-form */}
      {hasStockWarning ? (
        <Button
          disabled
          block
          className="submit-btn w-full bg-charcoal text-white border-charcoal py-4 h-auto font-sans font-semibold text-xs uppercase tracking-[0.15em] text-center cursor-not-allowed opacity-75"
        >
          {t('orders.checkout.submitErrorStock', 'ĐẶT HÀNG (CÓ LỖI TỒN KHO)')}
        </Button>
      ) : (
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isSubmitting}
          className="submit-btn w-full bg-ink text-white border-ink py-4 h-auto font-sans font-semibold text-xs uppercase tracking-[0.15em] text-center flex items-center justify-center transition-all duration-400 hover:bg-transparent hover:text-ink hover:-translate-y-0.5"
        >
          {t('orders.checkout.submitBtn', 'XÁC NHẬN ĐẶT HÀNG')}
        </Button>
      )}

      <p className="shopping-guarantee mt-6 text-[11.5px] text-charcoal text-center leading-relaxed">
        {t('orders.checkout.guarantee', 'COD nhận hàng kiểm tra thoải mái trước khi thanh toán.')}
      </p>
    </div>
  );
};
