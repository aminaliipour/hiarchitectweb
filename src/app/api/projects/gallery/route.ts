import { NextRequest, NextResponse } from 'next/server';
import { connectDB, ProjectImage } from '@/lib/database';

// GET - Get all images for a specific project by slug
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json(
                { error: 'اسلاگ پروژه الزامی است' },
                { status: 400 }
            );
        }

        // Find project by slug
        const { Project } = await import('../../../lib/database');
        const project = await Project.findOne({ slug }).lean();

        if (!project) {
            return NextResponse.json(
                { error: 'پروژه یافت نشد' },
                { status: 404 }
            );
        }

        // Get all images for this project
        const images = await ProjectImage.find({ project_id: project._id })
            .sort({ category: 1, sort_order: 1 })
            .lean();

        // Format the response to match frontend expectations
        const formattedImages = images.map((img: any, index: number) => {
            // Extract filename from image_url
            const filename = img.image_url.split('/').pop() || '';

            return {
                filename: filename,
                url: img.image_url,
                isMainImage: index === 0, // First image is main image
                category: img.category || 'design', // Include category, default to design
                uploadedAt: img.created_at?.toISOString() || new Date().toISOString(),
                size: 0,
                lastModified: img.created_at?.toISOString() || new Date().toISOString()
            };
        });

        return NextResponse.json({
            success: true,
            gallery: formattedImages,
            total: formattedImages.length
        });
    } catch (error) {
        console.error('Get project gallery error:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت تصاویر پروژه' },
            { status: 500 }
        );
    }
}

// DELETE - Delete an image from project gallery
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const filename = searchParams.get('filename');

        if (!slug || !filename) {
            return NextResponse.json(
                { error: 'اسلاگ پروژه و نام فایل الزامی است' },
                { status: 400 }
            );
        }

        // Find project by slug
        const { Project } = await import('../../../lib/database');
        const project = await Project.findOne({ slug }).lean();

        if (!project) {
            return NextResponse.json(
                { error: 'پروژه یافت نشد' },
                { status: 404 }
            );
        }

        // Build image URL
        const imageUrl = `/images/projects/${slug}/${filename}`;

        // Find and delete the image record
        const deletedImage = await ProjectImage.findOneAndDelete({
            project_id: project._id,
            image_url: imageUrl
        });

        if (!deletedImage) {
            return NextResponse.json(
                { error: 'تصویر یافت نشد' },
                { status: 404 }
            );
        }

        // Try to delete physical file
        const fs = require('fs');
        const path = require('path');
        try {
            const imagePath = path.join(process.cwd(), 'public', imageUrl);
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
        console.error('Delete gallery image error:', error);
        return NextResponse.json(
            { error: 'خطا در حذف تصویر' },
            { status: 500 }
        );
    }
}
