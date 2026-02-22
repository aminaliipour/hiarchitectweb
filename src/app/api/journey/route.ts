import { NextRequest, NextResponse } from 'next/server';
import { connectDB, JourneyMilestone } from '@/lib/database';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('includeInactive') === 'true';

        // Build filter
        const filter: any = {};
        if (!includeInactive) {
            filter.is_active = true;
        }

        // Get milestones sorted by sort_order
        const milestones = await JourneyMilestone.find(filter)
            .sort({ sort_order: 1, created_at: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            milestones: milestones.map(m => ({
                id: m._id.toString(),
                year: m.year,
                title: m.title,
                description: m.description,
                image_url: m.image_url,
                video_url: m.video_url,
                hotspot_x: m.hotspot_x,
                hotspot_y: m.hotspot_y,
                sort_order: m.sort_order,
                is_active: m.is_active,
                created_at: m.created_at,
                updated_at: m.updated_at
            }))
        });

    } catch (error) {
        console.error('Error fetching journey milestones:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'خطا در دریافت مراحل سفر',
                message: error instanceof Error ? error.message : 'نامشخص'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate required fields
        if (!body.year || !body.title || !body.description) {
            return NextResponse.json(
                { error: 'فیلدهای year، title و description الزامی هستند' },
                { status: 400 }
            );
        }

        // If sort_order not provided, get max + 1
        if (!body.sort_order) {
            const maxMilestone = await JourneyMilestone.findOne().sort({ sort_order: -1 });
            body.sort_order = maxMilestone ? maxMilestone.sort_order + 1 : 1;
        }

        const milestone = await JourneyMilestone.create({
            year: body.year,
            title: body.title,
            description: body.description,
            image_url: body.image_url,
            video_url: body.video_url,
            hotspot_x: body.hotspot_x || 50,
            hotspot_y: body.hotspot_y || 50,
            sort_order: body.sort_order,
            is_active: body.is_active !== undefined ? body.is_active : true
        });

        return NextResponse.json({
            success: true,
            message: 'مرحله سفر با موفقیت ایجاد شد',
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
        console.error('Error creating journey milestone:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'خطا در ایجاد مرحله سفر',
                message: error instanceof Error ? error.message : 'نامشخص'
            },
            { status: 500 }
        );
    }
}
