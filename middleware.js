import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const user = request.cookies.get('user')?.value
  
  const { pathname } = request.nextUrl
  
  // Parse user data if available
  let userData = null
  if (user) {
    try {
      userData = JSON.parse(user)
    } catch (e) {
      console.error('Failed to parse user data:', e)
    }
  }
  
  // Protected routes configuration
  const vendorRoutes = pathname.startsWith('/vendor')
  const customerRoutes = pathname.startsWith('/customer')
  const adminRoutes = pathname.startsWith('/admin')
  const authRoutes = pathname === '/login' || pathname === '/register'
  
  // If not authenticated and trying to access protected routes
  if (!token && (vendorRoutes || customerRoutes || adminRoutes)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If authenticated and trying to access auth pages, redirect based on role
  if (token && authRoutes && userData) {
    if (userData.role === 'vendor') {
      return NextResponse.redirect(new URL('/vendor/dashboard', request.url))
    } else if (userData.role === 'customer') {
      return NextResponse.redirect(new URL('/customer/dashboard', request.url))
    } else if (userData.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Role-based access control
  if (userData) {
    if (vendorRoutes && userData.role !== 'vendor') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (customerRoutes && userData.role !== 'customer') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (adminRoutes && userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/vendor/:path*',
    '/customer/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ]
}
