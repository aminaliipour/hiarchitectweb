import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking auth for /api/auth/me');
    const isLoggedIn = request.cookies.get('admin_logged')?.value === 'true';

    if (!isLoggedIn) {
      console.log('❌ Not logged in');
      return NextResponse.json(
        { error: 'احراز هویت نشده' },
        { status: 401 }
      );
    }

    console.log('✅ Auth successful');
    return NextResponse.json({
      user: {
        authenticated: true
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
