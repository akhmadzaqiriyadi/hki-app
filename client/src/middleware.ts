import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/admin'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('hki_portal_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Jika pengguna belum login dan mencoba akses halaman terproteksi
  if (!token && protectedRoutes.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Jika pengguna sudah login dan mencoba akses halaman login/register
  if (token && authRoutes.some(path => pathname.startsWith(path))) {
    // Di sini kita bisa menambahkan logika untuk redirect berdasarkan role jika token bisa di-decode
    // Untuk sekarang, kita arahkan ke dasbor umum
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Konfigurasi path mana saja yang akan dijalankan oleh middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
}