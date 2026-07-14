import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Bắt buộc để truyền tải HttpOnly cookie (Refresh Token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Gắn Access Token vào Header
api.interceptors.request.use(
  (config) => {
    // Thử lấy access token từ localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Quản lý hàng đợi khi refresh token đang diễn ra
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Unpack data & tự động refresh token khi gặp lỗi 401
api.interceptors.response.use(
  (response) => {
    // Unpack trả về dữ liệu payload trực tiếp (vì backend bọc trong class ApiResponse)
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 Unauthorized và request chưa được thử lại lần nào
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API cấp lại Access Token mới (Refresh Token tự động đính kèm qua Cookie HttpOnly)
        const resObj: any = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        // Lấy token mới từ DTO response bọc chuẩn
        const newAccessToken = resObj.data?.data?.accessToken || resObj.data?.accessToken;

        if (newAccessToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', newAccessToken);
          }
          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Nếu refresh token cũng hết hạn, tiến hành xoá session
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          toast.error('Phiên làm việc hết hạn, vui lòng đăng nhập lại.');
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Xử lý thông báo lỗi thân thiện nếu có lỗi validation hoặc các lỗi khác
    const errorData = error.response?.data;
    const errorMsg = errorData?.message || 'Có lỗi hệ thống xảy ra';
    return Promise.reject(errorData || { message: errorMsg });
  },
);
