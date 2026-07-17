import { api } from '@/services/api';
import { ApiResponse, PaginatedResponse, ProductShort, ProductDetail, CreateProductInput } from '@/types';

export const productApi = {
  async getProducts(params?: {
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
  }): Promise<PaginatedResponse<ProductShort>> {
    return api.get('/products', { params });
  },

  async getProduct(idOrSlug: string): Promise<ApiResponse<ProductDetail>> {
    return api.get(`/products/${idOrSlug}`);
  },

  async createProduct(data: CreateProductInput): Promise<ApiResponse<any>> {
    return api.post('/products', data);
  },

  async updateProduct(id: string, data: CreateProductInput): Promise<ApiResponse<any>> {
    return api.put(`/products/${id}`, data);
  },

  async deleteProduct(id: string): Promise<ApiResponse<any>> {
    return api.delete(`/products/${id}`);
  },
};
