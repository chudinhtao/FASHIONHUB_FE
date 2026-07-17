import { api } from '@/services/api';
import { ApiResponse, PaginatedResponse, Order, CheckoutInput, UpdateAddressInput, UpdateStatusInput, OrderStatus } from '@/types';

export const ordersApi = {
  async checkout(data: CheckoutInput): Promise<ApiResponse<Order>> {
    return api.post('/orders/checkout', data);
  },

  async getHistory(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Order>> {
    return api.get('/orders/history', { params });
  },

  async getDetail(idOrOrderNumber: string): Promise<ApiResponse<Order>> {
    return api.get(`/orders/${idOrOrderNumber}`);
  },

  async updateAddress(orderId: string, data: UpdateAddressInput): Promise<ApiResponse<Order>> {
    return api.put(`/orders/${orderId}/address`, data);
  },

  async cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
    return api.post(`/orders/${orderId}/cancel`);
  },

  // Admin APIs
  async findAllAdmin(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: OrderStatus;
  }): Promise<PaginatedResponse<Order>> {
    return api.get('/orders/admin', { params });
  },

  async updateStatusAdmin(orderId: string, data: UpdateStatusInput): Promise<ApiResponse<Order>> {
    return api.put(`/orders/admin/${orderId}/status`, data);
  },
};
