import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';
import { writeFile, readFile } from 'fs/promises';
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

// PUT - Update slider metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Skip auth check for development
    // await checkAuth(request);

    const { id } = await params;
    const sliderId = parseInt(id);
    const { title, subtitle, location, architect, category, order, cropData } = await request.json();

    console.log('📝 Update data received:', { title, subtitle, location, architect, category, order, cropData });

    if (!title) {
      return NextResponse.json(
        { error: 'عنوان الزامی است' },
        { status: 400 }
      );
    }

    const slidersDir = path.join(process.cwd(), 'public', 'images', 'slides');
    
    if (!existsSync(slidersDir)) {
      return NextResponse.json(
        { error: 'پوشه اسلایدرها یافت نشد' },
        { status: 404 }
      );
    }

    // Get all sliders to find the right one
    const { readdir } = require('fs/promises');
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

    const targetFile = imageFiles[sliderId - 1];
    const metadataFilename = targetFile.replace(/\.[^/.]+$/, '.json');
    const metadataPath = path.join(slidersDir, metadataFilename);

    // Read existing metadata or create new
    let existingMetadata = {
      filename: targetFile,
      title: targetFile.replace(/\.[^/.]+$/, ''),
      subtitle: null,
      location: null,
      architect: null,
      category: null,
      order: 1,
      uploadedAt: new Date().toISOString()
    };

    if (existsSync(metadataPath)) {
      try {
        const metadataContent = await readFile(metadataPath, 'utf-8');
        existingMetadata = JSON.parse(metadataContent);
      } catch (error) {
        console.log('Failed to read existing metadata:', error);
      }
    }

    // Handle order rebalancing
    const newOrder = order || existingMetadata.order || 1;
    const oldOrder = existingMetadata.order || 1;
    
    console.log(`🔄 Order change: ${oldOrder} -> ${newOrder} for file: ${targetFile}`);
    
    // If order is changing, we need to rebalance other sliders' orders
    if (newOrder !== oldOrder) {
      // Get all metadata files to rebalance orders
      for (const file of imageFiles) {
        if (file === targetFile) continue; // Skip current file
        
        const metaFilename = file.replace(/\.[^/.]+$/, '.json');
        const metaPath = path.join(slidersDir, metaFilename);
        
        if (existsSync(metaPath)) {
          try {
            const metaContent = await readFile(metaPath, 'utf-8');
            const metadata = JSON.parse(metaContent);
            const currentOrder = metadata.order || 1;
            
            let adjustedOrder = currentOrder;
            
            // If moving to a lower position (smaller order number)
            if (newOrder < oldOrder) {
              // Shift down items that are in the range [newOrder, oldOrder)
              if (currentOrder >= newOrder && currentOrder < oldOrder) {
                adjustedOrder = currentOrder + 1;
              }
            }
            // If moving to a higher position (larger order number)  
            else if (newOrder > oldOrder) {
              // Shift up items that are in the range (oldOrder, newOrder]
              if (currentOrder > oldOrder && currentOrder <= newOrder) {
                adjustedOrder = currentOrder - 1;
              }
            }
            
            if (adjustedOrder !== currentOrder) {
              console.log(`📝 Updating ${file} order: ${currentOrder} -> ${adjustedOrder}`);
              metadata.order = adjustedOrder;
              metadata.updatedAt = new Date().toISOString();
              await writeFile(metaPath, JSON.stringify(metadata, null, 2));
            }
          } catch (error) {
            console.log(`⚠️ Failed to update order for ${file}:`, error);
          }
        }
      }
    }

    // Update metadata for current slider
    const updatedMetadata = {
      ...existingMetadata,
      title,
      subtitle: subtitle || null,
      location: location || null,
      architect: architect || null,
      category: category || null,
      order: newOrder,
      cropData: cropData || null,
      updatedAt: new Date().toISOString()
    };

    // Save updated metadata
    await writeFile(metadataPath, JSON.stringify(updatedMetadata, null, 2));

    return NextResponse.json({
      success: true,
      message: 'اسلاید با موفقیت بروزرسانی شد',
      slider: {
        id: sliderId,
        filename: targetFile,
        title,
        subtitle,
        location,
        architect,
        category,
        url: `/images/slides/${encodeURIComponent(targetFile)}`
      }
    });

  } catch (error) {
    console.error('Error updating slider:', error);
    
    if (error instanceof Error && error.message.includes('احراز هویت')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'خطا در بروزرسانی اسلاید' },
      { status: 500 }
    );
  }
}

// DELETE - Delete slider
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Skip auth check for development
    // await checkAuth(request);

    const { id } = await params;
    const sliderId = parseInt(id);

    console.log('🗑️ DELETE request for slider ID:', sliderId);

    const slidersDir = path.join(process.cwd(), 'public', 'images', 'slides');
    
    if (!existsSync(slidersDir)) {
      return NextResponse.json(
        { error: 'پوشه اسلایدرها یافت نشد' },
        { status: 404 }
      );
    }

    // Find slider files by ID (we use order as ID in our simple implementation)
    const fs = require('fs');
    const files = fs.readdirSync(slidersDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
    let deletedFiles = [];
    let found = false;

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const isImage = imageExtensions.includes(ext);
      
      if (isImage) {
        // Try to read metadata to check order/id
        const metadataFilename = file.replace(/\.[^/.]+$/, '.json');
        const metadataPath = path.join(slidersDir, metadataFilename);
        
        if (existsSync(metadataPath)) {
          try {
            const metadataContent = await readFile(metadataPath, 'utf8');
            const metadata = JSON.parse(metadataContent);
            
            // For now, we'll use the order field as ID
            if (metadata.order === sliderId) {
              // Delete image file
              const imagePath = path.join(slidersDir, file);
              fs.unlinkSync(imagePath);
              deletedFiles.push(file);
              
              // Delete metadata file
              fs.unlinkSync(metadataPath);
              deletedFiles.push(metadataFilename);
              
              found = true;
              console.log('✅ Deleted slider files:', deletedFiles);
              break;
            }
          } catch (parseError) {
            console.error('Error parsing metadata:', parseError);
          }
        }
      }
    }

    if (!found) {
      return NextResponse.json(
        { error: 'اسلایدر یافت نشد' },
        { status: 404 }
      );
    }

    // Trigger cache revalidation
    try {
      const revalidateResponse = await fetch(new URL('/api/revalidate', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (revalidateResponse.ok) {
        console.log('✅ Cache revalidated after deletion');
      }
    } catch (revalidateError) {
      console.log('⚠️ Cache revalidation error:', revalidateError);
    }

    return NextResponse.json({
      success: true,
      message: 'اسلایدر با موفقیت حذف شد',
      deletedFiles: deletedFiles
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
