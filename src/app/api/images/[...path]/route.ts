import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = params.path.join('/');
    const fullPath = path.join(process.cwd(), 'public', 'images', imagePath);
    
    // Security check: ensure the path is within the public/images directory
    const normalizedPath = path.normalize(fullPath);
    const publicImagesDir = path.normalize(path.join(process.cwd(), 'public', 'images'));
    
    if (!normalizedPath.startsWith(publicImagesDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if file exists
    if (!fs.existsSync(normalizedPath)) {
      console.log(`Image not found: ${normalizedPath}`);
      return new NextResponse('Image not found', { status: 404 });
    }

    // Get file stats
    const stat = fs.statSync(normalizedPath);
    if (!stat.isFile()) {
      return new NextResponse('Not a file', { status: 404 });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(normalizedPath);
    
    // Determine content type based on file extension
    const ext = path.extname(normalizedPath).toLowerCase();
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

    // Return the image with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Last-Modified': stat.mtime.toUTCString(),
        'ETag': `"${stat.mtime.getTime()}-${stat.size}"`,
      },
    });

  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
