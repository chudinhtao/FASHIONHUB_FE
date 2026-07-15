import { api } from '@/services/api';
import { ApiResponse, Category } from '@/types';

export const categoryApi = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return api.get('/categories');
  },

  async createCategory(data: { name: string; parentId?: string }): Promise<ApiResponse<Category>> {
    return api.post('/categories', data);
  },

  async updateCategory(id: string, data: { name: string; parentId?: string | null }): Promise<ApiResponse<Category>> {
    return api.put(`/categories/${id}`, data);
  },

  async deleteCategory(id: string): Promise<ApiResponse<Category>> {
    return api.delete(`/categories/${id}`);
  },
};
