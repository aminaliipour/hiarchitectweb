import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Get the secret from headers or query params for security
    const authHeader = request.headers.get('authorization');
    const secret = process.env.REVALIDATE_SECRET || 'your-secret-key';
    
    // Simple auth check (you can enhance this)
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type = 'sliders', paths = ['/'] } = body;

    console.log('🔄 Webhook revalidation triggered:', { type, paths });

    // Revalidate specific paths
    for (const path of paths) {
      revalidatePath(path);
    }

    // Revalidate common paths for sliders
    if (type === 'sliders') {
      revalidatePath('/');
      revalidatePath('/admin/slider');
      revalidateTag('sliders');
      revalidateTag('homepage');
    }

    console.log('✅ Webhook revalidation completed');

    return NextResponse.json({
      revalidated: true,
      type,
      paths,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Webhook revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
