import { NextRequest, NextResponse } from 'next/server';
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

// POST - Upload image (Unlimited size and type)
export async function POST(request: NextRequest) {
  try {
    await checkAuth(request);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'فایل الزامی است' },
        { status: 400 }
      );
    }

    console.log(`📁 Uploading file: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`);

    // No restrictions on file type or size - user can upload anything

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'unknown';
    const filename = `${timestamp}-${randomString}.${extension}`;

    try {
      // Convert file to buffer with better error handling
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      console.log(`💾 File converted to buffer: ${buffer.length} bytes`);

      // Save to public directory
      const fs = require('fs');
      const path = require('path');
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`📁 Created directory: ${uploadDir}`);
      }
      
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      
      console.log(`✅ File saved successfully: ${filePath}`);

      // Return the public URL
      const publicUrl = `/uploads/${folder}/${filename}`;

      return NextResponse.json({
        message: 'فایل با موفقیت آپلود شد',
        url: publicUrl,
        filename: filename,
        size: file.size,
        type: file.type
      });
    } catch (uploadError) {
      console.error('❌ File upload error:', uploadError);
      return NextResponse.json(
        { 
          error: 'خطا در آپلود فایل', 
          details: uploadError instanceof Error ? uploadError.message : 'نامشخص'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Upload API error:', error);
    if (error instanceof Error && error.message.includes('احراز هویت')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { 
        error: 'خطای سرور',
        details: error instanceof Error ? error.message : 'نامشخص'
      },
      { status: 500 }
    );
  }
}
