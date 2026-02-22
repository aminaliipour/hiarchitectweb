import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Project, ProjectCategory, ProjectImage } from '@/lib/database';
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

// GET - Get single project
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await context.params;

    const project = await Project.findOne({ slug })
      .populate('category_id', 'name slug')
      .lean();

    if (!project) {
      return NextResponse.json(
        { error: 'پروژه یافت نشد' },
        { status: 404 }
      );
    }

    // Get project images
    const images = await ProjectImage.find({ project_id: project._id })
      .select('image_url alt_text sort_order')
      .sort({ sort_order: 1 })
      .lean();

    // Format response
    const response = {
      id: project._id.toString(),
      title: project.title,
      slug: project.slug,
      description: project.description,
      main_image: project.main_image,
      is_featured: project.is_featured,
      status: project.status,
      created_at: project.created_at,
      updated_at: project.updated_at,
      category_name: (project.category_id as any)?.name,
      category_slug: (project.category_id as any)?.slug,
      category_id: project.category_id,
      images: images.map((img: any) => ({
        id: img._id.toString(),
        image_url: img.image_url,
        alt_text: img.alt_text,
        sort_order: img.sort_order
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت پروژه' },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await context.params;

    // Check if this is a UUID (should be handled by [id] route)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isUUID = uuidRegex.test(slug);

    if (isUUID) {
      console.log('❌ UUID detected in slug route, redirecting to ID route');
      return NextResponse.json(
        { error: 'Use project ID endpoint for UUID updates' },
        { status: 400 }
      );
    }

    await checkAuth(request);

    const { title, new_slug, description, category_id, main_image, is_featured, status } = await request.json();

    if (!title || !new_slug || !category_id) {
      return NextResponse.json(
        { error: 'عنوان، اسلاگ و دسته‌بندی الزامی است' },
        { status: 400 }
      );
    }

    // Check if new slug already exists (if changed)
    if (new_slug !== slug) {
      const existingProject = await Project.findOne({ slug: new_slug });

      if (existingProject) {
        return NextResponse.json(
          { error: 'اسلاگ تکراری است' },
          { status: 400 }
        );
      }
    }

    const updatedProject = await Project.findOneAndUpdate(
      { slug },
      {
        title,
        slug: new_slug,
        description,
        category_id,
        main_image: main_image || null,
        is_featured: is_featured || false,
        status: status || 'draft',
        updated_at: new Date()
      },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json(
        { error: 'پروژه یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'پروژه با موفقیت به‌روزرسانی شد',
      project: {
        id: updatedProject._id.toString(),
        ...updatedProject.toObject()
      }
    });
  } catch (error) {
    console.error('Update project error:', error);
    if (error instanceof Error && error.message.includes('احراز هویت')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی پروژه' },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    await checkAuth(request);
    const { slug } = await context.params;

    // Delete project (also delete related images)
    const project = await Project.findOneAndDelete({ slug });

    if (!project) {
      return NextResponse.json(
        { error: 'پروژه یافت نشد' },
        { status: 404 }
      );
    }

    // Delete related images
    await ProjectImage.deleteMany({ project_id: project._id });

    return NextResponse.json({
      message: 'پروژه با موفقیت حذف شد'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    if (error instanceof Error && error.message.includes('احراز هویت')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'خطا در حذف پروژه' },
      { status: 500 }
    );
  }
}
