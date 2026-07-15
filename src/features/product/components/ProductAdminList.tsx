'use client';

import React from 'react';
import { useProductAdminList } from '../hooks';
import { ProductShort } from '@/types';
import { Table, Input, Button } from '@/components/ui';
import { Select } from 'antd';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';

export default function ProductAdminList() {
  const {
    t,
    router,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    categorySlug,
    setCategorySlug,
    categories,
    products,
    isLoading,
    isError,
    refetch,
    meta,
    handleDelete,
  } = useProductAdminList();

  const columns = [
    {
      title: t('admin.products.colImage', 'Ảnh'),
      key: 'image',
      width: 80,
      render: (_: any, record: ProductShort) => (
        <div className="w-10 h-12 bg-bg-neutral overflow-hidden border border-border-gray select-none relative">
          <Image
            src={getImageUrl(record.primaryImage, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=100&q=80')}
            alt={record.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      ),
    },
    {
      title: t('admin.products.colName', 'Tên Sản Phẩm'),
      key: 'name',
      render: (_: any, record: ProductShort) => (
        <div>
          <div className="font-semibold text-ink text-xs">{record.name}</div>
          <div className="text-[9px] text-charcoal font-mono">{record.slug}</div>
        </div>
      ),
    },
    {
      title: t('admin.products.colCategory', 'Danh Mục'),
      key: 'category',
      render: (_: any, record: ProductShort) => (
        <span className="text-[10px] font-bold text-charcoal uppercase">
          {record.category.name}
        </span>
      ),
    },
    {
      title: t('admin.products.colPrice', 'Giá Bán'),
      key: 'price',
      render: (_: any, record: ProductShort) => (
        <span className="font-semibold font-mono text-primaryGold text-xs">
          {Number(record.price).toLocaleString('vi-VN')} ₫
        </span>
      ),
    },
    {
      title: t('admin.products.colStock', 'Tổng Tồn Kho'),
      key: 'stock',
      align: 'center' as const,
      render: (_: any, record: ProductShort) => {
        const stock = record.totalStock ?? 0;
        return (
          <span className={`font-bold font-mono text-xs ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stock}
          </span>
        );
      },
    },
    {
      title: t('admin.products.colActions', 'Thao Tác'),
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: ProductShort) => (
        <div className="space-x-4">
          <Button
            type="link"
            size="small"
            onClick={() => router.push(`/admin/products/${record.id}`)}
            className="text-[10px] font-bold text-primaryGold hover:text-ink uppercase tracking-wider p-0 cursor-pointer"
          >
            {t('admin.products.edit', 'Sửa')}
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDelete(record)}
            className="text-[10px] font-bold text-red-600 hover:text-red-800 uppercase tracking-wider p-0 cursor-pointer"
          >
            {t('admin.products.delete', 'Xóa')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-borderGray select-none">
        <div>
          <h1 className="text-xl font-bold font-playfair text-ink uppercase tracking-wider">
            {t('admin.products.title', 'Quản Lý Sản Phẩm')}
          </h1>
          <p className="text-xs text-charcoal mt-1">
            {t('admin.products.subtitle', 'Quản lý kho sản phẩm, hình ảnh và số lượng biến thể tồn kho của cửa hàng.')}
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/products/new')}
          className="bg-ink hover:bg-primaryGold text-white text-xs font-bold px-5 py-2.5 uppercase tracking-widest font-outfit rounded-none transition-colors cursor-pointer border-none h-auto"
        >
          {t('admin.products.addBtn', 'Thêm Sản Phẩm')}
        </Button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-bgLight border border-borderGray p-4 flex flex-col sm:flex-row gap-4 justify-between items-center rounded-none select-none text-xs font-outfit">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
          {/* Search Input */}
          <Input
            placeholder={t('admin.products.searchPlaceholder', 'Tìm tên sản phẩm...')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-[220px] rounded-none border-b border-t-0 border-x-0 border-b-ink bg-transparent focus:border-b-primaryGold text-sm py-2 px-1"
            bordered={false}
          />
          {/* Category Dropdown Filter */}
          <Select
            value={categorySlug || undefined}
            onChange={(value) => {
              setCategorySlug(value || '');
              setCurrentPage(1);
            }}
            placeholder={t('admin.products.filterCategoryAll', 'Tất Cả Danh Mục')}
            allowClear
            style={{ width: 180 }}
            className="border-b border-t-0 border-x-0 border-b-ink rounded-none text-sm cursor-pointer"
            bordered={false}
            options={[
              ...(categories?.map((cat) => ({
                value: cat.slug,
                label: cat.name,
              })) || []),
            ]}
          />
        </div>
        <span className="text-charcoal font-semibold uppercase tracking-wider text-[10px]">
          {t('admin.products.showCount', {
            count: products.length,
            defaultValue: `Hiển thị ${products.length} kết quả`,
          })}
        </span>
      </div>

      {/* Table grid area */}
      {isError ? (
        /* Error State */
        <div className="py-10 flex flex-col items-center justify-center text-center bg-red-50 border border-red-200 rounded-none">
          <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-red-700">
            {t('admin.products.errorTitle', 'Lỗi tải dữ liệu sản phẩm')}
          </h4>
          <Button
            onClick={() => refetch()}
            className="mt-4 border border-red-800 hover:bg-red-800 hover:text-white text-red-800 text-[10px] font-bold px-4 py-2 uppercase tracking-widest font-outfit transition-colors rounded-none cursor-pointer"
          >
            {t('admin.products.retry', 'Thử lại')}
          </Button>
        </div>
      ) : (
        /* Antd Table with loading support */
        <div className="bg-bgLight border border-borderGray rounded-none overflow-hidden select-none">
          <Table<ProductShort>
            dataSource={products}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            pagination={
              meta && meta.totalPages > 1
                ? {
                    current: currentPage,
                    pageSize: 10,
                    total: meta.totalItems,
                    onChange: (page) => setCurrentPage(page),
                    showSizeChanger: false,
                    position: ['bottomRight'],
                    className: '!m-0 p-4 border-t border-border-gray bg-bg-neutral font-mono text-xs select-none',
                  }
                : false
            }
          />
        </div>
      )}
    </div>
  );
}
