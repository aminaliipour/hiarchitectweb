import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    // Await params for Next.js 15+
    const { slug } = await params;

    // Extract the file path from params
    const filePath = slug.join('/');

    // Construct the full path to the file
    const fullPath = path.join(process.cwd(), 'public', 'images', 'projects', filePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${fullPath}`);
      return new NextResponse('File not found', { status: 404 });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(fullPath);

    // Get file extension to determine content type
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'application/octet-stream';

    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }

    // Return the file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'Last-Modified': new Date().toUTCString(),
        'ETag': `"${Date.now()}"`,
        'Vary': '*'
      }
    });

  } catch (error) {
    console.error('Error serving project image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
