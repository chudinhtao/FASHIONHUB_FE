'use client';

import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FolderOpenOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/features/auth/hooks';

const { Sider } = Layout;

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useLogout();

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Tổng Quan</Link>,
    },
    {
      key: '/admin/categories',
      icon: <FolderOpenOutlined />,
      label: <Link href="/admin/categories">Quản lý Danh mục</Link>,
    },
    {
      key: '/admin/products',
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/products">Quản lý Sản phẩm</Link>,
    },
    {
      key: '/admin/orders',
      icon: <OrderedListOutlined />,
      label: <Link href="/admin/orders">Quản lý Đơn hàng</Link>,
    },
  ];

  return (
    <Sider
      theme="dark"
      breakpoint="lg"
      collapsedWidth="0"
      width={260}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#0B0F19',
        zIndex: 100,
      }}
    >
      <div className="flex h-16 items-center justify-center border-b border-zinc-800">
        <span className="font-outfit text-sm font-bold tracking-widest text-white">
          FASHIONHUB ADMIN
        </span>
      </div>

      <div className="flex flex-col justify-between h-[calc(100vh-64px)] py-4">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ backgroundColor: 'transparent', borderRight: 0 }}
        />

        <div className="px-4 py-2 border-t border-zinc-800">
          <Menu
            theme="dark"
            mode="inline"
            selectable={false}
            style={{ backgroundColor: 'transparent', borderRight: 0 }}
            items={[
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Đăng xuất',
                onClick: () => {
                  logout();
                },
              },
            ]}
          />
        </div>
      </div>
    </Sider>
  );
}
