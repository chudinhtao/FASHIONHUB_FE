import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOrderHistoryView } from '../hooks';
import { Table } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export const OrderHistoryList: React.FC = () => {
  const router = useRouter();
  const {
    t,
    page,
    setPage,
    orders,
    meta,
    isLoading,
    getStatusText,
    getStatusColor,
  } = useOrderHistoryView();

  if (isLoading) {
    return <LoadingSpinner tip={t('auth.loading', 'Đang tải lịch sử mua hàng...')} height="400px" />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title={t('orders.history.emptyTitle', 'BẠN CHƯA CÓ ĐƠN HÀNG NÀO')}
        description={t('orders.history.emptyDesc', 'Bắt đầu mua sắm để tạo đơn hàng đầu tiên của bạn.')}
        actionText={t('cart.continueShopping', 'QUAY LẠI CỬA HÀNG')}
        onAction={() => router.push('/products')}
      />
    );
  }

  const columns = [
    {
      title: t('orders.history.orderNumber', 'Đơn hàng'),
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => <span className="font-mono font-medium text-ink select-all">{text}</span>,
    },
    {
      title: t('orders.history.date', 'Ngày đặt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: t('orders.history.status', 'Trạng thái'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`font-semibold uppercase text-xs tracking-wide ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: t('orders.history.total', 'Tổng tiền'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'right' as const,
      render: (amount: number) => <span className="font-mono font-medium text-ink">{amount.toLocaleString('vi-VN')} ₫</span>,
    },
    {
      title: t('orders.history.actions', 'Thao tác'),
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Link
          href={`/profile/orders/${record.id}`}
          className="inline-block border border-border-light py-1.5 px-4 text-[10px] font-semibold uppercase tracking-widest text-charcoal transition-all duration-300 hover:border-ink hover:text-ink"
        >
          {t('orders.history.viewDetail', 'Chi tiết')}
        </Link>
      ),
    },
  ];

  return (
    <div className="w-full font-sans">
      <div className="border-b border-ink pb-4 mb-8">
        <h1 className="font-serif text-2xl uppercase tracking-wider text-ink">
          {t('orders.history.title', 'Lịch Sử Mua Hàng')}
        </h1>
        <p className="text-xs text-charcoal tracking-wide mt-1">
          {t('orders.history.subtitle', 'Theo dõi các đơn hàng bạn đã mua tại FashionHub.')}
        </p>
      </div>

      <div className="bg-bgLight border border-borderGray rounded-none overflow-hidden select-none">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={
            meta
              ? {
                  current: page,
                  pageSize: 10,
                  total: meta.totalItems ?? (meta as any).total,
                  onChange: (p) => setPage(p),
                  showSizeChanger: false,
                  position: ['bottomRight'],
                  className: '!m-0 p-4 border-t border-border-gray bg-bg-neutral font-mono text-xs select-none',
                }
              : false
          }
          className="elegant-table"
        />
      </div>
    </div>
  );
};
