import { NextRequest, NextResponse } from 'next/server';
import { connectDB, JourneyMilestone } from '@/lib/database';
import mongoose from 'mongoose';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'شناسه نامعتبر است' },
                { status: 400 }
            );
        }

        const milestone = await JourneyMilestone.findById(id);

        if (!milestone) {
            return NextResponse.json(
                { error: 'مرحله سفر یافت نشد' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            milestone: {
                id: milestone._id.toString(),
                year: milestone.year,
                title: milestone.title,
                description: milestone.description,
                image_url: milestone.image_url,
                video_url: milestone.video_url,
                hotspot_x: milestone.hotspot_x,
                hotspot_y: milestone.hotspot_y,
                sort_order: milestone.sort_order,
                is_active: milestone.is_active,
                created_at: milestone.created_at,
                updated_at: milestone.updated_at
            }
        });

    } catch (error) {
        console.error('Error fetching journey milestone:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت مرحله سفر' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'شناسه نامعتبر است' },
                { status: 400 }
            );
        }

        const body = await request.json();

        const milestone = await JourneyMilestone.findByIdAndUpdate(
            id,
            {
                ...body,
                updated_at: new Date()
            },
            { new: true }
        );

        if (!milestone) {
            return NextResponse.json(
                { error: 'مرحله سفر یافت نشد' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'مرحله سفر با موفقیت به‌روزرسانی شد',
            milestone: {
                id: milestone._id.toString(),
                year: milestone.year,
                title: milestone.title,
                description: milestone.description,
                image_url: milestone.image_url,
                video_url: milestone.video_url,
                hotspot_x: milestone.hotspot_x,
                hotspot_y: milestone.hotspot_y,
                sort_order: milestone.sort_order,
                is_active: milestone.is_active,
                created_at: milestone.created_at,
                updated_at: milestone.updated_at
            }
        });

    } catch (error) {
        console.error('Error updating journey milestone:', error);
        return NextResponse.json(
            { error: 'خطا در به‌روزرسانی مرحله سفر' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'شناسه نامعتبر است' },
                { status: 400 }
            );
        }

        const milestone = await JourneyMilestone.findByIdAndDelete(id);

        if (!milestone) {
            return NextResponse.json(
                { error: 'مرحله سفر یافت نشد' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'مرحله سفر با موفقیت حذف شد'
        });

    } catch (error) {
        console.error('Error deleting journey milestone:', error);
        return NextResponse.json(
            { error: 'خطا در حذف مرحله سفر' },
            { status: 500 }
        );
    }
}
