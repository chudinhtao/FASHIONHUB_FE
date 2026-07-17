import React from 'react';
import Link from 'next/link';
import { Select } from 'antd';
import { useAdminOrderDetailView } from '@/features/orders/hooks';
import { OrderStatus, PaymentStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface AdminOrderDetailProps {
  orderId: string;
}

export const AdminOrderDetail: React.FC<AdminOrderDetailProps> = ({ orderId }) => {
  const {
    t,
    order,
    isLoading,
    selectedStatus,
    setSelectedStatus,
    selectedPaymentStatus,
    setSelectedPaymentStatus,
    handleUpdateStatus,
    isUpdating,
    isTerminalState,
    getStatusText,
    getPaymentStatusText,
    getStatusColor,
  } = useAdminOrderDetailView(orderId);

  if (isLoading) {
    return <LoadingSpinner tip={t('auth.loading', 'Đang tải thông tin đơn hàng...')} height="400px" />;
  }

  if (!order) {
    return (
      <div className="text-center py-20 font-sans">
        <p className="text-charcoal mb-4">{t('orders.detail.notFound', 'Không tìm thấy đơn hàng.')}</p>
        <Link href="/admin/orders" className="text-gold hover:underline">
          {t('orders.checkout.success.viewHistory', 'Quay lại danh sách đơn hàng')}
        </Link>
      </div>
    );
  }

  return (
    <div className="font-sans w-full">
      {/* PageHeader with breadcrumbs */}
      <PageHeader
        title={t('orders.admin.detailTitle', 'Chi Tiết Đơn Hàng (Admin)')}
        description={`${t('orders.detail.orderNumber', 'Mã đơn hàng')}: ${order.orderNumber}`}
        breadcrumbs={[
          { title: t('admin.breadcrumb.admin', 'Quản trị'), href: '/admin' },
          { title: t('admin.breadcrumb.orders', 'Đơn hàng'), href: '/admin/orders' },
          { title: order.orderNumber }
        ]}
      />

      <div className="px-6 grid grid-cols-[1.35fr_1fr] gap-0 items-start max-md:grid-cols-1 max-md:gap-10">
        
        {/* Column 1: Order Details Info (Left Side) */}
        <div className="w-full pr-14 border-r border-border-light max-md:pr-0 max-md:border-r-0">
          <div className="column-header flex justify-between items-end border-b-2 border-ink pb-4 mb-8 h-12">
            <h2 className="column-title font-serif text-2xl uppercase tracking-wider text-ink">
              {t('orders.admin.detailTitle', 'Order Details')}
            </h2>
          </div>

          {/* Details Card */}
          <div className="border border-border-light p-6 mb-6">
            <div className="border-b border-border-light pb-4 mb-4">
              <span className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1">
                {t('orders.detail.orderNumber', 'Mã đơn hàng')}
              </span>
              <span className="font-mono text-xl font-bold text-ink tracking-widest block select-all">
                {order.orderNumber}
              </span>
              <span className="text-xs font-light text-charcoal mt-1 block">
                {new Date(order.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>

            {/* Customer Details */}
            <div className="border-b border-border-light pb-4 mb-4">
              <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-2">
                {t('orders.admin.customerInfo', 'Thông tin nhận hàng')}
              </h3>
              <div className="space-y-1 text-sm font-light text-charcoal">
                <div>
                  <span className="font-medium text-ink">{order.recipientName}</span>
                </div>
                <div>{order.phone}</div>
                <div>{order.shippingAddress}</div>
                {order.notes && (
                  <div className="italic text-xs text-charcoal/80 mt-1">
                    "{order.notes}"
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">
                {t('orders.detail.orderItems', 'Sản Phẩm Đã Đặt')}
              </h3>
              <div className="divide-y divide-border-light">
                {order.items.map((item: any) => {
                  const product = item.variant.product;
                  const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];

                  return (
                    <div key={item.id} className="flex justify-between items-center py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={primaryImage?.url || '/images/placeholder.jpg'}
                          alt={product.name}
                          className="w-12 aspect-[3/4] object-cover bg-surface-light"
                        />
                        <div>
                          <h4 className="font-serif text-sm text-ink leading-tight">{product.name}</h4>
                          <div className="text-[11px] text-charcoal mt-0.5">
                            Size: {item.variant.size || 'N/A'} | Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-ink">
                        {(Number(item.price) * item.quantity).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calculations */}
            <div className="border-t border-border-light mt-4 pt-4 space-y-2 max-w-[280px] ml-auto">
              <div className="flex justify-between text-xs text-charcoal">
                <span>{t('orders.detail.subtotal', 'Tạm tính')}</span>
                <span className="font-mono text-ink">
                  {(Number(order.totalAmount) - 30000).toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className="flex justify-between text-xs text-charcoal">
                <span>{t('orders.detail.shipping', 'Vận chuyển')}</span>
                <span className="font-mono text-ink">30.000 ₫</span>
              </div>
              <div className="flex justify-between text-sm text-ink font-semibold border-t border-border-light pt-2 mt-2">
                <span>{t('orders.detail.total', 'Tổng cộng')}</span>
                <span className="font-mono text-base font-bold text-ink">
                  {Number(order.totalAmount).toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Column 2: Status Update Controls (Right Side) */}
        <div className="receipt-sidebar w-full pl-14 sticky top-28 max-md:pl-0 max-md:static">
          <div className="column-header flex justify-between items-end border-b-2 border-ink pb-4 mb-8 h-12">
            <h2 className="column-title font-serif text-2xl uppercase tracking-wider text-ink">
              {t('orders.admin.orderStatusHeader', 'Status Control')}
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                {t('orders.detail.status', 'Trạng thái hiện tại')}
              </span>
              <span className={`text-base font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                {t('orders.detail.paymentStatus', 'Trạng thái thanh toán')}
              </span>
              <span className="text-sm font-semibold text-ink uppercase">
                {getPaymentStatusText(order.paymentStatus)}
              </span>
            </div>

            <div className="divider h-[1px] bg-border-light my-4" />

            {isTerminalState ? (
              <div className="text-xs text-charcoal italic leading-relaxed">
                * {t('orders.admin.statusLockedDesc', 'Đơn hàng đã ở trạng thái kết thúc (Giao hàng, Hủy, Trả hàng) nên không thể thay đổi trạng thái.')}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status Dropdown using Ant Design Select */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal mb-2">
                    {t('orders.admin.updateStatusTitle', 'Cập nhật trạng thái')}
                  </label>
                  <Select
                    className="w-full text-sm font-sans"
                    value={selectedStatus}
                    onChange={(val) => setSelectedStatus(val as any)}
                    options={Object.values(OrderStatus).map((status) => ({
                      value: status,
                      label: getStatusText(status)
                    }))}
                  />
                </div>

                {/* Payment Status Dropdown using Ant Design Select */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal mb-2">
                    {t('orders.admin.selectPaymentStatus', 'Cập nhật thanh toán')}
                  </label>
                  <Select
                    className="w-full text-sm font-sans"
                    value={selectedPaymentStatus}
                    onChange={(val) => setSelectedPaymentStatus(val as any)}
                    options={Object.values(PaymentStatus).map((status) => ({
                      value: status,
                      label: getPaymentStatusText(status)
                    }))}
                  />
                </div>

                {/* Submit button using shared Button */}
                <Button
                  type="primary"
                  block
                  loading={isUpdating}
                  onClick={handleUpdateStatus}
                  className="w-full bg-ink text-white border-ink py-4 h-auto font-sans font-semibold text-xs uppercase tracking-[0.15em] text-center flex items-center justify-center transition-all duration-400 hover:bg-transparent hover:text-ink hover:-translate-y-0.5"
                >
                  {t('orders.admin.saveBtn', 'Cập nhật')}
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
