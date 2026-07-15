'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import { useProductForm } from '../hooks';
import { ProductFormValues } from '../validation';
import { Button } from '@/components/ui';
import { Input, TextArea } from '@/components/ui/Input';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { Tabs, Spin, Form, Select } from 'antd';
import { UploadOutlined, LinkOutlined, DeleteOutlined, StarOutlined, CloseOutlined } from '@ant-design/icons';

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting?: boolean;
}

export default function ProductForm({ initialValues, onSubmit, isSubmitting }: ProductFormProps) {
  const {
    t,
    categories,
    uploadingIdx,
    newImageUrl,
    setNewImageUrl,
    fileInputRef,
    activeTab,
    setActiveTab,
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    errors,
    imageFields,
    removeImage,
    variantFields,
    appendVariant,
    removeVariant,
    suggestSku,
    handlePrimaryRadioChange,
    triggerMainFileInput,
    handleMainFileChange,
    handleAddUrlImage,
    primaryImageUrl,
    primaryImageIdx,
    getCategoryOptions,
    onInvalid,
  } = useProductForm(initialValues);

  // Tab content components
  const tabItems = [
    {
      key: '1',
      label: (
        <span className="font-playfair font-bold uppercase tracking-wider text-xs px-1 select-none">
          1. {t('admin.form.tabInfo')}
        </span>
      ),
      children: (
        <div className="space-y-6 pt-4">
          <div className="bg-bgLight border border-borderGray p-6 space-y-6 rounded-none">
            {/* Product Name */}
            <Form.Item
              label={<span className="font-semibold text-charcoal uppercase tracking-wider">{t('admin.form.name')}</span>}
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name?.message}
              layout="vertical"
              className="mb-4"
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ví dụ: Áo Thun Polo Premium Basic"
                    className="elegant-input"
                  />
                )}
              />
            </Form.Item>

            {/* Slug */}
            <Form.Item
              label={<span className="font-semibold text-charcoal uppercase tracking-wider">{t('admin.form.slug')}</span>}
              validateStatus={errors.slug ? 'error' : ''}
              help={errors.slug?.message}
              layout="vertical"
              className="mb-4"
            >
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="ao-thun-polo-premium-basic"
                    className="elegant-input font-mono"
                  />
                )}
              />
            </Form.Item>

            {/* Category Select */}
            <Form.Item
              label={<span className="font-semibold text-charcoal uppercase tracking-wider">{t('admin.form.category')}</span>}
              validateStatus={errors.categoryId ? 'error' : ''}
              help={errors.categoryId?.message}
              layout="vertical"
              className="mb-4"
            >
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder={t('admin.form.selectCategory')}
                    className="elegant-select w-full h-[42px]"
                    options={
                      categories
                        ? getCategoryOptions(categories)
                        : []
                    }
                  />
                )}
              />
            </Form.Item>

            {/* Description */}
            <Form.Item
              label={<span className="font-semibold text-charcoal uppercase tracking-wider">{t('admin.form.description')}</span>}
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description?.message}
              layout="vertical"
              className="mb-0"
            >
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={8}
                    placeholder="Mô tả chi tiết về chất liệu, kiểu dáng, phom dáng và cách giặt ủi bảo quản..."
                    className="elegant-input font-light leading-relaxed p-3"
                  />
                )}
              />
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span className="font-playfair font-bold uppercase tracking-wider text-xs px-1 select-none">
          2. {t('admin.form.tabVariants')}
        </span>
      ),
      children: (
        <div className="space-y-6 pt-4">
          {/* Card Pricing */}
          <div className="bg-bgLight border border-borderGray p-6 space-y-6 rounded-none">
            <h4 className="font-playfair text-xs font-bold uppercase tracking-widest text-primaryGold border-b border-borderGray pb-2 mb-4">
              Cấu hình giá bán sản phẩm
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Selling */}
              <Form.Item
                label={<span className="font-semibold text-charcoal uppercase tracking-wider">{t('admin.form.price')}</span>}
                validateStatus={errors.price ? 'error' : ''}
                help={errors.price?.message}
                layout="vertical"
                className="mb-0"
              >
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      placeholder="299000"
                      className="elegant-input font-mono text-primaryGold font-bold"
                    />
                  )}
                />
              </Form.Item>

              {/* Original Price */}
              <Form.Item
                label={<span className="font-semibold text-charcoal uppercase tracking-wider">{t('admin.form.originalPrice')}</span>}
                validateStatus={errors.originalPrice ? 'error' : ''}
                help={errors.originalPrice?.message}
                layout="vertical"
                className="mb-0"
              >
                <Controller
                  name="originalPrice"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      placeholder="350000"
                      className="elegant-input font-mono text-zinc-400"
                    />
                  )}
                />
              </Form.Item>
            </div>
          </div>

          {/* Card Variants */}
          <div className="bg-bgLight border border-borderGray p-6 space-y-6 rounded-none">
            <div className="flex items-center justify-between border-b border-borderGray pb-2 mb-4">
              <h4 className="font-playfair text-xs font-bold uppercase tracking-widest text-primaryGold">
                Biến thể phân loại kích cỡ & màu sắc
              </h4>
              <Button
                type="link"
                size="small"
                onClick={() => appendVariant({ size: 'M', color: 'White', stock: 10, sku: '' })}
                className="text-[10px] font-bold text-primaryGold hover:text-ink uppercase tracking-wider font-outfit cursor-pointer p-0 h-auto"
              >
                + {t('admin.form.addVariantBtn')}
              </Button>
            </div>

            <div className="space-y-4">
              {variantFields.map((field, index) => (
                <div key={field.id} className="border border-borderGray p-4 space-y-3 relative bg-bg-neutral group">
                  {variantFields.length > 1 && (
                    <Button
                      type="link"
                      danger
                      onClick={() => removeVariant(index)}
                      className="absolute top-2 right-3 text-red-500 hover:text-red-700 font-bold text-sm cursor-pointer p-0 h-auto flex items-center justify-center"
                    >
                      <CloseOutlined className="text-xs" />
                    </Button>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
                    {/* Color */}
                    <div className="space-y-1 flex flex-col justify-start">
                      <label className="font-semibold text-charcoal uppercase text-[9px] tracking-wider h-5 flex items-center mb-1">
                        {t('admin.form.variantColor')}
                      </label>
                      <select
                        {...register(`variants.${index}.color` as const)}
                        className="w-full border-b border-t-0 border-x-0 border-b-border-gray py-1 text-xs focus:outline-none focus:border-b-primaryGold bg-transparent rounded-none cursor-pointer h-7"
                        onChange={() => suggestSku(index)}
                      >
                        <option value="White">{t('admin.form.colorWhite')}</option>
                        <option value="Black">{t('admin.form.colorBlack')}</option>
                        <option value="Red">{t('admin.form.colorRed')}</option>
                        <option value="Blue">{t('admin.form.colorBlue')}</option>
                        <option value="Grey">{t('admin.form.colorGrey')}</option>
                        <option value="Beige">{t('admin.form.colorBeige')}</option>
                        <option value="Gold">{t('admin.form.colorGold')}</option>
                        <option value="Pink">{t('admin.form.colorPink')}</option>
                        <option value="Green">{t('admin.form.colorGreen')}</option>
                      </select>
                      {errors.variants?.[index]?.color && (
                        <span className="text-red-500 text-[8px] mt-1 block leading-tight">
                          {errors.variants[index].color.message}
                        </span>
                      )}
                    </div>

                    {/* Size */}
                    <div className="space-y-1 flex flex-col justify-start">
                      <label className="font-semibold text-charcoal uppercase text-[9px] tracking-wider h-5 flex items-center mb-1">
                        {t('admin.form.variantSize')}
                      </label>
                      <input
                        type="text"
                        {...register(`variants.${index}.size` as const)}
                        placeholder="M, L, 31, 40..."
                        className="w-full border-b border-t-0 border-x-0 border-b-border-gray py-1 text-xs focus:outline-none focus:border-b-primaryGold bg-transparent rounded-none h-7"
                        onBlur={() => suggestSku(index)}
                      />
                      {errors.variants?.[index]?.size && (
                        <span className="text-red-500 text-[8px] mt-1 block leading-tight">
                          {errors.variants[index].size.message}
                        </span>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="space-y-1 flex flex-col justify-start">
                      <label className="font-semibold text-charcoal uppercase text-[9px] tracking-wider h-5 flex items-center mb-1">
                        {t('admin.form.variantStock')}
                      </label>
                      <input
                        type="number"
                        {...register(`variants.${index}.stock` as const, { valueAsNumber: true })}
                        placeholder="10"
                        className="w-full border-b border-t-0 border-x-0 border-b-border-gray py-1 text-xs focus:outline-none focus:border-b-primaryGold rounded-none bg-transparent font-mono h-7"
                      />
                      {errors.variants?.[index]?.stock && (
                        <span className="text-red-500 text-[8px] mt-1 block leading-tight">
                          {errors.variants[index].stock.message}
                        </span>
                      )}
                    </div>

                    {/* SKU */}
                    <div className="space-y-1 flex flex-col justify-start">
                      <label className="font-semibold text-charcoal uppercase text-[9px] tracking-wider h-5 flex items-center justify-between mb-1">
                        <span>{t('admin.form.variantSku')}</span>
                        <Button
                          type="link"
                          size="small"
                          onClick={() => suggestSku(index)}
                          className="text-[8px] text-primaryGold hover:text-ink uppercase hover:underline p-0 h-auto font-bold"
                        >
                          Gợi ý
                        </Button>
                      </label>
                      <input
                        type="text"
                        {...register(`variants.${index}.sku` as const)}
                        placeholder="SKU-ABC-123"
                        className="w-full border-b border-t-0 border-x-0 border-b-border-gray py-1 text-xs focus:outline-none focus:border-b-primaryGold rounded-none bg-transparent font-mono font-bold h-7"
                      />
                      {errors.variants?.[index]?.sku && (
                        <span className="text-red-500 text-[8px] mt-1 block leading-tight">
                          {errors.variants[index].sku.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {errors.variants && <p className="text-red-500 text-[10px] mt-1">{errors.variants.message}</p>}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span className="font-playfair font-bold uppercase tracking-wider text-xs px-1 select-none">
          3. {t('admin.form.tabImages')}
        </span>
      ),
      children: (
        <div className="space-y-6 pt-4">
          <div className="bg-bgLight border border-borderGray p-6 space-y-6 rounded-none">
            {/* Toolbar thêm ảnh */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end border-b border-borderGray pb-6">
              {/* Upload file từ máy tính */}
              <div className="space-y-2">
                <label className="font-semibold text-charcoal uppercase tracking-wider block">
                  {t('admin.form.uploadComputer')}
                </label>
                <Button
                  type="default"
                  onClick={triggerMainFileInput}
                  className="w-full border border-dashed border-ink hover:border-primaryGold hover:text-primaryGold text-xs font-semibold py-5 uppercase tracking-widest font-outfit cursor-pointer h-12 rounded-none flex items-center justify-center gap-2 bg-white"
                >
                  {uploadingIdx === -1 ? (
                    <Spin size="small" />
                  ) : (
                    <>
                      <UploadOutlined />
                      {t('admin.form.uploadBtn')}
                    </>
                  )}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleMainFileChange}
                />
              </div>

              {/* Thêm link ảnh thủ công */}
              <div className="space-y-2">
                <label className="font-semibold text-charcoal uppercase tracking-wider block">
                  {t('admin.form.pasteUrl')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-grow border-b border-t-0 border-x-0 border-b-border-gray py-2 text-xs focus:outline-none focus:border-b-primaryGold bg-transparent rounded-none"
                  />
                  <Button
                    type="default"
                    onClick={handleAddUrlImage}
                    className="text-xs font-bold border border-ink text-ink hover:bg-ink hover:text-white uppercase tracking-widest font-outfit cursor-pointer h-10 px-4 rounded-none flex items-center gap-1 bg-white"
                  >
                    <LinkOutlined />
                    {t('admin.form.addBtn')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Grid preview ảnh mới kiểu khác */}
            <div className="space-y-2">
              <label className="font-semibold text-charcoal uppercase tracking-wider block mb-4">
                {t('admin.form.galleryTitle')} ({imageFields.length})
              </label>

              {imageFields.length === 0 ? (
                <div className="border border-dashed border-borderGray p-12 text-center text-charcoal select-none bg-bgLight">
                  {t('admin.form.noImages')}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {imageFields.map((field, index) => {
                    const url = watch(`images.${index}.url`);
                    const isPrimary = watch(`images.${index}.isPrimary`);
                    return (
                      <div
                        key={field.id}
                        className={`relative aspect-[3/4] bg-bg-neutral border overflow-hidden select-none group transition-all duration-300 ${
                          isPrimary ? 'border-primaryGold ring-2 ring-primaryGold ring-offset-2' : 'border-borderGray hover:border-zinc-400'
                        }`}
                      >
                        {/* Image element */}
                        <Image
                          src={getImageUrl(url)}
                          alt={`Product image ${index + 1}`}
                          fill
                          sizes="200px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />

                        {/* Image status badge */}
                        {isPrimary && (
                          <div className="absolute top-2 left-2 bg-primaryGold text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider shadow z-10">
                            {t('admin.form.isPrimaryImage')}
                          </div>
                        )}

                        {/* Hover controls overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-2 p-3 z-20">
                          {!isPrimary && (
                            <Button
                              type="default"
                              size="small"
                              onClick={() => handlePrimaryRadioChange(index)}
                              className="w-full text-[9px] font-bold uppercase tracking-wider bg-white border-none text-ink hover:bg-primaryGold hover:text-white rounded-none cursor-pointer h-7 flex items-center justify-center gap-1"
                            >
                              <StarOutlined />
                              {t('admin.form.choosePrimary')}
                            </Button>
                          )}
                          <Button
                            type="default"
                            size="small"
                            danger
                            onClick={() => removeImage(index)}
                            className="w-full text-[9px] font-bold uppercase tracking-wider bg-red-600 border-none text-white hover:bg-red-700 rounded-none cursor-pointer h-7 flex items-center justify-center gap-1"
                          >
                            <DeleteOutlined />
                            {t('admin.form.deleteBtn')}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {errors.images && <p className="text-red-500 text-[10px] mt-1">{errors.images.message}</p>}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-outfit text-xs text-ink">
      
      {/* LEFT SECTION: 3-Tabs layout (Col-span 2) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-bgLight border border-borderGray p-6 rounded-none">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            items={tabItems}
            className="elegant-tabs"
            indicator={{ size: (origin) => origin - 16 }}
          />
        </div>
      </div>

      {/* RIGHT SECTION: Quick Preview & Save Actions (Col-span 1) */}
      <div className="space-y-6">
        {/* Quick summary card */}
        <div className="bg-bgLight border border-borderGray p-6 space-y-6 rounded-none select-none">
          <h3 className="font-playfair text-sm font-bold uppercase tracking-widest text-primaryGold border-b border-borderGray pb-3">
            {t('admin.form.summaryTitle')}
          </h3>

          {/* Miniature Live Preview */}
          <div className="flex gap-4 bg-bg-neutral p-4 border border-borderGray">
            <div className="w-16 aspect-[3/4] bg-white border border-borderGray overflow-hidden shrink-0 relative">
              <Image
                src={getImageUrl(primaryImageUrl)}
                alt="Quick preview"
                fill
                sizes="80px"
                className="object-cover animate-fade-in"
              />
            </div>
            <div className="flex-grow space-y-1 text-xs">
              <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest block">
                {watch('categoryId')
                  ? categories?.find((c) => c.id === watch('categoryId'))?.name || t('admin.form.noCategory')
                  : t('admin.form.noCategory')}
              </span>
              <h4 className="font-bold text-ink line-clamp-2 uppercase">
                {watch('name') || t('admin.form.noName')}
              </h4>
              <div className="text-primaryGold font-bold font-mono text-sm mt-1">
                {Number(watch('price') || 0).toLocaleString('vi-VN')} ₫
              </div>
            </div>
          </div>

          {/* Form Statistics */}
          <div className="space-y-2 text-charcoal border-t border-borderGray pt-4">
            <div className="flex justify-between">
              <span>{t('admin.form.numVariants')}</span>
              <span className="font-bold text-ink">{variantFields.length}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('admin.form.totalImages')}</span>
              <span className="font-bold text-ink">{imageFields.length}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('admin.form.primarySize')}</span>
              <span className="font-mono text-ink text-[10px]">
                {primaryImageIdx !== -1 ? t('admin.form.hasPrimary') : t('admin.form.noPrimary')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-bgLight border border-borderGray p-6 flex flex-col space-y-3 rounded-none">
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full bg-ink hover:bg-primaryGold text-white font-bold py-6 uppercase tracking-widest transition-all duration-300 rounded-none cursor-pointer border-none flex items-center justify-center text-xs font-outfit"
          >
            {isSubmitting ? t('admin.form.saving') : t('admin.form.saveBtn')}
          </Button>
        </div>
      </div>
      
    </form>
  );
}
