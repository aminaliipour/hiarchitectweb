import { NextRequest, NextResponse } from 'next/server';

// POST - Upload image for admin panel (Unlimited size and type)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'journey';

    if (!file) {
      return NextResponse.json(
        { 
          success: false,
          error: 'فایل الزامی است' 
        },
        { status: 400 }
      );
    }

    console.log(`📁 Admin uploading file: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`);

    // No restrictions on file type or size - unlimited uploads

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop() || 'unknown';
      const filename = `${timestamp}-${randomString}.${extension}`;

      // Convert file to buffer with better error handling
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      console.log(`💾 File converted to buffer: ${buffer.length} bytes`);

      // Save to the public directory
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
        success: true,
        message: 'فایل با موفقیت آپلود شد',
        url: publicUrl,
        filename: filename,
        size: file.size,
        type: file.type
      }, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      });

    } catch (uploadError) {
      console.error('❌ File upload error:', uploadError);
      return NextResponse.json(
        { 
          success: false,
          error: 'خطا در ذخیره فایل',
          details: uploadError instanceof Error ? uploadError.message : 'نامشخص'
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      );
    }

  } catch (error) {
    console.error('❌ Upload API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'خطای سرور',
        details: error instanceof Error ? error.message : 'نامشخص'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    );
  }
}
