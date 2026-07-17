import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { productApi } from './api';
import { useCategories } from '@/features/category/hooks';
import { useAuthStore } from '@/store/auth';
import { useAddToCart } from '@/features/cart/hooks';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';
import { CreateProductInput, ProductShort } from '@/types';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productFormSchema, ProductFormValues } from './validation';
import { api } from '@/services/api';

// React Query Wrappers
export const useProducts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  onlySale?: boolean;
  color?: string;
  size?: string;
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getProducts(params),
  });
};

export const useProductDetail = (idOrSlug: string) => {
  return useQuery({
    queryKey: ['product', idOrSlug],
    queryFn: async () => {
      const res = await productApi.getProduct(idOrSlug);
      return res.data;
    },
    enabled: !!idOrSlug,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductInput) => productApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateProductInput }) => productApi.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Custom Feature Hooks
export const useProductList = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  // State filters
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [search, setSearch] = useState<string>('');
  const [onlySale, setOnlySale] = useState<boolean>(false);
  const [color, setColor] = useState<string>('');
  const [size, setSize] = useState<string>('');

  // Sync with searchParams if page mounted with queries
  useEffect(() => {
    const cat = searchParams.get('categorySlug') || '';
    if (cat) {
      setCategorySlug(cat);
      setCurrentPage(1);
    }
    const q = searchParams.get('search') || '';
    if (q) {
      setSearch(q);
      setCurrentPage(1);
    }
  }, [searchParams]);



  // Fetch data
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isError,
    refetch,
  } = useProducts({
    page: currentPage,
    limit: 12,
    search: search || undefined,
    categorySlug: categorySlug || undefined,
    minPrice: minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice < 2000000 ? maxPrice : undefined,
    sortBy,
    onlySale: onlySale || undefined,
    color: color || undefined,
    size: size || undefined,
  });

  const products = productsResponse?.data || [];
  const meta = productsResponse?.meta;

  const handleCategorySelect = (slug: string) => {
    if (categorySlug === slug) {
      setCategorySlug(''); // Toggle off
    } else {
      setCategorySlug(slug);
    }
    setCurrentPage(1);
  };



  const clearAllFilters = () => {
    setCategorySlug('');
    setMinPrice(0);
    setMaxPrice(2000000);
    setSearch('');
    setSortBy('newest');
    setOnlySale(false);
    setColor('');
    setSize('');
    setCurrentPage(1);
    router.push('/products');
  };

  return {
    t,
    currentPage,
    setCurrentPage,
    sortBy,
    setSortBy,
    categorySlug,
    setCategorySlug,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    search,
    setSearch,
    onlySale,
    setOnlySale,
    color,
    setColor,
    size,
    setSize,
    categories,
    isCategoriesLoading,
    products,
    isProductsLoading,
    isError,
    refetch,
    meta,
    handleCategorySelect,
    clearAllFilters,
  };
};

export const useProductDetailView = () => {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Fetch product detail
  const { data: product, isLoading, isError, refetch } = useProductDetail(slug);

  // Cart integration
  const { isAuthenticated } = useAuthStore();
  const addToCartMut = useAddToCart();
  const localCart = useCartStore();

  // States
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Set default states when product loads
  useEffect(() => {
    if (product) {
      const primaryImg = product.images.find((img) => img.isPrimary) || product.images[0];
      if (primaryImg) {
        setSelectedImage(primaryImg.url);
      }

      const colors = Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean))) as string[];
      const sizes = Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean))) as string[];

      if (colors.length > 0) {
        setSelectedColor(colors[0]);
      }
      if (sizes.length > 0) {
        setSelectedSize(sizes[0]);
      }
    }
  }, [product]);

  // Find variant matching current selection
  const activeVariant = product?.variants.find((v) => {
    const colorMatch = !selectedColor || v.color === selectedColor;
    const sizeMatch = !selectedSize || v.size === selectedSize;
    return colorMatch && sizeMatch;
  });

  const hasStock = activeVariant ? activeVariant.stock > 0 : false;
  const stockCount = activeVariant ? activeVariant.stock : 0;

  const handleQtyChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && (!activeVariant || newQty <= activeVariant.stock)) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!activeVariant) {
      toast.error(t('product.toast.invalidVariant', 'Phân loại sản phẩm không hợp lệ'));
      return;
    }
    if (!hasStock) {
      toast.error(t('product.toast.outOfStock', 'Sản phẩm đã hết hàng'));
      return;
    }

    if (isAuthenticated) {
      addToCartMut.mutate({
        variantId: activeVariant.id,
        quantity: quantity,
      });
    } else {
      localCart.addItem({
        id: activeVariant.id,
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: quantity,
        size: selectedSize || null,
        color: selectedColor || null,
        image: selectedImage || undefined,
      });
      toast.success(t('product.toast.addSuccess', 'Đã thêm sản phẩm vào giỏ hàng!'));
    }
  };

  return {
    t,
    product,
    isLoading,
    isError,
    refetch,
    selectedImage,
    setSelectedImage,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    activeVariant,
    hasStock,
    stockCount,
    handleQtyChange,
    handleAddToCart,
  };
};

export const useRelatedProducts = (productId?: string, categorySlug?: string) => {
  const { data: relatedResponse } = useProducts({
    categorySlug,
    limit: 5,
  });

  const relatedProducts = (relatedResponse?.data || [])
    .filter((item) => item.id !== productId)
    .slice(0, 4);

  return { relatedProducts };
};

export const useProductAdminList = () => {
  const { t } = useTranslation();
  const router = useRouter();

  // Filters State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [categorySlug, setCategorySlug] = useState<string>('');

  // Fetch Data
  const { data: categories } = useCategories();
  const {
    data: productsResponse,
    isLoading,
    isError,
    refetch,
  } = useProducts({
    page: currentPage,
    limit: 10,
    search: search || undefined,
    categorySlug: categorySlug || undefined,
  });

  const deleteProductMutation = useDeleteProduct();

  const products = productsResponse?.data || [];
  const meta = productsResponse?.meta;

  const handleDelete = (product: ProductShort) => {
    Modal.confirm({
      title: t('admin.common.confirmDeleteTitle', 'Xác nhận xóa'),
      content: t('admin.products.deleteConfirm', {
        name: product.name,
        defaultValue: `Bạn chắc chắn muốn xóa sản phẩm "${product.name}"? Thao tác này sẽ xóa vĩnh viễn sản phẩm và các biến thể liên quan.`,
      }),
      okText: t('admin.common.deleteBtn', 'Xóa'),
      okType: 'danger',
      cancelText: t('admin.common.cancelBtn', 'Hủy'),
      onOk() {
        return new Promise((resolve) => {
          deleteProductMutation.mutate(product.id, {
            onSuccess: () => {
              toast.success(t('admin.products.deleteSuccess', 'Xóa sản phẩm thành công'));
              resolve(null);
            },
            onError: (err: any) => {
              toast.error(err.message || t('admin.products.deleteError', 'Lỗi khi xóa sản phẩm'));
              resolve(null);
            },
          });
        });
      },
    });
  };

  return {
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
    deleteProductMutation,
    handleDelete,
  };
};

interface CategoryOption {
  value: string;
  label: string;
}

export const useProductForm = (
  initialValues?: Partial<ProductFormValues>
) => {
  const { t } = useTranslation();
  const { data: categories } = useCategories();

  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('1');

  // Helper to generate slug from name
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      originalPrice: null,
      categoryId: '',
      images: [],
      variants: [{ size: 'M', color: 'White', stock: 10, sku: '' }],
    },
  });

  // Load initial values if updating
  useEffect(() => {
    if (initialValues) {
      Object.keys(initialValues).forEach((key) => {
        setValue(key as any, (initialValues as any)[key]);
      });
    }
  }, [initialValues, setValue]);

  // Watch product name for auto-slugify
  const watchedName = watch('name');
  useEffect(() => {
    if (watchedName && !initialValues) {
      setValue('slug', slugify(watchedName));
    }
  }, [watchedName, setValue, initialValues]);

  // Field arrays
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'images',
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: 'variants',
  });

  // Helper to suggest SKU based on color/size/name
  const suggestSku = (index: number) => {
    const name = watch('name');
    const color = watch(`variants.${index}.color`);
    const size = watch(`variants.${index}.size`);

    const prefix = name
      ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 4)
      : 'PROD';
    const col = color ? color.slice(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '') : 'GEN';
    const sz = size ? size.toUpperCase().replace(/[^A-Z0-9]/g, '') : 'ALL';

    setValue(`variants.${index}.sku`, `${prefix}-${col}-${sz}`);
  };

  const handlePrimaryRadioChange = (index: number) => {
    imageFields.forEach((_, idx) => {
      setValue(`images.${idx}.isPrimary`, idx === index);
    });
    toast.success(t('admin.form.primaryImageSet'));
  };

  const triggerMainFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleMainFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Hình ảnh không được vượt quá 5MB.');
      return;
    }

    setUploadingIdx(-1);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response: any = await api.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const payload = response.data || response;
      if (payload && payload.url) {
        appendImage({ url: payload.url, isPrimary: imageFields.length === 0 });
        toast.success(t('admin.form.uploadSuccess'));
      } else {
        toast.error('Không tìm thấy đường dẫn ảnh từ máy chủ phản hồi.');
      }
    } catch (error: any) {
      console.error('Lỗi tải ảnh:', error);
      toast.error(error.message || t('admin.form.uploadError'));
    } finally {
      setUploadingIdx(null);
      e.target.value = '';
    }
  };

  const handleAddUrlImage = () => {
    if (!newImageUrl) {
      toast.error('Vui lòng nhập đường dẫn hình ảnh.');
      return;
    }
    appendImage({ url: newImageUrl, isPrimary: imageFields.length === 0 });
    setNewImageUrl('');
    toast.success(t('admin.form.urlAdded'));
  };

  const primaryImageIdx = imageFields.findIndex((img, idx) => watch(`images.${idx}.isPrimary`));
  const primaryImageUrl = primaryImageIdx !== -1 ? watch(`images.${primaryImageIdx}.url`) : '';

  const getCategoryOptions = (tree: any[], level = 0): CategoryOption[] => {
    const options: CategoryOption[] = [];
    tree.forEach((cat) => {
      const indent = level > 0 ? '— '.repeat(level) : '';
      options.push({
        value: cat.id,
        label: `${indent}${cat.name}`,
      });
      if (cat.children && cat.children.length > 0) {
        options.push(...getCategoryOptions(cat.children, level + 1));
      }
    });
    return options;
  };

  const onInvalid = (errors: any) => {
    toast.error(t('admin.form.validationFailed'), {
      description: t('admin.form.validationFailedDesc'),
    });

    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      if (['name', 'slug', 'categoryId', 'description'].includes(firstErrorField)) {
        setActiveTab('1');
      } else if (['price', 'originalPrice', 'variants'].includes(firstErrorField)) {
        setActiveTab('2');
      } else if (['images'].includes(firstErrorField)) {
        setActiveTab('3');
      }
    }
  };

  return {
    t,
    categories,
    uploadingIdx,
    setUploadingIdx,
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
    appendImage,
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
  };
};
