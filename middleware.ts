import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/app/lib/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

export function middleware(request: NextRequest) {
  // Check if the path starts with /admin (but not /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth-token')?.value ||
                 request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Add user info to headers for API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId);
    response.headers.set('x-user-email', payload.email);
    response.headers.set('x-user-role', payload.role);
    
    return response;
  }

  // Check if the request is for member protected routes
  if (request.nextUrl.pathname.startsWith('/member')) {
    console.log('Middleware: Checking member route:', request.nextUrl.pathname);
    
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
    '/api/projects/:path*',
    '/api/slider/:path*',
    '/api/upload/:path*',
    '/member/:path*'
  ]
};
