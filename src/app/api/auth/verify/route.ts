import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('admin_logged');

    if (!cookie || cookie.value !== 'true') {
      return NextResponse.json(
        { error: 'احراز هویت نشده' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'احراز هویت موفق'
    });

  } catch (error) {
    console.error('خطا در تایید احراز هویت:', error);
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
}
