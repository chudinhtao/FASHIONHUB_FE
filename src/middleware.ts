import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Hàm helper giải mã JWT thủ công tương thích với Edge Runtime của Next.js Middleware
function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  let role: string | null = null;
  if (token) {
    const payload = decodeJwt(token);
    role = payload?.role || null;
  }

  // 1. Bảo vệ các tuyến đường riêng tư (private routes)
  const isPrivateRoute = pathname.startsWith('/profile');
  const isProfileOrdersDetail = /^\/profile\/orders\/[^\/]+$/.test(pathname);

  if (isPrivateRoute && !isProfileOrdersDetail && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Bảo vệ các tuyến đường admin (/admin)
  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute) {
    if (!token) {
      // Chưa đăng nhập: chuyển về trang login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== 'ADMIN') {
      // Đã đăng nhập nhưng không phải ADMIN: chuyển hướng sang trang 403
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }

  // 3. Chặn truy cập lại trang Login/Register khi đã đăng nhập
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  if (isAuthRoute && token) {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

// Cấu hình các path chạy qua middleware
export const config = {
  matcher: ['/profile/:path*', '/login', '/register', '/admin/:path*'],
};
