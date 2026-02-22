import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import mongoose from 'mongoose';

export async function GET() {
    try {
        // Try to connect to MongoDB
        await connectDB();

        // Check if connection is alive
        const state = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        if (state === 1) {
            return NextResponse.json({
                status: 'healthy',
                message: 'اتصال به MongoDB موفقیت‌آمیز است',
                database: 'MongoDB',
                connectionState: states[state as keyof typeof states]
            });
        } else {
            return NextResponse.json(
                {
                    status: 'unhealthy',
                    message: 'مشکل در اتصال به MongoDB',
                    error: `Connection state: ${states[state as keyof typeof states]}`
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Health check error:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: 'خطا در بررسی وضعیت دیتابیس',
                error: error instanceof Error ? error.message : 'نامشخص'
            },
            { status: 500 }
        );
    }
}
