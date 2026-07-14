'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { api } from '@/services/api';

/**
 * Provider khởi tạo trạng thái xác thực của người dùng khi bắt đầu tải trang (App Hydration).
 * Đọc token từ localStorage và gọi API /auth/me để cập nhật Zustand auth store.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        clearAuth();
        return;
      }

      try {
        // Gọi API lấy thông tin cá nhân (Axios client đã được thiết lập gắn Bearer Token)
        const response: any = await api.get('/auth/me');
        const user = response.data || response;
        
        if (user) {
          setAuth(user);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.warn('Không thể tự động xác thực phiên làm việc:', error);
        clearAuth();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
      }
    };

    initializeAuth();
  }, [setAuth, clearAuth]);

  return <>{children}</>;
}
