import { api } from '@/services/api';
import { ApiResponse, CartItem, AddToCartInput, UpdateCartQtyInput } from '@/types';

export const cartApi = {
  async getCart(): Promise<ApiResponse<CartItem[]>> {
    return api.get('/cart');
  },

  async addItem(data: AddToCartInput): Promise<ApiResponse<CartItem>> {
    return api.post('/cart', data);
  },

  async updateQuantity(itemId: string, data: UpdateCartQtyInput): Promise<ApiResponse<CartItem>> {
    return api.put(`/cart/${itemId}`, data);
  },

  async removeItem(itemId: string): Promise<ApiResponse<void>> {
    return api.delete(`/cart/${itemId}`);
  },

  async clearCart(): Promise<ApiResponse<void>> {
    return api.delete('/cart');
  },
};
