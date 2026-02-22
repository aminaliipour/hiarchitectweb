import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params in Next.js 15
    const { path: pathSegments } = await params;

    // Build the file path from URL segments
    const urlPath = pathSegments.join('/');

    // Construct full file system path
    const fullPath = path.join(process.cwd(), 'public', 'images', 'projects', urlPath);

    console.log(`Serving image: ${fullPath}`);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`Image not found: ${fullPath}`);
      return new NextResponse('Image not found', { status: 404 });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(fullPath);

    // Get file extension and set content type
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'image/jpeg'; // default

    switch (ext) {
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
      case '.jpg':
      case '.jpeg':
      default:
        contentType = 'image/jpeg';
        break;
    }

    // Return image with no-cache headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Content-Length': fileBuffer.length.toString(),
      }
    });

  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
