import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from './api';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { CheckoutInput, UpdateAddressInput, UpdateStatusInput, OrderStatus, PaymentStatus } from '@/types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutFormSchema, CheckoutFormValues } from './components/CheckoutForm.schema';
import { useCartView } from '@/features/cart/hooks';

// --- REACT QUERY CRUD HOOKS ---
export const useCheckout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CheckoutInput) => ordersApi.checkout(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(res.message || 'Đặt hàng thành công!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Đặt hàng thất bại.');
    },
  });
};

export const useOrderHistory = (params?: { page?: number; limit?: number }) => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const res = await ordersApi.getHistory(params);
      return res;
    },
    enabled: isAuthenticated,
  });
};

export const useOrderDetail = (idOrOrderNumber: string) => {
  // Allow fetching order details without logged in check for guest orders
  return useQuery({
    queryKey: ['order', idOrOrderNumber],
    queryFn: async () => {
      const res = await ordersApi.getDetail(idOrOrderNumber);
      return res.data;
    },
    enabled: !!idOrOrderNumber,
  });
};

export const useUpdateOrderAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: UpdateAddressInput }) =>
      ordersApi.updateAddress(orderId, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(res.message || 'Cập nhật thông tin giao hàng thành công!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Lỗi khi cập nhật thông tin.');
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: string) => ordersApi.cancelOrder(orderId),
    onSuccess: (res, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(res.message || 'Hủy đơn hàng thành công!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Không thể hủy đơn hàng.');
    },
  });
};

// Admin Hooks
export const useAdminOrders = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';
  
  return useQuery({
    queryKey: ['admin-orders', params],
    queryFn: async () => {
      const res = await ordersApi.findAllAdmin(params);
      return res;
    },
    enabled: isAdmin,
  });
};

export const useAdminUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: UpdateStatusInput }) =>
      ordersApi.updateStatusAdmin(orderId, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success(res.message || 'Cập nhật trạng thái đơn hàng thành công!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Lỗi khi cập nhật trạng thái.');
    },
  });
};


// --- CUSTOM FEATURE PRESENTATION HOOKS (Separating UI logic) ---

// 1. Hook for Checkout views
export const useCheckoutView = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  // Call useCartView to get dual-mode mapped items list
  const { items, isLoading, subtotal, shippingFee, total, hasStockWarning } = useCartView();
  
  const checkoutMut = useCheckout();

  const formMethods = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      recipientName: '',
      phone: '',
      shippingAddress: '',
      notes: '',
    },
  });

  const { setValue } = formMethods;

  // Sync profile details
  useEffect(() => {
    if (user) {
      if (user.name) setValue('recipientName', user.name);
      if (user.phone) setValue('phone', user.phone);
      if (user.address) setValue('shippingAddress', user.address);
    }
  }, [user, setValue]);

  const handlePlaceOrder = (values: CheckoutFormValues) => {
    if (hasStockWarning) return;
    
    const payload: any = {
      recipientName: values.recipientName,
      phone: values.phone,
      shippingAddress: values.shippingAddress,
      notes: values.notes || undefined,
    };

    // If guest checkout, attach local cart items to payload
    if (!isAuthenticated) {
      payload.items = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));
    }

    checkoutMut.mutate(payload, {
      onSuccess: (res: any) => {
        const orderNumber = res.data?.orderNumber || '';
        
        // Clear local cart if guest checkout succeeds
        if (!isAuthenticated) {
          useCartStore.getState().clearCart();
        }
        
        router.push(`/checkout/success?orderNumber=${orderNumber}`);
      },
    });
  };

  return {
    t,
    items,
    isLoading,
    subtotal,
    shippingFee,
    total,
    hasStockWarning,
    formMethods,
    handlePlaceOrder: formMethods.handleSubmit(handlePlaceOrder),
    isSubmitting: checkoutMut.isPending,
  };
};

// 2. Hook for Order History list
export const useOrderHistoryView = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data: response, isLoading } = useOrderHistory({ page, limit: 10 });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return t('orders.detail.statusPending', 'Chờ xác nhận');
      case 'CONFIRMED':
        return t('orders.detail.statusConfirmed', 'Đã xác nhận');
      case 'PREPARING':
        return t('orders.detail.statusPreparing', 'Đang chuẩn bị');
      case 'SHIPPING':
        return t('orders.detail.statusShipping', 'Đang giao hàng');
      case 'DELIVERED':
        return t('orders.detail.statusDelivered', 'Đã giao hàng');
      case 'CANCELLED':
        return t('orders.detail.statusCancelled', 'Đã hủy');
      case 'RETURNED':
        return t('orders.detail.statusReturned', 'Đã trả hàng');
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-gold';
      case 'DELIVERED':
        return 'text-success';
      case 'CANCELLED':
        return 'text-error';
      default:
        return 'text-ink';
    }
  };

  const orders = response?.data || [];
  const meta = response?.meta;

  return {
    t,
    page,
    setPage,
    orders,
    meta,
    isLoading,
    getStatusText,
    getStatusColor,
  };
};

// 3. Hook for Customer Order Details view
export const useOrderDetailView = (orderId: string) => {
  const { t } = useTranslation();
  const { data: order, isLoading } = useOrderDetail(orderId);
  const cancelOrderMut = useCancelOrder();
  const updateAddressMut = useUpdateOrderAddress();

  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const addressForm = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      recipientName: '',
      phone: '',
      shippingAddress: '',
      notes: '',
    },
  });

  // Pre-fill form once when order data loads, but don't re-sync on every render
  useEffect(() => {
    if (order && !addressForm.formState.isDirty) {
      addressForm.reset({
        recipientName: order.recipientName,
        phone: order.phone,
        shippingAddress: order.shippingAddress,
        notes: order.notes || '',
      });
    }
  }, [order?.id]);

  const handleCancelOrder = () => {
    if (window.confirm(t('orders.detail.cancelConfirm', 'Bạn chắc chắn muốn hủy đơn hàng này?'))) {
      cancelOrderMut.mutate(orderId);
    }
  };

  const handleUpdateAddress = (values: CheckoutFormValues) => {
    updateAddressMut.mutate(
      {
        orderId,
        data: {
          recipientName: values.recipientName,
          phone: values.phone,
          shippingAddress: values.shippingAddress,
        },
      },
      {
        onSuccess: (res) => {
          setIsEditingAddress(false);
          // Reset form to the newly updated values so re-opening shows fresh data
          const updated = res?.data;
          if (updated) {
            addressForm.reset({
              recipientName: updated.recipientName,
              phone: updated.phone,
              shippingAddress: updated.shippingAddress,
              notes: updated.notes || '',
            });
          }
        },
      },
    );
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return t('orders.detail.statusPending', 'Chờ xác nhận');
      case 'CONFIRMED':
        return t('orders.detail.statusConfirmed', 'Đã xác nhận');
      case 'PREPARING':
        return t('orders.detail.statusPreparing', 'Đang chuẩn bị');
      case 'SHIPPING':
        return t('orders.detail.statusShipping', 'Đang giao hàng');
      case 'DELIVERED':
        return t('orders.detail.statusDelivered', 'Đã giao hàng');
      case 'CANCELLED':
        return t('orders.detail.statusCancelled', 'Đã hủy');
      case 'RETURNED':
        return t('orders.detail.statusReturned', 'Đã trả hàng');
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return t('orders.detail.paymentPending', 'Chưa thanh toán');
      case 'PAID':
        return t('orders.detail.paymentPaid', 'Đã thanh toán');
      case 'FAILED':
        return t('orders.detail.paymentFailed', 'Thanh toán thất bại');
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-gold';
      case 'DELIVERED':
        return 'text-success';
      case 'CANCELLED':
        return 'text-error';
      default:
        return 'text-ink';
    }
  };

  return {
    t,
    order,
    isLoading,
    isEditingAddress,
    setIsEditingAddress,
    addressForm,
    handleCancelOrder,
    handleUpdateAddress: addressForm.handleSubmit(handleUpdateAddress),
    isCancelling: cancelOrderMut.isPending,
    isUpdatingAddress: updateAddressMut.isPending,
    getStatusText,
    getPaymentStatusText,
    getStatusColor,
  };
};

// 4. Hook for Admin Orders list
export const useAdminOrdersView = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

  const { data: response, isLoading } = useAdminOrders({
    page,
    limit: 10,
    search: search || undefined,
    status: selectedStatus || undefined,
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return t('orders.detail.statusPending', 'Chờ xác nhận');
      case 'CONFIRMED':
        return t('orders.detail.statusConfirmed', 'Đã xác nhận');
      case 'PREPARING':
        return t('orders.detail.statusPreparing', 'Đang chuẩn bị');
      case 'SHIPPING':
        return t('orders.detail.statusShipping', 'Đang giao hàng');
      case 'DELIVERED':
        return t('orders.detail.statusDelivered', 'Đã giao hàng');
      case 'CANCELLED':
        return t('orders.detail.statusCancelled', 'Đã hủy');
      case 'RETURNED':
        return t('orders.detail.statusReturned', 'Đã trả hàng');
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-gold';
      case 'DELIVERED':
        return 'text-success';
      case 'CANCELLED':
        return 'text-error';
      default:
        return 'text-ink';
    }
  };

  const orders = response?.data || [];
  const meta = response?.meta;

  return {
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
  };
};

// 5. Hook for Admin Order Detail view
export const useAdminOrderDetailView = (orderId: string) => {
  const { t } = useTranslation();
  const { data: order, isLoading } = useOrderDetail(orderId);
  const updateStatusMut = useAdminUpdateOrderStatus();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus | ''>('');

  // Sync state variables once order is loaded
  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setSelectedPaymentStatus(order.paymentStatus);
    }
  }, [order]);

  const handleUpdateStatus = () => {
    if (!selectedStatus) return;
    updateStatusMut.mutate({
      orderId,
      data: {
        status: selectedStatus,
        paymentStatus: selectedPaymentStatus || undefined,
      },
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return t('orders.detail.statusPending', 'Chờ xác nhận');
      case 'CONFIRMED':
        return t('orders.detail.statusConfirmed', 'Đã xác nhận');
      case 'PREPARING':
        return t('orders.detail.statusPreparing', 'Đang chuẩn bị');
      case 'SHIPPING':
        return t('orders.detail.statusShipping', 'Đang giao hàng');
      case 'DELIVERED':
        return t('orders.detail.statusDelivered', 'Đã giao hàng');
      case 'CANCELLED':
        return t('orders.detail.statusCancelled', 'Đã hủy');
      case 'RETURNED':
        return t('orders.detail.statusReturned', 'Đã trả hàng');
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return t('orders.detail.paymentPending', 'Chưa thanh toán');
      case 'PAID':
        return t('orders.detail.paymentPaid', 'Đã thanh toán');
      case 'FAILED':
        return t('orders.detail.paymentFailed', 'Thanh toán thất bại');
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-gold';
      case 'DELIVERED':
        return 'text-success';
      case 'CANCELLED':
        return 'text-error';
      default:
        return 'text-ink';
    }
  };

  const isTerminalState =
    order &&
    (order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.RETURNED);

  return {
    t,
    order,
    isLoading,
    selectedStatus,
    setSelectedStatus,
    selectedPaymentStatus,
    setSelectedPaymentStatus,
    handleUpdateStatus,
    isUpdating: updateStatusMut.isPending,
    isTerminalState,
    getStatusText,
    getPaymentStatusText,
    getStatusColor,
  };
};
