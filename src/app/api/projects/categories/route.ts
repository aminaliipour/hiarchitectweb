import { NextRequest, NextResponse } from 'next/server';
import { connectDB, ProjectCategory, Project } from '@/lib/database';
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

// GET - Get all categories (public access for form dropdowns)
export async function GET() {
  try {
    await connectDB();

    const categories = await ProjectCategory.find()
      .sort({ name: 1 })
      .lean();

    // Get project counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category: any) => {
        const projectCount = await Project.countDocuments({ category_id: category._id });
        return {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
          description: category.description,
          created_at: category.created_at,
          updated_at: category.updated_at,
          project_count: projectCount
        };
      })
    );

    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت دسته‌بندی‌ها: ' + (error instanceof Error ? error.message : 'نامشخص') },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await checkAuth(request);

    const { name, slug, description } = await request.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'نام و اسلاگ الزامی است' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await ProjectCategory.findOne({ slug });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'اسلاگ تکراری است' },
        { status: 400 }
      );
    }

    const newCategory = await ProjectCategory.create({
      name,
      slug,
      description
    });

    return NextResponse.json({
      success: true,
      message: 'دسته‌بندی با موفقیت ایجاد شد',
      category: {
        id: newCategory._id.toString(),
        ...newCategory.toObject()
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    if (error instanceof Error && error.message.includes('احراز هویت')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'خطا در ایجاد دسته‌بندی' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    await checkAuth(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'شناسه دسته‌بندی الزامی است' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await ProjectCategory.findById(id);
    if (!category) {
      return NextResponse.json(
        { error: 'دسته‌بندی یافت نشد' },
        { status: 404 }
      );
    }

    // Check if category has projects
    const projectCount = await Project.countDocuments({ category_id: id });
    if (projectCount > 0) {
      return NextResponse.json(
        { error: `این دسته‌بندی دارای ${projectCount} پروژه است. ابتدا پروژه‌ها را حذف کنید.` },
        { status: 400 }
      );
    }

    // Delete category
    await ProjectCategory.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'دسته‌بندی با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    if (error instanceof Error && error.message.includes('احراز هویت')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'خطا در حذف دسته‌بندی' },
      { status: 500 }
    );
  }
}
