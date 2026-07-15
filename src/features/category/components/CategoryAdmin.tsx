'use client';

import React from 'react';
import { useCategoryAdmin } from '../hooks';
import { Category } from '@/types';
import { Input, Button, Modal } from '@/components/ui';
import { Select } from 'antd';
import { FolderOutlined, FileOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function CategoryAdmin() {
  const {
    t,
    categories,
    isLoading,
    isError,
    refetch,
    isModalOpen,
    modalMode,
    formName,
    setFormName,
    formParentId,
    setFormParentId,
    flatCategories,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSubmit,
    handleDelete,
  } = useCategoryAdmin();

  // Recursive Category List Row Renderer
  const renderCategoryRow = (cat: Category, depth = 0) => {
    const hasChildren = cat.children && cat.children.length > 0;

    return (
      <React.Fragment key={cat.id}>
        {/* Row */}
        <div className="hover:bg-bg-neutral transition-colors border-b border-border-gray">
          <div className="grid grid-cols-3 px-6 py-4 items-center">
            <div className="col-span-2 flex items-center" style={{ paddingLeft: `${depth * 24}px` }}>
              <span className="mr-2 text-primaryGold flex items-center shrink-0">
                {depth === 0 ? <FolderOutlined className="text-xs" /> : <FileOutlined className="text-[10px] text-zinc-400" />}
              </span>
              <span className={`text-ink ${depth === 0 ? 'font-bold uppercase tracking-wide' : 'font-medium'}`}>
                {cat.name}
              </span>
              <span className="text-[10px] text-charcoal font-mono ml-3">
                /{cat.slug}
              </span>
            </div>
            <div className="text-right space-x-4">
              <Button
                type="link"
                onClick={() => handleOpenEdit(cat)}
                className="text-xs font-bold text-primaryGold hover:text-ink hover:underline uppercase tracking-wider cursor-pointer p-0 h-auto inline-flex items-center gap-1"
              >
                <EditOutlined className="text-xs" />
                {t('admin.categories.edit', 'Sửa')}
              </Button>
              <Button
                type="link"
                danger
                onClick={() => handleDelete(cat)}
                className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline uppercase tracking-wider cursor-pointer p-0 h-auto inline-flex items-center gap-1"
              >
                <DeleteOutlined className="text-xs" />
                {t('admin.categories.delete', 'Xóa')}
              </Button>
            </div>
          </div>
        </div>

        {/* Children Row Rendering */}
        {hasChildren && cat.children!.map((child) => renderCategoryRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-borderGray select-none">
        <div>
          <h1 className="text-xl font-bold font-playfair text-ink uppercase tracking-wider">
            {t('admin.categories.title', 'Quản Lý Danh Mục')}
          </h1>
          <p className="text-xs text-charcoal mt-1 font-outfit">
            {t('admin.categories.subtitle', 'Tạo lập, sửa đổi cấu trúc cây danh mục sản phẩm của cửa hàng.')}
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-ink hover:bg-primaryGold text-white text-xs font-bold px-5 py-2.5 uppercase tracking-widest font-outfit rounded-none transition-colors cursor-pointer border-none h-auto"
        >
          {t('admin.categories.addBtn', 'Thêm Danh Mục')}
        </Button>
      </div>

      {/* Grid States */}
      {isLoading ? (
        /* Loading Skeletons */
        <div className="bg-bgLight border border-borderGray rounded-none p-6 space-y-4">
          <div className="h-10 bg-zinc-200 animate-pulse w-full"></div>
          <div className="h-10 bg-zinc-200 animate-pulse w-full"></div>
          <div className="h-10 bg-zinc-200 animate-pulse w-full"></div>
        </div>
      ) : isError ? (
        /* Error View */
        <div className="py-10 flex flex-col items-center justify-center text-center bg-red-50 border border-red-200 rounded-none">
          <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-red-700">
            {t('admin.categories.errorTitle', 'Lỗi kết nối máy chủ')}
          </h4>
          <Button
            onClick={() => refetch()}
            className="mt-4 border border-red-800 hover:bg-red-800 hover:text-white text-red-800 text-[10px] font-bold px-4 py-2 uppercase tracking-widest font-outfit transition-colors rounded-none cursor-pointer"
          >
            {t('admin.categories.retry', 'Thử lại')}
          </Button>
        </div>
      ) : !categories || categories.length === 0 ? (
        /* Empty State */
        <div className="py-16 flex flex-col items-center justify-center text-center bg-bg-neutral border border-border-gray rounded-none select-none">
          <h4 className="font-playfair text-xl font-bold uppercase tracking-wider text-ink font-semibold">
            {t('admin.categories.emptyTitle', 'Không có danh mục nào')}
          </h4>
          <p className="text-xs text-charcoal mt-2 max-w-xs font-light">
            {t('admin.categories.emptyDesc', 'Bắt đầu thiết lập cửa hàng bằng cách thêm danh mục hàng đầu tiên của bạn.')}
          </p>
          <Button
            onClick={handleOpenCreate}
            className="mt-4 bg-ink hover:bg-primaryGold text-white text-xs font-semibold px-5 py-2.5 uppercase tracking-widest font-outfit transition-colors rounded-none cursor-pointer border-none h-auto"
          >
            {t('admin.categories.addBtn', 'Thêm Danh Mục')}
          </Button>
        </div>
      ) : (
        /* Category Table Success View */
        <div className="bg-bgLight border border-borderGray rounded-none overflow-hidden select-none">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-bg-neutral border-b border-border-gray px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink font-outfit">
            <div className="col-span-2">{t('admin.categories.colName', 'Tên Danh Mục')}</div>
            <div className="text-right">{t('admin.categories.colActions', 'Thao Tác')}</div>
          </div>

          {/* List Rows */}
          <div className="divide-y divide-borderGray font-outfit text-sm">
            {categories.map((cat) => renderCategoryRow(cat, 0))}
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL OVERLAY */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        closable={true}
        title={
          <span className="font-playfair text-sm font-bold uppercase tracking-wider text-ink pb-2 block border-b border-borderGray">
            {modalMode === 'create'
              ? t('admin.categories.modalTitleCreate', 'Tạo Danh Mục Mới')
              : t('admin.categories.modalTitleEdit', 'Cập Nhật Danh Mục')}
          </span>
        }
        className="font-outfit select-none"
        width={400}
        destroyOnClose
      >
        <form className="space-y-4 pt-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="space-y-1">
            <label className="font-semibold text-charcoal uppercase tracking-wider text-[10px]">
              {t('admin.categories.modalFieldName', 'Tên danh mục *')}
            </label>
            <Input
              required
              placeholder={t('admin.categories.modalFieldNamePlaceholder', 'Ví dụ: Áo Polo')}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full border-b border-t-0 border-x-0 border-b-ink py-2 text-sm focus:outline-none focus:border-b-primaryGold bg-transparent rounded-none"
              bordered={false}
            />
          </div>

          {/* Parent Selector */}
          <div className="space-y-1">
            <label className="font-semibold text-charcoal uppercase tracking-wider text-[10px]">
              {t('admin.categories.modalFieldParent', 'Danh mục cha')}
            </label>
            <Select
              value={formParentId || undefined}
              onChange={(value) => setFormParentId(value || '')}
              placeholder={t('admin.categories.modalParentOptionRoot', 'Không có (Danh mục gốc)')}
              allowClear
              style={{ width: '100%' }}
              className="border-b border-t-0 border-x-0 border-b-ink rounded-none text-sm cursor-pointer"
              bordered={false}
              options={flatCategories.map((flat) => ({
                value: flat.id,
                label: '\u00A0'.repeat(flat.depth * 2) + ' ' + flat.name,
              }))}
            />
          </div>

          {/* Form buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-borderGray">
            <Button
              onClick={handleCloseModal}
              className="border border-borderGray text-charcoal hover:border-ink hover:text-ink font-semibold uppercase tracking-wider px-5 py-2.5 rounded-none bg-white transition-all cursor-pointer h-auto"
            >
              {t('admin.categories.modalCancel', 'Hủy')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-ink hover:bg-primaryGold text-white font-semibold uppercase tracking-wider px-5 py-2.5 rounded-none transition-all cursor-pointer h-auto border-none"
            >
              {t('admin.categories.modalSave', 'Lưu Lại')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
