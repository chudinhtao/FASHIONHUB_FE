'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useRouter } from 'next/navigation';
import ProductForm from '@/features/product/components/ProductForm';
import { ProductFormValues } from '@/features/product/validation';
import { useProductDetail, useUpdateProduct } from '@/features/product/hooks';
import { toast } from 'sonner';
import { Button } from '@/components/ui';

export default function AdminEditProductPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Query & Mutation
  const { data: product, isLoading, isError, refetch } = useProductDetail(id);
  const updateProductMutation = useUpdateProduct();

  const handleSubmit = (values: ProductFormValues) => {
    updateProductMutation.mutate(
      {
        id,
        data: {
          name: values.name,
          slug: values.slug,
          description: values.description ?? '',
          price: values.price,
          originalPrice: values.originalPrice ?? null,
          categoryId: values.categoryId,
          images: values.images.map((img) => ({ url: img.url, isPrimary: !!img.isPrimary })),
          variants: values.variants.map((v) => ({
            size: v.size ?? null,
            color: v.color ?? null,
            stock: v.stock,
            sku: v.sku,
          })),
        },
      },
      {
        onSuccess: () => {
          toast.success(t('admin.products.updateSuccess', 'Cập nhật sản phẩm thành công'));
          router.push('/admin/products');
        },
        onError: (err: any) => {
          toast.error(err.message || t('admin.products.updateError', 'Lỗi khi cập nhật sản phẩm'));
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center bg-bgLight border border-borderGray rounded-none">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-black animate-spin rounded-full"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-16 text-center space-y-4 border border-red-200 bg-red-50 select-none rounded-none">
        <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-red-700">
          {t('admin.products.errorTitle', 'Lỗi tải dữ liệu sản phẩm')}
        </h4>
        <Button
          danger
          onClick={() => refetch()}
          className="mt-4 border border-red-800 hover:bg-red-800 hover:text-white text-red-800 text-[10px] font-bold px-4 py-2 uppercase tracking-widest font-outfit transition-colors rounded-none cursor-pointer h-auto"
        >
          {t('admin.products.retry', 'Thử lại')}
        </Button>
      </div>
    );
  }

  // Map backend details product structure to form-compatible default values
  const initialValues: Partial<ProductFormValues> = {
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    categoryId: product.category.id,
    images: product.images.map((img) => ({
      url: img.url,
      isPrimary: img.isPrimary,
    })),
    variants: product.variants.map((v) => ({
      size: v.size || 'M',
      color: v.color || 'White',
      stock: v.stock,
      sku: v.sku,
    })),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-borderGray select-none">
        <div>
          <h1 className="text-xl font-bold font-playfair text-ink uppercase tracking-wider">
            {t('admin.products.editTitle', 'Cập Nhật Sản Phẩm')}
          </h1>
          <p className="text-xs text-charcoal mt-1">
            {t('admin.products.editSubtitle', 'Cập nhật kho hàng, điều chỉnh thông tin chung và hình ảnh.')}
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/products')}
          className="border border-borderGray hover:border-ink text-charcoal hover:text-ink text-xs font-bold px-5 py-2.5 uppercase tracking-widest font-outfit rounded-none transition-colors cursor-pointer bg-white h-auto"
        >
          {t('admin.products.cancelBtn', 'Hủy Bỏ')}
        </Button>
      </div>

      {/* Form Component */}
      <ProductForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isSubmitting={updateProductMutation.isPending}
      />
    </div>
  );
}
