import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#111111] text-white py-12 mt-auto">
      <div className="mx-auto flex flex-col max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Giới thiệu */}
          <div className="space-y-4">
            <h3 className="font-outfit text-lg font-bold tracking-widest">FASHIONHUB</h3>
            <p className="text-zinc-400 text-xs leading-5">
              FashionHub mang lại giải pháp mua sắm thời trang cao cấp với triết lý tối giản, tinh tế và sang trọng.
            </p>
          </div>

          {/* Danh mục */}
          <div className="space-y-3">
            <h4 className="font-outfit text-xs font-semibold tracking-wider text-primary-gold uppercase">Sản phẩm</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/products" className="hover:text-white transition-all-300">Tất cả sản phẩm</Link></li>
              <li><Link href="/products?category=ao" className="hover:text-white transition-all-300">Bộ sưu tập áo</Link></li>
              <li><Link href="/products?category=quan" className="hover:text-white transition-all-300">Bộ sưu tập quần</Link></li>
            </ul>
          </div>

          {/* Chính sách */}
          <div className="space-y-3">
            <h4 className="font-outfit text-xs font-semibold tracking-wider text-primary-gold uppercase">Chính sách</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/policy/shipping" className="hover:text-white transition-all-300">Chính sách giao hàng</Link></li>
              <li><Link href="/policy/return" className="hover:text-white transition-all-300">Chính sách đổi trả</Link></li>
              <li><Link href="/policy/privacy" className="hover:text-white transition-all-300">Bảo mật thông tin</Link></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="space-y-3">
            <h4 className="font-outfit text-xs font-semibold tracking-wider text-primary-gold uppercase">Liên hệ</h4>
            <p className="text-zinc-400 text-xs leading-5">
              Địa chỉ: 123 Đường Thời Trang, Quận 1, TP. Hồ Chí Minh<br />
              Email: support@fashionhub.com<br />
              Hotline: 1800 9000
            </p>
          </div>
        </div>

        <hr className="border-zinc-800 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-500 uppercase tracking-wider gap-2">
          <p>© {new Date().getFullYear()} FashionHub. All rights reserved.</p>
          <p>Thiết kế bởi Antigravity</p>
        </div>
      </div>
    </footer>
  );
}
