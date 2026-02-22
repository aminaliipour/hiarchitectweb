import { NextRequest, NextResponse } from 'next/server';
import { connectDB, ProjectImage } from '@/lib/database';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';

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

// POST - Migrate existing images to have default category
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        await checkAuth(request);

        // Update all images without category field to 'design'
        const result = await ProjectImage.updateMany(
            {
                $or: [
                    { category: { $exists: false } },
                    { category: null }
                ]
            },
            {
                $set: { category: 'design' }
            }
        );

        return NextResponse.json({
            success: true,
            message: `${result.modifiedCount} تصویر به‌روز شد`,
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('Migration error:', error);

        if (error instanceof Error && error.message.includes('احراز هویت')) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'خطا در migration' },
            { status: 500 }
        );
    }
}
