import React from 'react';
import Link from 'next/link';
import { FormProvider, Controller } from 'react-hook-form';
import { EditOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useOrderDetailView } from '../hooks';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface OrderDetailViewProps {
  orderId: string;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ orderId }) => {
  const {
    t,
    order,
    isLoading,
    isEditingAddress,
    setIsEditingAddress,
    addressForm,
    handleCancelOrder,
    handleUpdateAddress,
    isCancelling,
    isUpdatingAddress,
    getStatusText,
    getPaymentStatusText,
    getStatusColor,
  } = useOrderDetailView(orderId);

  if (isLoading) {
    return <LoadingSpinner tip={t('auth.loading', 'Đang tải chi tiết đơn hàng...')} height="400px" />;
  }

  if (!order) {
    return (
      <div className="text-center py-10 font-sans">
        <p className="text-charcoal mb-4">{t('orders.detail.notFound', 'Không tìm thấy đơn hàng.')}</p>
        <Link href="/profile/orders" className="text-gold hover:underline">
          {t('orders.checkout.success.viewHistory', 'Quay lại danh sách đơn hàng')}
        </Link>
      </div>
    );
  }

  const isPending = order.status === 'PENDING';
  const isCancelled = order.status === 'CANCELLED';
  const isReturned = order.status === 'RETURNED';
  const { control, formState: { errors } } = addressForm;

  // Timeline Steps
  const steps = [
    { key: 'PENDING', label: t('orders.detail.statusPending', 'Chờ xác nhận') },
    { key: 'CONFIRMED', label: t('orders.detail.statusConfirmed', 'Đã xác nhận') },
    { key: 'PREPARING', label: t('orders.detail.statusPreparing', 'Đang chuẩn bị') },
    { key: 'SHIPPING', label: t('orders.detail.statusShipping', 'Đang giao hàng') },
    { key: 'DELIVERED', label: t('orders.detail.statusDelivered', 'Đã giao hàng') }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);

  return (
    <div className="max-w-[1200px] mx-auto py-1 px-6 font-sans select-none">
      {/* Breadcrumbs */}
      <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-charcoal mb-8 border-b border-border-light pb-4">
        <Link href="/profile/orders" className="hover:text-ink transition-colors duration-200">
          {t('orders.history.title', 'Danh sách đơn hàng')}
        </Link>
        <span className="text-zinc-300">/</span>
        <span className="text-zinc-400 font-mono">{order.orderNumber}</span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-10 items-start">

        {/* LEFT COLUMN: Items List & Delivery Timeline */}
        <div className="space-y-8">

          {/* Order Header / Title */}
          <div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest block mb-1">
              {t('orders.detail.title', 'CHI TIẾT ĐƠN HÀNG')}
            </span>
            <h1 className="font-serif text-3xl text-ink tracking-wide leading-tight uppercase font-medium">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-charcoal font-light mt-1.5">
              {t('orders.detail.date', 'Ngày đặt')}: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>

          {/* Timeline Tracker */}
          <div className="border border-border-light p-6 md:p-8 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-6 border-b border-border-light pb-3">
              {t('orders.detail.statusHeader', 'Trạng Thái Vận Chuyển')}
            </h3>

            {isCancelled ? (
              <div className="bg-[#FFF1F0] border border-[#FFA39E] p-4 flex gap-3 items-center text-error text-xs uppercase font-bold tracking-wider">
                <CloseCircleOutlined style={{ fontSize: '16px' }} />
                <span>{t('orders.detail.statusCancelledDesc', 'Đơn hàng này đã bị hủy bỏ.')}</span>
              </div>
            ) : isReturned ? (
              <div className="bg-[#F9F9F9] border border-border-light p-4 flex gap-3 items-center text-charcoal text-xs uppercase font-bold tracking-wider">
                <InfoCircleOutlined style={{ fontSize: '16px' }} />
                <span>{t('orders.detail.statusReturnedDesc', 'Đơn hàng này đã hoàn trả hệ thống.')}</span>
              </div>
            ) : (
              <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-0 mt-2">
                {/* Horizontal line for desktop */}
                <div className="hidden md:block absolute top-3 left-6 right-6 h-[1.5px] bg-border-light -z-10" />

                {steps.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center flex-1 relative md:px-2">
                      {/* Step Indicator Dot */}
                      <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center border font-mono text-[10px] font-bold transition-all duration-500 z-10 ${isCurrent
                        ? 'bg-ink text-white border-ink scale-110 shadow-sm'
                        : isDone
                          ? 'bg-gold text-white border-gold'
                          : 'bg-white text-zinc-400 border-zinc-200'
                        }`}>
                        {isDone && !isCurrent ? '✓' : idx + 1}
                      </div>

                      {/* Step Label */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider mt-3 select-none transition-colors duration-500 ${isCurrent
                        ? 'text-ink font-extrabold'
                        : isDone
                          ? 'text-gold'
                          : 'text-zinc-400 font-medium'
                        }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ordered Products list */}
          <div className="border border-border-light p-6 md:p-8 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-5 border-b border-border-light pb-3">
              {t('orders.detail.orderItems', 'Sản Phẩm Đã Đặt')}
            </h3>

            <div className="divide-y divide-border-light">
              {order.items.map((item: any) => {
                const product = item.variant.product;
                const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];

                return (
                  <div key={item.id} className="flex justify-between items-center py-5 text-sm transition-all duration-300 hover:bg-zinc-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-[60px] aspect-[3/4] overflow-hidden bg-surface-light border border-border-light">
                        <img
                          src={primaryImage?.url || '/images/placeholder.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif text-[15.5px] text-ink leading-tight font-medium">
                          {product.name}
                        </h4>
                        <div className="text-[11.5px] text-charcoal font-light">
                          Size: <span className="font-semibold text-ink">{item.variant.size || 'N/A'}</span> | Qty: <span className="font-semibold text-ink">{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-ink font-medium">
                      {(Number(item.price) * item.quantity).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Summary details sidebar */}
        <div className="space-y-8 sticky top-28">

          {/* Main summary sidebar card */}
          <div className="border border-border-light p-6 bg-[#FCFCFB] shadow-[0_4px_16px_rgba(0,0,0,0.01)]">

            {/* Delivery address & info section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3.5 border-b border-border-light pb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-ink">
                  {t('orders.detail.recipient', 'Địa Chỉ Nhận Hàng')}
                </h3>
                {isPending && !isEditingAddress && (
                  <Button
                    type="link"
                    icon={<EditOutlined style={{ fontSize: '13px' }} />}
                    onClick={() => setIsEditingAddress(true)}
                    className="!p-0 text-gold hover:text-[#B3936B] transition-colors"
                    title={t('orders.detail.editAddressBtn', 'Sửa địa chỉ')}
                  />
                )}
              </div>

              {isEditingAddress ? (
                <FormProvider {...addressForm}>
                  <form onSubmit={handleUpdateAddress} className="space-y-3.5 mt-2">
                    <div>
                      <Controller
                        name="recipientName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Tên người nhận"
                            className="elegant-input text-xs h-[38px]"
                          />
                        )}
                      />
                      {errors.recipientName && <span className="text-[10px] text-error mt-1 block">{t(errors.recipientName.message || '')}</span>}
                    </div>
                    <div>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Số điện thoại"
                            className="elegant-input text-xs h-[38px]"
                          />
                        )}
                      />
                      {errors.phone && <span className="text-[10px] text-error mt-1 block">{t(errors.phone.message || '')}</span>}
                    </div>
                    <div>
                      <Controller
                        name="shippingAddress"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Địa chỉ nhận hàng"
                            className="elegant-input text-xs h-[38px]"
                          />
                        )}
                      />
                      {errors.shippingAddress && <span className="text-[10px] text-error mt-1 block">{t(errors.shippingAddress.message || '')}</span>}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isUpdatingAddress}
                        className="elegant-button !h-8.5 !px-4 text-[10px] uppercase font-bold"
                      >
                        {t('orders.detail.saveAddress', 'Lưu')}
                      </Button>
                      <Button
                        className="!h-8.5 !px-4 text-[10px] uppercase font-bold"
                        onClick={() => setIsEditingAddress(false)}
                      >
                        {t('orders.detail.cancelEdit', 'Hủy')}
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              ) : (
                <div className="space-y-1.5 text-xs text-charcoal font-light leading-relaxed">
                  <div className="font-bold text-ink text-sm">
                    {order.recipientName}
                  </div>
                  <div>{order.phone}</div>
                  <div>{order.shippingAddress}</div>
                  {order.notes && (
                    <div className="italic text-[11px] text-charcoal/80 bg-white border border-border-light p-2.5 mt-2 leading-relaxed">
                      "{order.notes}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment info section */}
            <div className="mb-6 border-t border-border-light pt-4.5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-3.5">
                {t('orders.detail.payment', 'Thanh Toán')}
              </h3>
              <div className="space-y-2 text-xs font-light text-charcoal leading-relaxed">
                <div className="flex justify-between">
                  <span>{t('orders.detail.paymentMethod', 'Phương thức')}:</span>
                  <span className="font-bold text-ink">COD (Tiền mặt)</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('orders.detail.paymentStatus', 'Trạng thái')}:</span>
                  <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-success' : 'text-zinc-600'
                    }`}>
                    {getPaymentStatusText(order.paymentStatus)}
                  </span>
                </div>
              </div>
            </div>

            {/* Prices calculation breakdown */}
            <div className="border-t border-border-light pt-5 space-y-3">
              <div className="flex justify-between text-xs text-charcoal font-light">
                <span>{t('orders.detail.subtotal', 'Tạm tính')}</span>
                <span className="font-mono text-ink">
                  {(Number(order.totalAmount) - 30000).toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className="flex justify-between text-xs text-charcoal font-light">
                <span>{t('orders.detail.shipping', 'Vận chuyển')}</span>
                <span className="font-mono text-ink">30.000 ₫</span>
              </div>
              <div className="flex justify-between text-xs text-ink font-bold border-t border-border-light pt-3.5 mt-2">
                <span className="uppercase tracking-wider">{t('orders.detail.total', 'Tổng cộng')}</span>
                <span className="font-mono text-[16px] font-extrabold text-ink">
                  {Number(order.totalAmount).toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

          </div>

          {/* Cancel Order Button */}
          {isPending && (
            <Button
              danger
              block
              loading={isCancelling}
              className="w-full bg-red-50 text-red-600 border-red-200 py-3.5 h-auto font-sans font-semibold text-xs uppercase tracking-[0.15em] text-center flex items-center justify-center transition-all duration-400 hover:bg-red-500 hover:text-white hover:border-red-500 hover:-translate-y-0.5"
              onClick={handleCancelOrder}
            >
              {t('orders.detail.cancelBtn', 'Hủy đơn hàng này')}
            </Button>
          )}

        </div>

      </div>
    </div>
  );
};
