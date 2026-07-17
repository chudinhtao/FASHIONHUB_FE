import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from './api';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import type { CreateReviewInput } from './types';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewFormSchema } from './components/ReviewForm.schema';
import type { ReviewFormValues } from './components/ReviewForm.schema';
import { api } from '@/services/api';
import { useTranslation } from 'react-i18next';

export const useProductReviews = (productId: string, page = 1, limit = 5) => {
  return useQuery({
    queryKey: ['reviews', productId, { page, limit }],
    queryFn: async () => {
      const res = await reviewsApi.getProductReviews(productId, { page, limit });
      return res;
    },
    enabled: !!productId,
  });
};

export const useProductStats = (productId: string) => {
  return useQuery({
    queryKey: ['reviews-stats', productId],
    queryFn: async () => {
      const res = await reviewsApi.getProductStats(productId);
      return res.data;
    },
    enabled: !!productId,
  });
};

export const useCanReview = (productId: string) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['can-review', productId],
    queryFn: async () => {
      const res = await reviewsApi.canReview(productId);
      return res.data;
    },
    enabled: isAuthenticated && !!productId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewInput) => reviewsApi.createReview(data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews-stats', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['can-review', variables.productId] });
      toast.success(res.message || 'Cảm ơn bạn đã gửi đánh giá!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Lỗi khi gửi đánh giá.');
    },
  });
};

export const useDeleteReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.deleteReview(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews-stats', productId] });
      toast.success(res.message || 'Ẩn đánh giá thành công!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Lỗi khi ẩn đánh giá.');
    },
  });
};

export const useReviewFormView = (productId: string) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: '',
      images: [],
    },
  });

  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = form;
  const images = watch('images') || [];
  const createReviewMut = useCreateReview();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 3 - images.length;
    if (remainingSlots <= 0) {
      toast.error(t('reviews.form.validation.imagesMax', 'Chỉ được phép đính kèm tối đa 3 hình ảnh.'));
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      toast.warning(t('reviews.form.validation.imagesExceeded', `Hệ thống tự động chọn ${remainingSlots} ảnh đầu tiên.`));
    }

    // Validate all chosen files first
    for (const file of filesToUpload) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: ${t('reviews.form.validation.imageSizeLimit', 'Ảnh không được vượt quá 5MB.')}`);
        return;
      }
      if (!file.type.match(/\/(jpg|jpeg|png|webp)$/)) {
        toast.error(`${file.name}: ${t('reviews.form.validation.imageTypeLimit', 'Chỉ chấp nhận định dạng ảnh JPG, JPEG, PNG, WEBP.')}`);
        return;
      }
    }

    setIsUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response: any = await api.post('/products/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const payload = response.data || response;
        const imageUrl = payload?.data?.url || payload?.url;
        if (!imageUrl) {
          throw new Error('Upload response does not contain image url');
        }
        return imageUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setValue('images', [...images, ...urls], { shouldDirty: true });
      toast.success(t('reviews.form.uploadSuccess', 'Tải ảnh lên thành công.'));
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || t('reviews.form.uploadError', 'Lỗi khi tải ảnh lên.'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue('images', newImages, { shouldDirty: true });
  };

  const onSubmit = (values: ReviewFormValues) => {
    createReviewMut.mutate(
      {
        productId,
        rating: values.rating,
        comment: values.comment || '',
        images: values.images,
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  return {
    t,
    control,
    handleSubmit,
    errors,
    images,
    isUploading,
    fileInputRef,
    createReviewMut,
    handleFileChange,
    removePhoto,
    onSubmit,
  };
};

export const useReviewListView = (productId: string) => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  const [limit, setLimit] = useState(5);

  const { data, isLoading, isError, refetch } = useProductReviews(productId, 1, limit);
  const deleteReviewMut = useDeleteReview(productId);

  const reviews = data?.data || [];
  const totalItems = data?.meta?.totalItems || 0;
  const hasMore = reviews.length < totalItems;

  return {
    t,
    isAdmin,
    reviews,
    totalItems,
    hasMore,
    isLoading,
    isError,
    refetch,
    limit,
    setLimit,
    deleteReviewMut,
  };
};
