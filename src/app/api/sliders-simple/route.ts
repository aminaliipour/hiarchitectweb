import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readdir, unlink, readFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// معرفی اینترفیس برای اسلایدر
interface SliderMetadata {
  id: string;
  title: string;
  projectSlug?: string; // slug پروژه (اختیاری)
  order: number;
  created: string;
}

const slidersDir = path.join(process.cwd(), 'public', 'images', 'slides');
const metadataFile = path.join(slidersDir, 'metadata.json');

// خواندن متادیتا
async function readMetadata(): Promise<SliderMetadata[]> {
  if (!existsSync(metadataFile)) {
    return [];
  }
  try {
    const data = await readFile(metadataFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// نوشتن متادیتا
async function writeMetadata(data: SliderMetadata[]): Promise<void> {
  if (!existsSync(slidersDir)) {
    mkdirSync(slidersDir, { recursive: true });
  }
  await writeFile(metadataFile, JSON.stringify(data, null, 2), 'utf-8');
}

// GET - دریافت همه اسلایدرها
export async function GET() {
  try {
    const metadata = await readMetadata();
    
    // مرتب‌سازی بر اساس order
    const sliders = metadata
      .map(item => {
        // پیدا کردن فایل تصویر (چک همه پسوندها)
        const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        let imageUrl = `/images/slides/${item.id}.jpg`; // default
        
        for (const ext of extensions) {
          const imagePath = path.join(slidersDir, `${item.id}${ext}`);
          if (existsSync(imagePath)) {
            imageUrl = `/images/slides/${item.id}${ext}`;
            break;
          }
        }
        
        return {
          ...item,
          imageUrl
        };
      })
      .sort((a, b) => a.order - b.order);
    
    return NextResponse.json({ sliders });
  } catch (error) {
    console.error('خطا در دریافت اسلایدرها:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اسلایدرها' },
      { status: 500 }
    );
  }
}

// POST - آپلود اسلایدر جدید
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const title = formData.get('title') as string;
    const projectSlug = formData.get('projectSlug') as string | null;
    
    if (!image || !title) {
      return NextResponse.json(
        { error: 'تصویر و عنوان الزامی است' },
        { status: 400 }
      );
    }

    // ساخت دایرکتوری در صورت نیاز
    if (!existsSync(slidersDir)) {
      mkdirSync(slidersDir, { recursive: true });
    }

    // خواندن متادیتای موجود
    const metadata = await readMetadata();
    
    // ساخت ID یکتا
    const id = randomUUID();
    
    // ذخیره تصویر
    const imageExtension = path.extname(image.name);
    const imagePath = path.join(slidersDir, `${id}${imageExtension}`);
    const bytes = await image.arrayBuffer();
    await writeFile(imagePath, Buffer.from(bytes));
    
    // افزودن به متادیتا
    const newSlider: SliderMetadata = {
      id,
      title,
      projectSlug: projectSlug || undefined,
      order: metadata.length + 1,
      created: new Date().toISOString()
    };
    
    metadata.push(newSlider);
    await writeMetadata(metadata);
    
    return NextResponse.json({ 
      success: true,
      slider: {
        ...newSlider,
        imageUrl: `/images/slides/${id}${imageExtension}`
      }
    });
  } catch (error) {
    console.error('خطا در آپلود اسلایدر:', error);
    return NextResponse.json(
      { error: 'خطا در آپلود اسلایدر' },
      { status: 500 }
    );
  }
}

// DELETE - حذف اسلایدر
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'شناسه الزامی است' },
        { status: 400 }
      );
    }

    // خواندن متادیتا
    const metadata = await readMetadata();
    const sliderIndex = metadata.findIndex(s => s.id === id);
    
    if (sliderIndex === -1) {
      return NextResponse.json(
        { error: 'اسلایدر یافت نشد' },
        { status: 404 }
      );
    }

    // حذف فایل تصویر (تمام پسوندهای ممکن را چک کن)
    const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    for (const ext of extensions) {
      const imagePath = path.join(slidersDir, `${id}${ext}`);
      if (existsSync(imagePath)) {
        await unlink(imagePath);
        break;
      }
    }

    // حذف از متادیتا
    metadata.splice(sliderIndex, 1);
    
    // به‌روزرسانی شماره order
    metadata.forEach((slider, index) => {
      slider.order = index + 1;
    });
    
    await writeMetadata(metadata);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('خطا در حذف اسلایدر:', error);
    return NextResponse.json(
      { error: 'خطا در حذف اسلایدر' },
      { status: 500 }
    );
  }
}

// PUT - به‌روزرسانی ترتیب اسلایدرها
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sliders } = body;
    
    if (!Array.isArray(sliders)) {
      return NextResponse.json(
        { error: 'داده نامعتبر' },
        { status: 400 }
      );
    }

    await writeMetadata(sliders);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('خطا در به‌روزرسانی:', error);
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی' },
      { status: 500 }
    );
  }
}
