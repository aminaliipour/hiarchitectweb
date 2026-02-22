import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, User } from '@/lib/database';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password } = body;

        // Simple password protection
        if (password !== 'init-database-2024') {
            return NextResponse.json(
                { error: 'رمز عبور اشتباه است' },
                { status: 401 }
            );
        }

        // Connect to MongoDB
        await connectDB();

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@hiarchitect.ir' });

        if (existingAdmin) {
            return NextResponse.json(
                {
                    error: 'کاربر ادمین قبلاً ایجاد شده است',
                    admin: {
                        email: existingAdmin.email
                    }
                },
                { status: 400 }
            );
        }

        // Create admin user
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@hiarchitect.ir';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const adminUser = await User.create({
            email: adminEmail,
            password_hash: hashedPassword,
            role: 'admin'
        });

        console.log('✅ Admin user created successfully');

        return NextResponse.json({
            success: true,
            message: 'دیتابیس MongoDB با موفقیت راه‌اندازی شد',
            admin: {
                email: adminEmail,
                password: adminPassword,
                note: 'لطفاً این اطلاعات را در جای امنی ذخیره کنید'
            }
        });

    } catch (error) {
        console.error('Database initialization error:', error);

        if (error instanceof Error) {
            return NextResponse.json(
                {
                    error: 'خطا در راه‌اندازی دیتابیس',
                    details: error.message
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'خطای نامشخص در راه‌اندازی دیتابیس' },
            { status: 500 }
        );
    }
}
