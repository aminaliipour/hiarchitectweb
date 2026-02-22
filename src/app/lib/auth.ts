import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Log JWT_SECRET on initialization (only first few chars for security)
if (typeof window === 'undefined') {
  console.log('🔐 JWT_SECRET loaded:', JWT_SECRET.substring(0, 10) + '...');
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try to get token from cookie
  const tokenCookie = request.cookies.get('auth-token');
  if (tokenCookie) {
    return tokenCookie.value;
  }

  return null;
}

export function createAuthResponse(
  response: NextResponse,
  token: string
): NextResponse {
  // Set the token as an HTTP-only cookie
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/'
  });

  console.log('🍪 Cookie set with config:', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: '7 days',
    path: '/'
  });

  return response;
}

export function removeAuthCookie(response: NextResponse): NextResponse {
  response.cookies.delete('auth-token');
  return response;
}
