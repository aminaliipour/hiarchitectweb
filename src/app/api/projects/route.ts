import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Project, ProjectCategory, ProjectImage } from '@/lib/database';
import { getTokenFromRequest, verifyToken } from '../../lib/auth';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

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

// GET - Get all projects or specific project
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    // If requesting specific project by ID or slug
    if (id || slug) {
      const query = id
        ? { _id: id }
        : { slug: slug };

      const project = await Project.findOne(query)
        .populate('category_id', 'name slug')
        .lean();

      if (!project) {
        return NextResponse.json({
          projects: [],
          total: 0
        });
      }

      // Get image count
      const imageCount = await ProjectImage.countDocuments({ project_id: project._id });

      // Format response
      const formattedProject = {
        id: project._id.toString(),
        title: project.title,
        slug: project.slug,
        description: project.description,
        main_image: project.main_image,
        is_featured: project.is_featured,
        status: project.status,
        area: project.area,
        year: project.year,
        location: project.location,
        latitude: project.latitude,
        longitude: project.longitude,
        category_id: project.category_id ? (project.category_id as any)._id.toString() : null,
        category_name: (project.category_id as any)?.name,
        category_slug: (project.category_id as any)?.slug,
        image_count: imageCount,
        created_at: project.created_at,
        updated_at: project.updated_at
      };

      return NextResponse.json({
        projects: [formattedProject],
        total: 1
      });
    }

    // Build query for listing projects
    const query: any = {};

    if (category) {
      const cat = await ProjectCategory.findOne({ slug: category });
      if (cat) {
        query.category_id = cat._id;
      }
    }

    if (status) {
      query.status = status;
    }

    // Get projects with pagination
    const projects = await Project.find(query)
      .populate('category_id', 'name slug')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Project.countDocuments(query);

    // Get image counts for each project
    const formattedProjects = await Promise.all(
      projects.map(async (project: any) => {
        const imageCount = await ProjectImage.countDocuments({ project_id: project._id });
        return {
          id: project._id.toString(),
          title: project.title,
          slug: project.slug,
          description: project.description,
          main_image: project.main_image,
          is_featured: project.is_featured,
          status: project.status,
          area: project.area,
          year: project.year,
          location: project.location,
          latitude: project.latitude,
          longitude: project.longitude,
          category_name: project.category_id?.name,
          category_slug: project.category_id?.slug,
          image_count: imageCount,
          created_at: project.created_at,
          updated_at: project.updated_at
        };
      })
    );

    return NextResponse.json({
      projects: formattedProjects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت پروژه‌ها' },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await checkAuth(request);

    // Handle FormData instead of JSON
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const category_id = formData.get('category_id') as string;
    const area = formData.get('area') as string;
    const year = formData.get('year') as string;
    const location = formData.get('location') as string;
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;

    // Get images
    const images = formData.getAll('images') as File[];

    if (!title || !slug || !category_id) {
      return NextResponse.json(
        { error: 'عنوان، اسلاگ و دسته‌بندی الزامی است' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProject = await Project.findOne({ slug });

    if (existingProject) {
      return NextResponse.json(
        { error: 'اسلاگ تکراری است' },
        { status: 400 }
      );
    }

    // Get category ObjectId from slug or use directly if it's already ObjectId
    let categoryObjectId: mongoose.Types.ObjectId;

    // Check if category_id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(category_id) && category_id.length === 24) {
      categoryObjectId = new mongoose.Types.ObjectId(category_id);
    } else {
      // It's a slug, convert to ObjectId
      const category = await ProjectCategory.findOne({ slug: category_id });

      if (!category) {
        return NextResponse.json(
          { error: 'دسته‌بندی مورد نظر یافت نشد' },
          { status: 400 }
        );
      }

      categoryObjectId = category._id as mongoose.Types.ObjectId;
    }

    // Create project in database
    const newProject = await Project.create({
      title,
      slug,
      description,
      category_id: categoryObjectId,
      area: area ? parseInt(area) : null,
      year: year ? parseInt(year) : null,
      location: location || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      status: 'published'
    });

    const projectId = newProject._id.toString();

    // Handle image uploads if any
    if (images && images.length > 0) {
      try {
        // Create safe folder name from project slug
        const safeProjectFolder = slug.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
        const projectDir = path.join(process.cwd(), 'public', 'images', 'projects', safeProjectFolder);

        if (!fs.existsSync(projectDir)) {
          fs.mkdirSync(projectDir, { recursive: true });
        }

        const savedImages: string[] = [];

        // Save each image
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          if (image && image.size > 0) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const filename = `${Date.now()}-${i + 1}-${image.name}`;
            const filepath = path.join(projectDir, filename);

            fs.writeFileSync(filepath, buffer);
            savedImages.push(filename);
          }
        }

        // Create project info file with all data
        const projectInfo = {
          id: projectId,
          title,
          slug,
          description,
          category_id: categoryObjectId.toString(),
          area: area ? parseInt(area) : null,
          year: year ? parseInt(year) : null,
          location: location || null,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          created_at: new Date().toISOString(),
          database_type: 'MongoDB'
        };

        fs.writeFileSync(
          path.join(projectDir, 'project-info.json'),
          JSON.stringify(projectInfo, null, 2)
        );

        // Set main_image in database to first uploaded image
        if (savedImages.length > 0) {
          const mainImagePath = `/images/projects/${safeProjectFolder}/${savedImages[0]}`;

          try {
            await Project.findByIdAndUpdate(newProject._id, {
              main_image: mainImagePath
            });

            console.log(`✅ Set main_image for project ${slug}: ${mainImagePath}`);
          } catch (updateError) {
            console.error('❌ Error setting main_image:', updateError);
          }

          // Add images to project_images collection
          for (let i = 0; i < savedImages.length; i++) {
            const filename = savedImages[i];
            const imageUrl = `/images/projects/${safeProjectFolder}/${filename}`;

            try {
              await ProjectImage.create({
                project_id: newProject._id,
                image_url: imageUrl,
                alt_text: `${title} - تصویر ${i + 1}`,
                sort_order: i + 1
              });

              console.log(`✅ Added image to project_images: ${filename}`);
            } catch (insertError) {
              console.error('❌ Error adding to project_images:', insertError);
            }
          }
        }

        console.log(`Project ${slug} created with ${savedImages.length} images`);
      } catch (fileError) {
        console.error('Error saving images:', fileError);
        // Don't fail the entire request if image saving fails
      }
    }

    return NextResponse.json({
      message: 'پروژه با موفقیت ایجاد شد',
      project: newProject.toObject()
    });
  } catch (error) {
    console.error('Create project error:', error);

    if (error instanceof Error) {
      if (error.message.includes('احراز هویت')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }

      if (error.message.includes('duplicate key') || error.message.includes('E11000')) {
        return NextResponse.json(
          { error: 'اسلاگ تکراری است - لطفاً اسلاگ دیگری انتخاب کنید' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'خطا در ایجاد پروژه: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'خطای نامشخص در ایجاد پروژه' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a project
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    await checkAuth(request);

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json(
        { error: 'شناسه پروژه الزامی است' },
        { status: 400 }
      );
    }

    // Get project info before deletion (for folder cleanup)
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { error: 'پروژه یافت نشد' },
        { status: 404 }
      );
    }

    const projectSlug = project.slug;

    // Delete from database
    await Project.findByIdAndDelete(projectId);

    // Delete related images from database
    await ProjectImage.deleteMany({ project_id: projectId });

    // Clean up project folder if exists
    const safeProjectFolder = projectSlug.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
    const projectDir = path.join(process.cwd(), 'public', 'images', 'projects', safeProjectFolder);

    if (fs.existsSync(projectDir)) {
      try {
        // Remove all files in the directory
        const files = fs.readdirSync(projectDir);
        for (const file of files) {
          fs.unlinkSync(path.join(projectDir, file));
        }
        // Remove the directory
        fs.rmdirSync(projectDir);
      } catch (error) {
        console.error('Error cleaning up project folder:', error);
        // Continue even if folder cleanup fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'پروژه با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Delete project error:', error);

    // Handle authentication errors
    if (error instanceof Error && (
      error.message.includes('احراز هویت') ||
      error.message.includes('توکن')
    )) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'خطا در حذف پروژه' },
      { status: 500 }
    );
  }
}

// PATCH - Update coordinates (and optionally location) of a project
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    await checkAuth(request);

    let data: any = null;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json({ error: 'بدنه درخواست JSON معتبر نیست' }, { status: 400 });
    }

    const { id, slug, latitude, longitude, location } = data || {};

    if (!id && !slug) {
      return NextResponse.json({ error: 'id یا slug الزامی است' }, { status: 400 });
    }

    if (latitude === undefined && longitude === undefined && location === undefined) {
      return NextResponse.json({ error: 'هیچ فیلدی برای بروزرسانی ارسال نشده است' }, { status: 400 });
    }

    const updateFields: any = {};

    if (latitude !== undefined) {
      const latNum = latitude === null || latitude === '' ? null : parseFloat(latitude);
      if (latNum !== null && (isNaN(latNum) || latNum < -90 || latNum > 90)) {
        return NextResponse.json({ error: 'عرض جغرافیایی نامعتبر است' }, { status: 400 });
      }
      updateFields.latitude = latNum;
    }

    if (longitude !== undefined) {
      const lngNum = longitude === null || longitude === '' ? null : parseFloat(longitude);
      if (lngNum !== null && (isNaN(lngNum) || lngNum < -180 || lngNum > 180)) {
        return NextResponse.json({ error: 'طول جغرافیایی نامعتبر است' }, { status: 400 });
      }
      updateFields.longitude = lngNum;
    }

    if (location !== undefined) {
      updateFields.location = location === '' ? null : location;
    }

    // Always update updated_at
    updateFields.updated_at = new Date();

    const query = id ? { _id: id } : { slug };

    const updatedProject = await Project.findOneAndUpdate(
      query,
      { $set: updateFields },
      { new: true, select: 'id title slug latitude longitude location' }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: 'پروژه یافت نشد' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'مختصات بروزرسانی شد',
      project: {
        id: updatedProject._id.toString(),
        title: updatedProject.title,
        slug: updatedProject.slug,
        latitude: updatedProject.latitude,
        longitude: updatedProject.longitude,
        location: updatedProject.location
      }
    });
  } catch (error) {
    console.error('Patch project error:', error);
    if (error instanceof Error && (error.message.includes('احراز') || error.message.includes('توکن'))) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'خطا در بروزرسانی مختصات' }, { status: 500 });
  }
}
