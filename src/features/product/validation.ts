import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  slug: z.string().min(1, 'Slug không được để trống'),
  description: z.string().optional(),
  price: z.number({ message: 'Giá sản phẩm phải là số' }).min(0, 'Giá không được âm'),
  originalPrice: z.number().min(0, 'Giá gốc không được âm').optional().nullable(),
  categoryId: z.string().uuid('Danh mục không hợp lệ'),
  images: z.array(
    z.object({
      url: z.string().min(1, 'URL không được để trống'),
      isPrimary: z.boolean(),
    })
  ).min(1, 'Phải tải lên ít nhất 1 hình ảnh'),
  variants: z.array(
    z.object({
      size: z.string().optional().nullable(),
      color: z.string().optional().nullable(),
      stock: z.number().int('Số lượng tồn phải là số nguyên').min(0, 'Số lượng không được âm'),
      sku: z.string().min(1, 'SKU không được để trống'),
    })
  ).min(1, 'Phải có ít nhất 1 biến thể sản phẩm'),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
