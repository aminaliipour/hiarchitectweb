import { NextRequest, NextResponse } from 'next/server';
import { connectDB, SliderImage } from '@/lib/database';
import { getTokenFromRequest, verifyToken } from '../../lib/auth';

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

// GET - Get all slider images
export async function GET() {
  try {
    await connectDB();

    const slides = await SliderImage.find()
      .sort({ sort_order: 1, created_at: -1 })
      .lean();

    const formattedSlides = slides.map((slide: any) => ({
      id: slide._id.toString(),
      title: slide.title,
      description: slide.description,
      image_url: slide.image_url,
      link_url: slide.link_url,
      is_active: slide.is_active,
      sort_order: slide.sort_order,
      created_at: slide.created_at,
      updated_at: slide.updated_at
    }));

    return NextResponse.json({
      slides: formattedSlides
    });
  } catch (error) {
    console.error('Get slider images error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت تصاویر اسلایدر' },
      { status: 500 }
    );
  }
}

// POST - Create new slider image
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await checkAuth(request);

    const { title, description, image_url, link_url, is_active, sort_order } = await request.json();

    if (!image_url) {
      return NextResponse.json(
        { error: 'آدرس تصویر الزامی است' },
        { status: 400 }
      );
    }

    const newSlide = await SliderImage.create({
      title: title || null,
      description: description || null,
      image_url,
      link_url: link_url || null,
      is_active: is_active !== undefined ? is_active : true,
      sort_order: sort_order || 0
    });

    return NextResponse.json({
      message: 'تصویر اسلایدر با موفقیت اضافه شد',
      slide: {
        id: newSlide._id.toString(),
        ...newSlide.toObject()
      }
    });
  } catch (error) {
    console.error('Create slider image error:', error);
    if (error instanceof Error && error.message.includes('احراز هویت')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'خطا در اضافه کردن تصویر اسلایدر' },
      { status: 500 }
    );
  }
}
