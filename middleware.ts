import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/app/lib/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle slider images with minimal caching to allow quick updates
  if (pathname.startsWith('/images/slides/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=60, must-revalidate');
    response.headers.set('Last-Modified', new Date().toUTCString());
    response.headers.set('ETag', `"${Date.now()}"`);
    return response;
  }

  // Handle project images to prevent caching
  if (pathname.startsWith('/images/projects/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('Last-Modified', new Date().toUTCString());
    response.headers.set('ETag', `"${Date.now()}"`);
    response.headers.set('Vary', '*');
    return response;
  }

  // Handle API routes to prevent caching
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // Check if the path starts with /admin (but not /admin/login)
  if (pathname.startsWith('/admin') && 
      !pathname.startsWith('/admin/login')) {
    
    console.log('🔒 Middleware: Checking admin route:', pathname);
    console.log('🍪 All cookies:', request.cookies.getAll().map(c => c.name));
    
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth-token')?.value ||
                 request.headers.get('authorization')?.replace('Bearer ', '');

    console.log('🔑 Token exists:', !!token);
    if (token) {
      console.log('🔑 Token value (first 20 chars):', token.substring(0, 20) + '...');
    }

    if (!token) {
      console.log('❌ No token found, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token
    const payload = verifyToken(token);
    console.log('✅ Token verification result:', payload ? 'Valid' : 'Invalid');
    
    if (!payload) {
      console.log('❌ Invalid token, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    console.log('✅ Admin access granted to:', payload.email);
    
    // Add user info to headers for API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId);
    response.headers.set('x-user-email', payload.email);
    response.headers.set('x-user-role', payload.role);
    
    return response;
  }

  // Check if the request is for member protected routes
  if (pathname.startsWith('/member')) {
    console.log('Middleware: Checking member route:', pathname);
    
    const memberToken = request.cookies.get('member_token')?.value;
    console.log('Middleware: Token found:', !!memberToken);

    if (!memberToken) {
      console.log('Middleware: No token, redirecting to login');
      return NextResponse.redirect(new URL('/login/member', request.url));
    }

    try {
      const decoded = jwt.verify(memberToken, JWT_SECRET) as { id: string };
      console.log('Middleware: Token valid, proceeding');
      return NextResponse.next();
    } catch (error) {
      console.log('Middleware: Token invalid, clearing and redirecting');
      // Token is invalid, clear it and redirect
      const response = NextResponse.redirect(new URL('/login/member', request.url));
      response.cookies.delete('member_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/member/:path*',
    '/images/slides/:path*',
    '/images/projects/:path*',
    '/api/:path*'
  ]
};
