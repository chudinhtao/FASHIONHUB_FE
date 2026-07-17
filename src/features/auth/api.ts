import { api } from '@/services/api';
import { ApiResponse } from '@/types/api.types';
import { User, LoginData } from './types';

export const authApi = {
  /**
   * Đăng nhập
   */
  async login(data: any): Promise<ApiResponse<LoginData>> {
    return api.post('/auth/login', data);
  },

  /**
   * Đăng ký
   */
  async register(data: any): Promise<ApiResponse<User>> {
    return api.post('/auth/register', data);
  },

  /**
   * Đăng xuất
   */
  async logout(): Promise<ApiResponse<void>> {
    return api.post('/auth/logout');
  },

  /**
   * Lấy thông tin cá nhân hiện tại
   */
  async getMe(): Promise<ApiResponse<User>> {
    return api.get('/auth/me');
  },

  /**
   * Yêu cầu khôi phục mật khẩu
   */
  async forgotPassword(data: { email: string }): Promise<ApiResponse<{ resetToken: string }>> {
    return api.post('/auth/forgot-password', data);
  },

  /**
   * Đặt lại mật khẩu mới
   */
  async resetPassword(data: any): Promise<ApiResponse<void>> {
    return api.post('/auth/reset-password', data);
  },

  /**
   * Cập nhật thông tin cá nhân
   */
  async updateMe(data: { name: string; phone?: string; address?: string }): Promise<ApiResponse<User>> {
    return api.put('/auth/me', data);
  },
};
