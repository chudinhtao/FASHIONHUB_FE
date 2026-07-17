import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from './api';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { AddToCartInput } from '@/types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useCart = () => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await cartApi.getCart();
      return res.data || [];
    },
    enabled: isAuthenticated,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AddToCartInput) => cartApi.addItem(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(res.message || 'Đã thêm sản phẩm vào giỏ hàng!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Lỗi khi thêm vào giỏ hàng.');
    },
  });
};

export const useUpdateCartQty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateQuantity(itemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Lỗi khi cập nhật số lượng.');
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(res.message || 'Đã xóa sản phẩm khỏi giỏ hàng.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Lỗi khi xóa sản phẩm.');
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Lỗi khi xóa giỏ hàng.');
    },
  });
};

// 🛒 Custom hook to manage all Cart UI state and calculations (Dual-mode: Database + Guest fallback)
export const useCartView = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const dbCart = useCart();
  const localCart = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const updateQtyMut = useUpdateCartQty();
  const removeItemMut = useRemoveCartItem();
  const clearCartMut = useClearCart();

  const items = isAuthenticated
    ? (dbCart.data || [])
    : localCart.items.map((item) => ({
        id: item.id,
        userId: '',
        variantId: item.id,
        quantity: item.quantity,
        createdAt: '',
        updatedAt: '',
        variant: {
          id: item.id,
          productId: item.productId,
          size: item.size || null,
          color: item.color || null,
          stock: 999, // default guest fallback stock
          sku: '',
          createdAt: '',
          updatedAt: '',
          product: {
            id: item.productId,
            name: item.name,
            slug: '',
            description: '',
            price: String(item.price),
            originalPrice: null,
            categoryId: '',
            createdAt: '',
            updatedAt: '',
            images: item.image ? [{ id: '', productId: item.productId, url: item.image, isPrimary: true, createdAt: '' }] : [],
            category: { id: '', name: '', slug: '', parentId: null, createdAt: '', updatedAt: '' }
          }
        }
      }));

  const isLoading = isAuthenticated ? dbCart.isLoading : !mounted;

  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.variant.product.price) * item.quantity;
  }, 0);

  const shippingFee = subtotal > 0 ? 30000 : 0;
  const total = subtotal + shippingFee;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const hasStockWarning = items.some((item) => item.quantity > item.variant.stock);

  const handleQtyChange = (item: any, delta: number) => {
    if (isAuthenticated) {
      const newQty = item.quantity + delta;
      if (newQty < 1) return;
      updateQtyMut.mutate({ itemId: item.id, quantity: newQty });
    } else {
      const targetItem = localCart.items.find((i) => i.id === item.id);
      if (!targetItem) return;
      const newQty = targetItem.quantity + delta;
      if (newQty < 1) return;
      localCart.addItem({
        ...targetItem,
        quantity: delta,
      });
    }
  };

  const handleRemove = (itemId: string) => {
    if (window.confirm(t('cart.deleteConfirm', 'Xóa sản phẩm này khỏi giỏ hàng?'))) {
      if (isAuthenticated) {
        removeItemMut.mutate(itemId);
      } else {
        localCart.removeItem(itemId);
        toast.success(t('cart.removeSuccess', 'Đã xóa sản phẩm khỏi giỏ hàng.'));
      }
    }
  };

  const handleClear = () => {
    if (window.confirm(t('cart.clearConfirm', 'Xóa toàn bộ giỏ hàng?'))) {
      if (isAuthenticated) {
        clearCartMut.mutate();
      } else {
        localCart.clearCart();
      }
    }
  };

  return {
    t,
    items,
    isLoading,
    subtotal,
    shippingFee,
    total,
    totalCount,
    hasStockWarning,
    handleQtyChange,
    handleRemove,
    handleClear,
    isUpdating: isAuthenticated ? updateQtyMut.isPending : false,
    isRemoving: isAuthenticated ? removeItemMut.isPending : false,
  };
};
