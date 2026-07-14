'use client';

import React from 'react';
import { Button, Space, Card, Typography, Divider } from 'antd';
import { toast } from 'sonner';
import { ShoppingOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const handleTestToast = () => {
    toast.success('Sonner toast hoạt động hoàn hảo!', {
      description: 'Giao diện và các thư viện core đã sẵn sàng cho dự án.',
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#F9F9F9]">
      <Card className="w-full max-w-2xl border-0 shadow-lg" style={{ borderRadius: 0 }}>
        <div className="text-center py-6">
          <Title level={2} style={{ margin: 0, fontFamily: 'var(--font-outfit)', letterSpacing: '0.05em' }}>
            FASHIONHUB
          </Title>
          <Text type="secondary" className="uppercase tracking-widest text-[10px]">
            Premium Clothing Store MVP
          </Text>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div className="py-4">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircleOutlined style={{ color: '#C5A880', fontSize: '24px' }} />
            <Title level={4} style={{ margin: 0, fontFamily: 'var(--font-outfit)' }}>
              Core Framework Đã Sẵn Sàng!
            </Title>
          </div>

          <Paragraph className="text-zinc-600 leading-6">
            Hệ thống boilerplate nền tảng cho Next.js App Router (Frontend) và NestJS + PostgreSQL (Backend) đã được khởi tạo thành công 100%. Không phát hiện lỗi cú pháp hay cấu hình.
          </Paragraph>

          <Title level={5} style={{ fontFamily: 'var(--font-outfit)', marginTop: 24 }}>
            Các công nghệ đã thiết lập:
          </Title>
          <ul className="list-disc pl-5 space-y-2 text-zinc-600 text-sm">
            <li>
              <strong className="text-black">Next.js App Router & TypeScript</strong> - Router & Cấu trúc dự án sạch.
            </li>
            <li>
              <strong className="text-black">Ant Design (antd) & Tailwind CSS v4</strong> - Tích hợp SSR mượt mà không chớp layout, đồng bộ thiết kế Elegant/Minimalist.
            </li>
            <li>
              <strong className="text-black">Zustand & TanStack React Query</strong> - Store quản lý client state & server state cache.
            </li>
            <li>
              <strong className="text-black">Sonner Toast Notifications</strong> - Toast thông báo hiện đại.
            </li>
            <li>
              <strong className="text-black">Axios API Client</strong> - Tự động đính kèm và làm mới JWT tokens.
            </li>
          </ul>
        </div>

        <Divider style={{ margin: '20px 0' }} />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
          <Space size="middle">
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              className="elegant-button h-[42px]"
              onClick={() => toast.info('Trang mua sắm sẽ có ở các Sprint tiếp theo!')}
            >
              Vào Cửa Hàng
            </Button>
            <Button
              icon={<SettingOutlined />}
              className="h-[42px] rounded-none border-black hover:border-primary-gold hover:text-primary-gold"
              onClick={handleTestToast}
            >
              Test Toast (Sonner)
            </Button>
          </Space>
          <Text className="text-xs text-zinc-400">
            Sprint 1 • Core Framework
          </Text>
        </div>
      </Card>
    </div>
  );
}
