import React from 'react';
import Link from 'next/link';
import { Pagination } from 'antd';
import { useAdminOrdersView } from '@/features/orders/hooks';
import { OrderStatus } from '@/types';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export const AdminOrderList: React.FC = () => {
  const {
    t,
    page,
    setPage,
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    orders,
    meta,
    isLoading,
    getStatusText,
    getStatusColor,
  } = useAdminOrdersView();

  if (isLoading) {
    return <LoadingSpinner tip={t('auth.loading', 'Đang tải danh sách đơn hàng...')} height="400px" />;
  }

  const columns = [
    {
      title: t('orders.admin.colOrderNumber', 'Đơn hàng'),
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => <span className="font-mono font-medium text-ink select-all">{text}</span>,
    },
    {
      title: t('orders.admin.colRecipient', 'Khách hàng'),
      key: 'recipient',
      render: (_: any, record: any) => (
        <div>
          <div className="font-medium text-ink">{record.recipientName}</div>
          <div className="text-xs text-charcoal mt-0.5">{record.phone}</div>
        </div>
      ),
    },
    {
      title: t('orders.admin.colDate', 'Ngày đặt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: t('orders.admin.colTotal', 'Tổng tiền'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'right' as const,
      render: (amount: number) => <span className="font-mono font-medium text-ink">{amount.toLocaleString('vi-VN')} ₫</span>,
    },
    {
      title: t('orders.admin.colStatus', 'Trạng thái'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`font-semibold uppercase text-xs tracking-wide ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: t('orders.admin.colActions', 'Thao tác'),
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Link
          href={`/admin/orders/${record.id}`}
          className="inline-block border border-border-light py-1.5 px-4 text-[10px] font-semibold uppercase tracking-widest text-charcoal transition-all duration-300 hover:border-ink hover:text-ink"
        >
          {t('orders.history.viewDetail', 'Chi tiết')}
        </Link>
      ),
    },
  ];

  return (
    <div className="w-full font-sans">
      {/* Dynamic PageHeader */}
      <PageHeader
        title={t('orders.admin.title', 'Quản Lý Đơn Hàng')}
        description={t('orders.admin.subtitle', 'Xem danh sách và cập nhật trạng thái đơn hàng của hệ thống.')}
        breadcrumbs={[
          { title: t('admin.breadcrumb.admin', 'Quản trị'), href: '/admin' },
          { title: t('admin.breadcrumb.orders', 'Đơn hàng') }
        ]}
      />

      <div className="px-6">
        {/* Filters toolbar */}
        <div className="flex gap-4 mb-8 max-sm:flex-col items-center">
          {/* Search bar with shared Input */}
          <div className="flex-1">
            <Input
              placeholder={t('orders.admin.searchPlaceholder', 'Tìm mã đơn hàng, tên người nhận, SĐT...')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="elegant-input"
            />
          </div>

          {/* Status Dropdown */}
          <div className="w-64 max-sm:w-full">
            <select
              className="w-full bg-transparent border-b border-border-light text-sm py-2.5 px-1 outline-none focus:border-gold"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as any);
                setPage(1);
              }}
            >
              <option value="">{t('orders.admin.selectStatus', 'Tất cả trạng thái')}</option>
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {getStatusText(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table grid */}
        {orders.length === 0 ? (
          <EmptyState
            title={t('catalog.state.emptyTitle', 'Không tìm thấy kết quả phù hợp.')}
            description={t('catalog.state.emptySubtitle', 'Thử điều chỉnh lại từ khóa tìm kiếm hoặc bộ lọc trạng thái.')}
          />
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              pagination={false}
              className="elegant-table"
            />

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center mt-8 pt-6 border-t border-border-light">
                <Pagination
                  current={page}
                  total={meta.totalItems}
                  pageSize={meta.itemCount}
                  onChange={(p) => setPage(p)}
                  showSizeChanger={false}
                  className="elegant-pagination"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
