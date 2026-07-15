'use client';

import '@/lib/i18n';
import React, { useState } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Khởi tạo QueryClient lưu trong state để tránh tạo mới khi Component re-render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Caching dữ liệu trong 1 phút
            refetchOnWindowFocus: false, // Tránh gọi lại API khi thay đổi focus cửa sổ
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#C5A880',      // Điểm nhấn màu Gold thương hiệu
              colorInfo: '#C5A880',
              colorBgBase: '#FFFFFF',       // Nền trắng
              colorTextBase: '#000000',     // Chữ đen sang trọng
              fontFamily: 'var(--font-inter), sans-serif',
              borderRadius: 2,              // Bo nhẹ
            },
            components: {
              Button: {
                colorPrimary: '#000000',      // Button primary mặc định màu đen
                colorPrimaryHover: '#C5A880', // Hover Button primary chuyển sang Gold
                borderRadius: 0,              // Thiết kế nút bấm vuông vức
                controlHeight: 40,
              },
              Input: {
                borderRadius: 0,              // Ô nhập liệu vuông vức
                controlHeight: 40,
              },
              Table: {
                borderRadius: 0,
                headerBg: '#F9F9F9',
                headerColor: '#000000',
              },
            },
          }}
        >
          <App>
            <AuthProvider>
              {children}
            </AuthProvider>
          </App>
          <Toaster position="top-right" richColors closeButton />
        </ConfigProvider>
      </AntdRegistry>
    </QueryClientProvider>
  );
}
