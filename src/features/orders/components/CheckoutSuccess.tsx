import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth';

export const CheckoutSuccess: React.FC = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="max-w-[480px] mx-auto px-6 py-16 text-center font-sans min-h-[calc(100vh-64px)] flex flex-col justify-center">
      <div className="w-10 h-[1.5px] bg-gold mx-auto mb-8 animate-pulse animate-duration-1000" />
      
      <h1 className="font-serif text-3xl uppercase tracking-wider text-ink mb-4 leading-tight">
        {t('orders.checkout.success.title', 'ĐẶT HÀNG THÀNH CÔNG')}
      </h1>
      
      <p className="text-sm font-light text-charcoal leading-relaxed mb-8 tracking-wide">
        {t('orders.checkout.success.subtitle', 'Cảm ơn bạn đã mua sắm tại FashionHub. Đơn hàng của bạn đang được xử lý.')}
      </p>

      {orderNumber && (
        <div className="bg-surface-light border border-border-light py-5 px-6 mb-10 text-center select-all">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
            {t('orders.checkout.success.orderNumber', 'Mã đơn hàng của bạn là')}
          </span>
          <span className="font-mono text-lg font-bold text-ink tracking-widest">
            {orderNumber}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {isAuthenticated ? (
          <Link
            href="/profile/orders"
            className="block w-full bg-ink text-white border border-ink py-4 px-6 font-sans font-semibold text-xs uppercase tracking-[0.15em] text-center transition-all duration-400 hover:bg-transparent hover:text-ink hover:-translate-y-0.5"
          >
            {t('orders.checkout.success.viewHistory', 'XEM LỊCH SỬ ĐƠN HÀNG')}
          </Link>
        ) : (
          orderNumber && (
            <Link
              href={`/profile/orders/${orderNumber}`}
              className="block w-full bg-ink text-white border border-ink py-4 px-6 font-sans font-semibold text-xs uppercase tracking-[0.15em] text-center transition-all duration-400 hover:bg-transparent hover:text-ink hover:-translate-y-0.5"
            >
              {t('orders.checkout.success.viewDetails', 'XEM CHI TIẾT ĐƠN HÀNG')}
            </Link>
          )
        )}
        
        <Link
          href="/"
          className="block w-full bg-transparent text-ink border border-border-light py-4 px-6 font-sans font-semibold text-xs uppercase tracking-[0.15em] text-center transition-all duration-400 hover:border-ink hover:-translate-y-0.5"
        >
          {t('orders.checkout.success.backToHome', 'QUAY LẠI TRANG CHỦ')}
        </Link>
      </div>
    </div>
  );
};
