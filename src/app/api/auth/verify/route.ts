import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'توکن احراز هویت موجود نیست' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'توکن نامعتبر یا منقضی شده است' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'احراز هویت موفق',
      user: {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      }
    });

  } catch (error) {
    console.error('خطا در تایید احراز هویت:', error);
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
}
