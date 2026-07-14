'use client';

import React from 'react';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Space } from 'antd';
import Link from 'next/link';

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="font-outfit text-xl font-bold tracking-widest text-black">
          FASHIONHUB
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
          <Link href="/products" className="text-zinc-600 hover:text-black transition-all-300">SẢN PHẨM</Link>
          <Link href="/products?category=ao" className="text-zinc-600 hover:text-black transition-all-300">ÁO</Link>
          <Link href="/products?category=quan" className="text-zinc-600 hover:text-black transition-all-300">QUẦN</Link>
          <Link href="/products?category=phu-kien" className="text-zinc-600 hover:text-black transition-all-300">PHỤ KIỆN</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Space size="large">
            {/* Account */}
            <Link href={user ? "/profile" : "/login"} className="text-zinc-600 hover:text-black transition-all-300">
              <Space size={4}>
                <UserOutlined style={{ fontSize: '18px' }} />
                <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider">
                  {user ? user.name : 'ĐĂNG NHẬP'}
                </span>
              </Space>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="text-zinc-600 hover:text-black transition-all-300">
              <Badge count={totalItems} size="small" color="#C5A880">
                <ShoppingCartOutlined style={{ fontSize: '22px' }} />
              </Badge>
            </Link>
          </Space>
        </div>
      </div>
    </header>
  );
}
