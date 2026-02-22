import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking auth for /api/auth/me');
    const token = getTokenFromRequest(request);

    if (!token) {
      console.log('❌ No token found in /api/auth/me');
      return NextResponse.json(
        { error: 'احراز هویت نشده' },
        { status: 401 }
      );
    }

    console.log('🔑 Token found in /api/auth/me');
    const payload = verifyToken(token);

    if (!payload) {
      console.log('❌ Token invalid in /api/auth/me');
      return NextResponse.json(
        { error: 'توکن نامعتبر' },
        { status: 401 }
      );
    }

    console.log('✅ Auth successful for:', payload.email);
    return NextResponse.json({
      user: {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
}
