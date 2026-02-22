import { NextRequest, NextResponse } from 'next/server';
import { connectDB, SliderImage } from '@/lib/database';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';
import mongoose from 'mongoose';

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

// GET - Get single slider image
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id) || id.length !== 24) {
      return NextResponse.json(
        { error: 'شناسه نامعتبر است' },
        { status: 400 }
      );
    }

    const slide = await SliderImage.findById(id).lean();

    if (!slide) {
      return NextResponse.json(
        { error: 'تصویر اسلایدر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: slide._id.toString(),
      ...slide
    });
  } catch (error) {
    console.error('Get slider image error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت تصویر اسلایدر' },
      { status: 500 }
    );
  }
}

// PUT - Update slider image
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await checkAuth(request);
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id) || id.length !== 24) {
      return NextResponse.json(
        { error: 'شناسه نامعتبر است' },
        { status: 400 }
      );
    }

    const { title, description, image_url, link_url, is_active, sort_order } = await request.json();

    if (!image_url) {
      return NextResponse.json(
        { error: 'آدرس تصویر الزامی است' },
        { status: 400 }
      );
    }

    const updatedSlide = await SliderImage.findByIdAndUpdate(
      id,
      {
        title: title || null,
        description: description || null,
        image_url,
        link_url: link_url || null,
        is_active: is_active !== undefined ? is_active : true,
        sort_order: sort_order || 0,
        updated_at: new Date()
      },
      { new: true }
    );

    if (!updatedSlide) {
      return NextResponse.json(
        { error: 'تصویر اسلایدر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'تصویر اسلایدر با موفقیت به‌روزرسانی شد',
      slide: {
        id: updatedSlide._id.toString(),
        ...updatedSlide.toObject()
      }
    });
  } catch (error) {
    console.error('Update slider image error:', error);
    if (error instanceof Error && error.message.includes('احراز هویت')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی تصویر اسلایدر' },
      { status: 500 }
    );
  }
}

// DELETE - Delete slider image
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await checkAuth(request);
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id) || id.length !== 24) {
      return NextResponse.json(
        { error: 'شناسه نامعتبر است' },
        { status: 400 }
      );
    }

    const deletedSlide = await SliderImage.findByIdAndDelete(id);

    if (!deletedSlide) {
      return NextResponse.json(
        { error: 'تصویر اسلایدر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'تصویر اسلایدر با موفقیت حذف شد'
    });
  } catch (error) {
    console.error('Delete slider image error:', error);
    if (error instanceof Error && error.message.includes('احراز هویت')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'خطا در حذف تصویر اسلایدر' },
      { status: 500 }
    );
  }
}
