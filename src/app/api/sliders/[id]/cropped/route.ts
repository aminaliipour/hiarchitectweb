import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sliderId = parseInt(id);

    const slidersDir = path.join(process.cwd(), 'public', 'images', 'slides');
    
    if (!existsSync(slidersDir)) {
      return NextResponse.json(
        { error: 'پوشه اسلایدرها یافت نشد' },
        { status: 404 }
      );
    }

    // Get all sliders to find the right one by order
    const { readdir } = require('fs/promises');
    const files = await readdir(slidersDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
    const imageFiles = files.filter((file: string) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
    
    console.log(`🔍 Found ${imageFiles.length} image files:`, imageFiles);
    console.log(`🎯 Looking for slider with order: ${sliderId}`);

    // Find the file with the matching order in metadata
    let targetFile = null;
    let targetOrder = null;
    
    for (const file of imageFiles) {
      const metadataFilename = file.replace(/\.[^/.]+$/, '.json');
      const metadataPath = path.join(slidersDir, metadataFilename);
      
      if (existsSync(metadataPath)) {
        try {
          const metadataContent = await readFile(metadataPath, 'utf-8');
          const metadata = JSON.parse(metadataContent);
          
          if (metadata.order === sliderId) {
            targetFile = file;
            targetOrder = metadata.order;
            console.log(`✅ Found matching file: ${file} with order: ${metadata.order}`);
            break;
          }
        } catch (error) {
          console.log(`⚠️ Error reading metadata for ${file}:`, error);
        }
      }
    }

    if (!targetFile) {
      return NextResponse.json(
        { error: 'اسلاید با این ترتیب یافت نشد' },
        { status: 404 }
      );
    }

    console.log(`📁 Target file: ${targetFile}`);
    const metadataFilename = targetFile.replace(/\.[^/.]+$/, '.json');
    const metadataPath = path.join(slidersDir, metadataFilename);
    const imagePath = path.join(slidersDir, targetFile);

    // Read metadata to get crop data (we already read it above)
    let cropData = null;
    const metadataContent = await readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent);
    cropData = metadata.cropData;
    console.log('🔍 Crop data found:', cropData);

    // If no crop data, return original image
    if (!cropData) {
      console.log('❌ No crop data found, returning original image');
      const imageBuffer = await readFile(imagePath);
      return new NextResponse(imageBuffer as any, {
        headers: {
          'Content-Type': `image/${path.extname(targetFile).slice(1)}`,
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    // Apply crop using sharp
    console.log('✂️ Crop data structure:', cropData);
    const crop = cropData; // cropData is directly the crop object
    const imageBuffer = await readFile(imagePath);
    
    console.log('📐 Applying crop:', {
      x: Math.round(crop.x),
      y: Math.round(crop.y),
      width: Math.round(crop.width),
      height: Math.round(crop.height)
    });
    
    const croppedBuffer = await sharp(imageBuffer)
      .extract({
        left: Math.round(crop.x),
        top: Math.round(crop.y),
        width: Math.round(crop.width),
        height: Math.round(crop.height),
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    return new NextResponse(croppedBuffer as any, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('Error generating cropped image:', error);
    return NextResponse.json(
      { error: 'خطا در تولید تصویر برش شده' },
      { status: 500 }
    );
  }
}