import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../../lib/auth';
import { writeFile, readFile, readdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

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

// POST - Update slider image
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🚀 POST request received for slider image update');
    
    // Skip auth check for development
    // await checkAuth(request);

    const sliderId = parseInt(params.id);
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const location = formData.get('location') as string;
    const architect = formData.get('architect') as string;
    const category = formData.get('category') as string;
    const order = parseInt(formData.get('order') as string) || 1;

    console.log('📝 Form data received:', { 
      sliderId,
      file: file ? { name: file.name, size: file.size, type: file.type } : null, 
      title,
      subtitle,
      location,
      architect,
      category,
      order
    });

    if (!file || !title) {
      return NextResponse.json(
        { error: 'تصویر و عنوان الزامی است' },
        { status: 400 }
      );
    }

    // No file type or size validation - user can upload any file type and size they want

    const slidersDir = path.join(process.cwd(), 'public', 'images', 'slides');
    
    if (!existsSync(slidersDir)) {
      return NextResponse.json(
        { error: 'پوشه اسلایدرها یافت نشد' },
        { status: 404 }
      );
    }

    // Get all files to find the current slider
    const files = await readdir(slidersDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
    const imageFiles = files.filter((file: string) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    if (sliderId <= 0 || sliderId > imageFiles.length) {
      return NextResponse.json(
        { error: 'اسلاید یافت نشد' },
        { status: 404 }
      );
    }

    const oldFileName = imageFiles[sliderId - 1];
    const oldFilePath = path.join(slidersDir, oldFileName);
    const oldMetadataFilename = oldFileName.replace(/\.[^/.]+$/, '.json');
    const oldMetadataPath = path.join(slidersDir, oldMetadataFilename);

    console.log('🗂️ Old file info:', { oldFileName, oldFilePath, oldMetadataPath });

    // Generate new filename
    const safeTitle = title.replace(/[^a-zA-Z0-9-_\u0600-\u06FF]/g, '').trim();
    const fileExtension = path.extname(file.name);
    const timestamp = Date.now();
    const newFileName = `${safeTitle}-${timestamp}${fileExtension}`;
    const newFilePath = path.join(slidersDir, newFileName);

    console.log('💾 New file info:', { newFileName, newFilePath });

    // Save new file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(newFilePath, buffer);

    // Save new metadata
    const newMetadataFilename = newFileName.replace(/\.[^/.]+$/, '.json');
    const newMetadataPath = path.join(slidersDir, newMetadataFilename);
    const metadata = {
      filename: newFileName,
      title,
      subtitle: subtitle || null,
      location: location || null,
      architect: architect || null,
      category: category || null,
      order: order,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await writeFile(newMetadataPath, JSON.stringify(metadata, null, 2));

    // Delete old files
    try {
      if (existsSync(oldFilePath)) {
        await unlink(oldFilePath);
        console.log('🗑️ Deleted old image file:', oldFileName);
      }
      if (existsSync(oldMetadataPath)) {
        await unlink(oldMetadataPath);
        console.log('🗑️ Deleted old metadata file:', oldMetadataFilename);
      }
    } catch (deleteError) {
      console.error('⚠️ Error deleting old files:', deleteError);
      // Don't fail the request if old files can't be deleted
    }

    console.log('✅ Slider image updated successfully');

    return NextResponse.json({
      success: true,
      message: 'تصویر اسلاید با موفقیت بروزرسانی شد',
      slider: {
        id: sliderId,
        filename: newFileName,
        title,
        subtitle,
        location,
        architect,
        category,
        order,
        url: `/images/slides/${newFileName}`
      }
    });

  } catch (error) {
    console.error('Error updating slider image:', error);
    
    if (error instanceof Error && error.message.includes('احراز هویت')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'خطا در بروزرسانی تصویر اسلاید' },
      { status: 500 }
    );
  }
}
