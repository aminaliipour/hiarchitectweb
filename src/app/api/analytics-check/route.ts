import { NextResponse } from 'next/server';

// Analytics check feature is currently disabled during MongoDB migration
export async function GET() {
    return NextResponse.json(
        {
            success: false,
            message: 'Analytics is currently disabled',
            analytics_enabled: false
        },
        { status: 200 }
    );
}

export async function POST() {
    return NextResponse.json(
        {
            success: false,
            message: 'Analytics configuration is currently disabled'
        },
        { status: 501 }
    );
}
