import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';

// Helper function to check authentication
async function checkAuth(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    throw new Error('احراز هویت نشده');
  }

  const payload = verifyToken(token);
  if (!payload) {
    throw new Error('توکن نامعتبر');
  }

  return payload;
}

// POST - Force refresh project images cache
export async function POST(request: NextRequest) {
  try {
    await checkAuth(request);

    const { projectSlug } = await request.json();

    if (!projectSlug) {
      return NextResponse.json(
        { error: 'شناسه پروژه الزامی است' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const refreshId = Math.random().toString(36).substring(7);

    return NextResponse.json({
      success: true,
      message: 'کش تصاویر با موفقیت پاک شد',
      timestamp,
      refreshId,
      projectSlug
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'Last-Modified': new Date().toUTCString(),
        'ETag': `"${timestamp}"`,
        'Vary': '*',
        'X-Refresh-Trigger': 'true'
      }
    });

  } catch (error) {
    console.error('Refresh cache error:', error);
    
    if (error instanceof Error && (
      error.message.includes('احراز هویت') || 
      error.message.includes('توکن')
    )) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'خطا در پاک کردن کش' },
      { status: 500 }
    );
  }
}
