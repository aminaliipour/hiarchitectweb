import { NextResponse } from 'next/server';

// Analytics feature is currently disabled during MongoDB migration
export async function POST() {
    return NextResponse.json(
        {
            success: false,
            message: 'Analytics tracking is currently disabled'
        },
        { status: 501 }
    );
}
