import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Project, ProjectImage } from '@/lib/database';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';

// DELETE - Clear all projects (requires password for safety)
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        // Get authentication token
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json(
                { error: 'احراز هویت نشده' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: 'توکن نامعتبر' },
                { status: 401 }
            );
        }

        // Get confirmation password from request body
        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: 'درخواست نامعتبر' },
                { status: 400 }
            );
        }

        const { password } = body;

        // Require a password for safety
        if (password !== 'clear-all-projects-2024') {
            return NextResponse.json(
                { error: 'رمز عبور اشتباه است' },
                { status: 403 }
            );
        }

        // Count projects before deletion
        const projectCount = await Project.countDocuments();
        const imageCount = await ProjectImage.countDocuments();

        // Delete all projects
        await Project.deleteMany({});

        // Delete all project images
        await ProjectImage.deleteMany({});

        console.log(`✅ Cleared ${projectCount} projects and ${imageCount} images from database`);

        return NextResponse.json({
            success: true,
            message: 'تمام پروژه‌ها با موفقیت پاک شدند',
            deleted: {
                projects: projectCount,
                images: imageCount
            }
        });

    } catch (error) {
        console.error('Clear all projects error:', error);

        if (error instanceof Error) {
            return NextResponse.json(
                { error: 'خطا در پاک کردن پروژه‌ها: ' + error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'خطای نامشخص در پاک کردن پروژه‌ها' },
            { status: 500 }
        );
    }
}
