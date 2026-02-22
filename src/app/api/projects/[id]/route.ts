import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';
import { connectDB, Project, ProjectImage } from '@/lib/database';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Helper function to check authentication
async function checkAuth(request: NextRequest) {
  console.log('🔍 Authentication check started');

  const token = getTokenFromRequest(request);
  console.log('Token found:', token ? 'YES' : 'NO');

  if (!token) {
    console.log('❌ No token found');
    throw new Error('احراز هویت نشده');
  }

  const payload = verifyToken(token);
  console.log('Token verification result:', payload ? 'VALID' : 'INVALID');

  if (!payload) {
    console.log('❌ Invalid token');
    throw new Error('توکن نامعتبر');
  }

  console.log('✅ Authentication successful');
  return payload;
}

// PUT - Update project
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  console.log('🔥 PUT API Called - Project Update');
  console.log('Request URL:', request.url);

  const { id } = await context.params;
  console.log('Project ID from params:', id);

  // Check if this is a valid MongoDB ObjectId
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;

  console.log('Is valid MongoDB ObjectId:', isValidObjectId);

  if (!isValidObjectId) {
    console.log('❌ Not a valid ObjectId, returning 404');
    return NextResponse.json(
      { error: 'Invalid project ID format' },
      { status: 404 }
    );
  }

  try {
    await connectDB();

    // Check authentication
    console.log('🔐 Checking authentication...');
    await checkAuth(request);
    console.log('✅ Authentication passed');

    const projectId = id;
    const body = await request.json();
    const { title, description, category_id, area, year, location, latitude, longitude, status, main_image } = body;

    console.log('=== Update Project Debug ===');
    console.log('Project ID:', projectId);
    console.log('Request Body:', body);
    console.log('Extracted fields:', { title, description, category_id, area, year, location, latitude, longitude, status, main_image });

    // Validate required fields
    if (!title || !category_id) {
      console.log('❌ Validation failed - Missing required fields:', {
        title: title || 'MISSING',
        category_id: category_id || 'MISSING'
      });
      return NextResponse.json(
        { error: 'عنوان و دسته‌بندی الزامی است' },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId for category ID
    if (!mongoose.Types.ObjectId.isValid(category_id)) {
      console.log('❌ Invalid category ID format:', category_id);
      return NextResponse.json(
        { error: 'شناسه دسته‌بندی نامعتبر است' },
        { status: 400 }
      );
    }

    console.log('✅ All validations passed');

    // Build update object
    const updateData: any = {
      title,
      description: description || null,
      category_id,
      area: area || null,
      year: year || null,
      location: location || null,
      latitude: latitude || null,
      longitude: longitude || null,
      status: status || 'published',
      main_image: main_image || null,
      updated_at: new Date()
    };

    console.log('🔄 Executing update with data:', updateData);

    const result = await Project.findByIdAndUpdate(
      projectId,
      { $set: updateData },
      { new: true }
    ).lean();

    console.log('📊 Query result:', result);

    if (!result) {
      console.log('❌ No project found with ID:', projectId);
      return NextResponse.json(
        { error: 'پروژه یافت نشد' },
        { status: 404 }
      );
    }

    console.log('✅ Project updated successfully');
    return NextResponse.json({
      success: true,
      message: 'پروژه با موفقیت بروزرسانی شد',
      project: {
        id: result._id.toString(),
        ...result
      }
    });

  } catch (error) {
    console.error('❌ Update project error:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      return NextResponse.json(
        {
          error: 'خطا در بروزرسانی پروژه',
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'خطا در بروزرسانی پروژه' },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await checkAuth(request);

    const { id: projectId } = await context.params;

    // Get project info first
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { error: 'پروژه یافت نشد' },
        { status: 404 }
      );
    }

    // Delete project images folder
    const safeProjectFolder = project.slug.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
    const projectDir = path.join(process.cwd(), 'public', 'images', 'projects', safeProjectFolder);

    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }

    // Delete from database
    await Project.findByIdAndDelete(projectId);

    // Delete related images
    await ProjectImage.deleteMany({ project_id: projectId });

    return NextResponse.json({
      success: true,
      message: 'پروژه با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'خطا در حذف پروژه' },
      { status: 500 }
    );
  }
}
