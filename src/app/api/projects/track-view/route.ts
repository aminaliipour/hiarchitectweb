import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Project } from '@/lib/database';

// POST - Increment view count for a project
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'slug الزامی است' },
        { status: 400 }
      );
    }

    // Find project and increment view count
    const project = await Project.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { view_count: 1 } },
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { error: 'پروژه یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      view_count: project.view_count || 0
    });
  } catch (error) {
    console.error('Error tracking project view:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت بازدید' },
      { status: 500 }
    );
  }
}
