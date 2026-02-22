import { NextResponse } from 'next/server';

// Analytics events feature is currently disabled during MongoDB migration
export async function POST() {
    return NextResponse.json(
        {
            success: false,
            message: 'Analytics event tracking is currently disabled'
        },
        { status: 501 }
    );
}
