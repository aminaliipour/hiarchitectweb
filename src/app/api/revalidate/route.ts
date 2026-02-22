import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const path = searchParams.get('path');
    const tag = searchParams.get('tag');

    // Verify secret token for security (optional but recommended)
    if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Revalidate specific path
    if (path) {
      revalidatePath(path);
      console.log(`✅ Revalidated path: ${path}`);
    }

    // Revalidate specific tag
    if (tag) {
      revalidateTag(tag);
      console.log(`✅ Revalidated tag: ${tag}`);
    }

    // Default revalidations
    revalidatePath('/');
    revalidatePath('/admin/slider');
    revalidatePath('/admin/projects/images');
    revalidateTag('sliders');
    revalidateTag('homepage');
    revalidateTag('projects');
    revalidateTag('images');
    
    console.log('✅ Cache revalidated successfully');
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: 'Cache successfully revalidated'
    });
    
  } catch (err) {
    console.error('❌ Error revalidating cache:', err);
    return NextResponse.json(
      { error: 'Error revalidating cache' },
      { status: 500 }
    );
  }
}
