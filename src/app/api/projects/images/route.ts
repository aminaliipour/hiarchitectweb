import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Project, ProjectImage } from '@/lib/database';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';
import fs from 'fs';
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

// GET - Get images for a project
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('project_id');
        const slug = searchParams.get('slug');

        if (!projectId && !slug) {
            return NextResponse.json(
                { error: 'شناسه یا اسلاگ پروژه الزامی است' },
                { status: 400 }
            );
        }

        let project;
        if (projectId) {
            project = await Project.findById(projectId);
        } else {
            project = await Project.findOne({ slug });
        }

        if (!project) {
            return NextResponse.json(
                { error: 'پروژه یافت نشد' },
                { status: 404 }
            );
        }

        const images = await ProjectImage.find({ project_id: project._id })
            .sort({ category: 1, sort_order: 1 })
            .lean();

        // Group images by category
        const grouped = {
            execution: images.filter((img: any) => img.category === 'execution'),
            design: images.filter((img: any) => img.category === 'design'),
            all: images
        };

        return NextResponse.json({
            success: true,
            images: grouped,
            // For backward compatibility, also return flat list
            imagesList: images.map((img: any) => ({
                id: img._id.toString(),
                project_id: img.project_id.toString(),
                image_url: img.image_url,
                alt_text: img.alt_text,
                category: img.category,
                sort_order: img.sort_order,
                created_at: img.created_at
            }))
        });

    } catch (error) {
        console.error('Get project images error:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت تصاویر' },
            { status: 500 }
        );
    }
}

// POST - Add new image to project
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        await checkAuth(request);

        const formData = await request.formData();

        // Accept both project_id and projectSlug
        const projectId = formData.get('project_id') as string;
        const projectSlug = formData.get('projectSlug') as string;

        // Accept both 'image' and 'file' field names
        const image = (formData.get('image') || formData.get('file')) as File;
        const alt_text = formData.get('alt_text') as string;
        const category = (formData.get('category') as string) || 'design';

        // Debug log
        console.log('API received category:', category);
        console.log('Category from formData:', formData.get('category'));

        if ((!projectId && !projectSlug) || !image) {
            return NextResponse.json(
                { error: 'شناسه یا اسلاگ پروژه و تصویر الزامی است' },
                { status: 400 }
            );
        }

        // Get project by ID or slug
        let project;
        if (projectId) {
            project = await Project.findById(projectId);
        } else if (projectSlug) {
            project = await Project.findOne({ slug: projectSlug });
        }

        if (!project) {
            return NextResponse.json(
                { error: 'پروژه یافت نشد' },
                { status: 404 }
            );
        }

        // Get current max sort_order
        const maxSortOrder = await ProjectImage.findOne({ project_id: project._id })
            .sort({ sort_order: -1 })
            .select('sort_order')
            .lean();

        const nextSortOrder = maxSortOrder ? maxSortOrder.sort_order + 1 : 1;

        // Save image to disk
        const safeProjectFolder = project.slug.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
        const projectDir = path.join(process.cwd(), 'public', 'images', 'projects', safeProjectFolder);

        if (!fs.existsSync(projectDir)) {
            fs.mkdirSync(projectDir, { recursive: true });
        }

        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = `${Date.now()}-${nextSortOrder}-${image.name}`;
        const filepath = path.join(projectDir, filename);

        fs.writeFileSync(filepath, buffer);

        const imageUrl = `/images/projects/${safeProjectFolder}/${filename}`;

        // Create database record
        const newImage = await ProjectImage.create({
            project_id: project._id,
            image_url: imageUrl,
            alt_text: alt_text || `${project.title} - تصویر ${nextSortOrder}`,
            category: category,
            sort_order: nextSortOrder
        });

        // If this is the first image, set it as main_image
        if (nextSortOrder === 1) {
            await Project.findByIdAndUpdate(project._id, { main_image: imageUrl });
        }

        return NextResponse.json({
            success: true,
            message: 'تصویر با موفقیت اضافه شد',
            image: {
                id: newImage._id.toString(),
                image_url: newImage.image_url,
                alt_text: newImage.alt_text,
                category: newImage.category,
                sort_order: newImage.sort_order
            }
        });

    } catch (error) {
        console.error('Add project image error:', error);

        if (error instanceof Error && error.message.includes('احراز هویت')) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'خطا در افزودن تصویر' },
            { status: 500 }
        );
    }
}

// DELETE - Delete an image from project
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        await checkAuth(request);

        const { searchParams } = new URL(request.url);
        const imageId = searchParams.get('id');

        if (!imageId) {
            return NextResponse.json(
                { error: 'شناسه تصویر الزامی است' },
                { status: 400 }
            );
        }

        const image = await ProjectImage.findById(imageId);
        if (!image) {
            return NextResponse.json(
                { error: 'تصویر یافت نشد' },
                { status: 404 }
            );
        }

        // Delete from database
        await ProjectImage.findByIdAndDelete(imageId);

        // Try to delete physical file
        try {
            const imagePath = path.join(process.cwd(), 'public', image.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        } catch (fileError) {
            console.error('Error deleting image file:', fileError);
        }

        return NextResponse.json({
            success: true,
            message: 'تصویر با موفقیت حذف شد'
        });

    } catch (error) {
        console.error('Delete project image error:', error);

        if (error instanceof Error && error.message.includes('احراز هویت')) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'خطا در حذف تصویر' },
            { status: 500 }
        );
    }
}
