import { NextRequest, NextResponse } from 'next/server';
import { connectDB, JourneyMilestone } from '@/lib/database';

// Seed initial journey data from fallback to MongoDB
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { password } = await request.json();

        // Simple password protection
        if (password !== 'seed-journey-2024') {
            return NextResponse.json(
                { error: 'رمز عبور نادرست است' },
                { status: 401 }
            );
        }

        // Check if data already exists
        const existingCount = await JourneyMilestone.countDocuments();
        if (existingCount > 0) {
            return NextResponse.json(
                {
                    error: `دیتابیس از قبل ${existingCount} مرحله دارد. ابتدا آن‌ها را حذف کنید.`,
                    existing_count: existingCount
                },
                { status: 400 }
            );
        }

        // Fallback milestones from timeline component
        const fallbackMilestones = [
            {
                year: "1395",
                title: "تأسیس در لاهیجان",
                description: "های آرشیتکت با چشم‌انداز ترکیب زیبایی‌شناسی سنتی لاهیجان با اصول طراحی مدرن تأسیس شد.",
                image_url: "/images/projects/kazheh/final/1.jpg",
                video_url: "/images/journey/1.mp4",
                hotspot_x: 70,
                hotspot_y: 30,
                sort_order: 1,
                is_active: true
            },
            {
                year: "معرفی",
                title: "معرفی شرکت های آرشیتکت",
                description: "شرکت های آرشیتکت در قلب شهر لاهیجان فعالیت می‌کند. ما با تمرکز بر طراحی منحصر‌به‌فرد، تلاش می‌کنیم بهترین تجربه را برای مشتریان‌مان رقم بزنیم و فضاهایی خلق کنیم که زندگی در آن‌ها جریان داشته باشد. در های آرشیتکت، طراحی فراتر از ساختن یک فضاست. ما معتقدیم هر طراحی باید بازتابی از زیبایی، کارآمدی و آرامش باشد.",
                image_url: "/images/journey/2.jpg",
                video_url: "",
                hotspot_x: 30,
                hotspot_y: 60,
                sort_order: 2,
                is_active: true
            },
            {
                year: "تیم",
                title: "معرفی تیم",
                description: "در شرکت معماری ما، ترکیب بی‌نظیری از ناظرین باتجربه، طراحان نوآور، مدیران توانمند و متخصصین آی‌تی حرفه‌ای کنار هم قرار گرفته‌اند تا هر پروژه را از ایده تا اجرا، با دیدی نو و تکنولوژی روز، به بهترین شکل ممکن به سرانجام برسانند.",
                image_url: "/images/journey/3.png",
                video_url: "",
                hotspot_x: 80,
                hotspot_y: 50,
                sort_order: 3,
                is_active: true
            },
            {
                year: "1404",
                title: "بیش از ۱۰۰ پروژه تکمیل‌شده",
                description: "به نقطه عطفی با تکمیل بیش از ۱۰۰ پروژه موفق در فضاهای مسکونی و تجاری رسیدیم.",
                image_url: "/images/journey/7.png",
                video_url: "",
                hotspot_x: 20,
                hotspot_y: 40,
                sort_order: 4,
                is_active: true
            }
        ];

        // Insert all milestones
        const inserted = await JourneyMilestone.insertMany(fallbackMilestones);

        return NextResponse.json({
            success: true,
            message: `${inserted.length} مرحله با موفقیت به دیتابیس اضافه شد`,
            count: inserted.length,
            milestones: inserted.map(m => ({
                id: m._id.toString(),
                year: m.year,
                title: m.title
            }))
        });

    } catch (error) {
        console.error('Seed journey error:', error);
        return NextResponse.json(
            {
                error: 'خطا در اضافه کردن داده‌ها',
                details: error instanceof Error ? error.message : 'نامشخص'
            },
            { status: 500 }
        );
    }
}
