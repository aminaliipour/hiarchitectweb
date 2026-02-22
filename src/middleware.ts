import { NextRequest, NextResponse } from 'next/server';

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

  // Check if the request is for admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for authentication token
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // You could also verify the token here, but we'll do it in the API routes
    // for better security and to avoid duplicating JWT logic
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/images/projects/:path*']
};
