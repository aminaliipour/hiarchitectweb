import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../lib/auth';
import { writeFile, readdir, unlink, readFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
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

// GET - Get all sliders
export async function GET() {
  try {
    console.log('🔍 Getting sliders...');
    const slidersDir = path.join(process.cwd(), 'public', 'images', 'slides');
    console.log('📁 Sliders directory:', slidersDir);
    
    if (!existsSync(slidersDir)) {
      console.log('❌ Sliders directory does not exist');
      return NextResponse.json({ sliders: [] });
    }

    const files = await readdir(slidersDir);
    console.log('📂 Files found:', files);
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
    const sliders = [];
    
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const ext = path.extname(file).toLowerCase();
      const isImage = imageExtensions.includes(ext);
      
      console.log(`🖼️ File: ${file}, Extension: ${ext}, Is Image: ${isImage}`);
      
      if (isImage) {
        // Try to read metadata
        const metadataFilename = file.replace(/\.[^/.]+$/, '.json');
        const metadataPath = path.join(slidersDir, metadataFilename);
        
        let metadata = {
          title: decodeURIComponent(file.replace(/\.[^/.]+$/, '')),
          subtitle: null,
          location: null,
          architect: null,
          category: null,
          order: index + 1,
          cropData: null,
          project_link: null
        };
        
        if (existsSync(metadataPath)) {
          try {
            const metadataContent = await readFile(metadataPath, 'utf-8');
            const parsedMetadata = JSON.parse(metadataContent);
            metadata = { ...metadata, ...parsedMetadata };
          } catch (error) {
            console.log(`⚠️ Failed to read metadata for ${file}:`, error);
          }
        }
        
        sliders.push({
          id: sliders.length + 1,
          filename: file,
          title: metadata.title,
          subtitle: metadata.subtitle,
          location: metadata.location,
          architect: metadata.architect,
          category: metadata.category,
          url: `/images/slides/${encodeURIComponent(file)}`,
          order: metadata.order,
          cropData: metadata.cropData || null,
          project_link: metadata.project_link || null
        });
      }
    }

    // Sort sliders by order
    sliders.sort((a, b) => a.order - b.order);

    console.log('✅ Processed sliders:', sliders);
    return NextResponse.json({ sliders });
  } catch (error) {
    console.error('❌ Error fetching sliders:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اسلایدرها' },
      { status: 500 }
    );
  }
}

// POST - Upload new slider image or create from project image
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST request received for slider upload');
    
    // Skip auth check for development
    // await checkAuth(request);

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const imageUrl = formData.get('imageUrl') as string;
    const fromProjectImage = formData.get('fromProjectImage') === 'true';
    const originalFilename = formData.get('filename') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const location = formData.get('location') as string;
    const architect = formData.get('architect') as string;
    const category = formData.get('category') as string;
    const order = parseInt(formData.get('order') as string) || 1;
    const project_link = formData.get('project_link') as string;

    console.log('📝 Form data received:', { 
      file: file ? { name: file.name, size: file.size, type: file.type } : null,
      imageUrl,
      fromProjectImage,
      originalFilename,
      title,
      subtitle,
      location,
      architect,
      category,
      order,
      project_link
    });

    if ((!file && !imageUrl) || !title) {
      return NextResponse.json(
        { error: 'تصویر و عنوان الزامی است' },
        { status: 400 }
      );
    }

    // Create slides directory if it doesn't exist
    const slidersDir = path.join(process.cwd(), 'public', 'images', 'slides');
    if (!existsSync(slidersDir)) {
      mkdirSync(slidersDir, { recursive: true });
    }

    let filename: string;
    let filePath: string;

    if (fromProjectImage && imageUrl) {
      // Copy from project image
      console.log('📋 Creating slider from project image:', imageUrl);
      
      // Generate safe filename based on original filename
      const safeTitle = title.replace(/[^a-zA-Z0-9-_\u0600-\u06FF]/g, '').trim();
      const fileExtension = path.extname(originalFilename || imageUrl);
      const timestamp = Date.now();
      filename = `${safeTitle}-${timestamp}-from-project${fileExtension}`;
      filePath = path.join(slidersDir, filename);

      // Read the project image file and copy it
      const projectImagePath = path.join(process.cwd(), 'public', imageUrl);
      
      if (!existsSync(projectImagePath)) {
        return NextResponse.json(
          { error: 'تصویر پروژه یافت نشد' },
          { status: 404 }
        );
      }

      // Copy the project image to slides directory
      const sourceBuffer = await readFile(projectImagePath);
      await writeFile(filePath, sourceBuffer);
      
      console.log('✅ Project image copied to slides directory');
      
    } else if (file) {
      // Upload new file
      console.log('📤 Uploading new file');
      
      // Generate safe filename
      const safeTitle = title.replace(/[^a-zA-Z0-9-_\u0600-\u06FF]/g, '').trim();
      const fileExtension = path.extname(file.name);
      const timestamp = Date.now();
      filename = `${safeTitle}-${timestamp}${fileExtension}`;
      filePath = path.join(slidersDir, filename);

      // Save uploaded file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      
      console.log('✅ New file uploaded');
    } else {
      return NextResponse.json(
        { error: 'نوع عملیات نامشخص' },
        { status: 400 }
      );
    }

    console.log('💾 File saved to:', filePath);

    // Save metadata
    const metadataFilename = filename.replace(/\.[^/.]+$/, '.json');
    const metadataPath = path.join(slidersDir, metadataFilename);
    const metadata = {
      filename,
      title,
      subtitle: subtitle || null,
      location: location || null,
      architect: architect || null,
      category: category || null,
      order: order,
      project_link: project_link || null,
      uploadedAt: new Date().toISOString(),
      source: fromProjectImage ? 'project' : 'upload',
      originalImageUrl: fromProjectImage ? imageUrl : null
    };
    
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    console.log('✅ File and metadata saved successfully');

    // Trigger cache revalidation
    try {
      const revalidateResponse = await fetch(new URL('/api/revalidate', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (revalidateResponse.ok) {
        console.log('✅ Cache revalidated successfully');
      } else {
        console.log('⚠️ Cache revalidation failed, but continuing...');
      }
    } catch (revalidateError) {
      console.log('⚠️ Cache revalidation error:', revalidateError);
      // Continue execution even if revalidation fails
    }

    return NextResponse.json({
      success: true,
      message: fromProjectImage ? 'اسلایدر از تصویر پروژه با موفقیت ایجاد شد' : 'اسلایدر با موفقیت آپلود شد',
      filename: filename,
      url: `/images/slides/${filename}`,
      metadata: metadata
    });

  } catch (error) {
    console.error('Error uploading slider:', error);
    
    if (error instanceof Error && error.message.includes('احراز هویت')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'خطا در آپلود اسلاید' },
      { status: 500 }
    );
  }
}

// DELETE - Delete slider
export async function DELETE(request: NextRequest) {
  try {
    // Skip auth check for development
    // await checkAuth(request);

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'نام فایل الزامی است' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'public', 'images', 'slides', filename);
    
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'فایل یافت نشد' },
        { status: 404 }
      );
    }

    await unlink(filePath);

    // Also try to delete metadata file
    const metadataFilename = filename.replace(/\.[^/.]+$/, '.json');
    const metadataPath = path.join(process.cwd(), 'public', 'images', 'slides', metadataFilename);
    
    if (existsSync(metadataPath)) {
      await unlink(metadataPath);
    }

    // Trigger cache revalidation after deletion
    try {
      const revalidateResponse = await fetch(new URL('/api/revalidate', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (revalidateResponse.ok) {
        console.log('✅ Cache revalidated after deletion');
      }
    } catch (revalidateError) {
      console.log('⚠️ Cache revalidation error after deletion:', revalidateError);
    }

    return NextResponse.json({
      success: true,
      message: 'اسلاید با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Error deleting slider:', error);
    
    if (error instanceof Error && error.message.includes('احراز هویت')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'خطا در حذف اسلاید' },
      { status: 500 }
    );
  }
}
