'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import ProductForm from '@/features/product/components/ProductForm';
import { ProductFormValues } from '@/features/product/validation';
import { useCreateProduct } from '@/features/product/hooks';
import { toast } from 'sonner';
import { Button } from '@/components/ui';

export default function AdminNewProductPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const createProductMutation = useCreateProduct();

  const handleSubmit = (values: ProductFormValues) => {
    createProductMutation.mutate(
      {
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
      {
        onSuccess: () => {
          toast.success(t('admin.products.createSuccess', 'Tạo sản phẩm thành công'));
          router.push('/admin/products');
        },
        onError: (err: any) => {
          toast.error(err.message || t('admin.products.createError', 'Lỗi khi tạo sản phẩm'));
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-borderGray select-none">
        <div>
          <h1 className="text-xl font-bold font-playfair text-ink uppercase tracking-wider">
            {t('admin.products.createTitle', 'Tạo Sản Phẩm Mới')}
          </h1>
          <p className="text-xs text-charcoal mt-1">
            {t('admin.products.createSubtitle', 'Bố cục hai cột chuyên nghiệp, hiển thị trực quan thông tin sản phẩm.')}
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
      <ProductForm onSubmit={handleSubmit} isSubmitting={createProductMutation.isPending} />
    </div>
  );
}
