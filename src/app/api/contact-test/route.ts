import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, projectType, message } = await request.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'نام، ایمیل و پیام الزامی است' },
        { status: 400 }
      );
    }

    // Log the form data to console (for testing without email setup)
    console.log('📧 New contact form submission:');
    console.log('─'.repeat(50));
    console.log(`👤 Name: ${name}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🏗️  Project Type: ${projectType || 'Not specified'}`);
    console.log(`💬 Message: ${message}`);
    console.log(`🕐 Time: ${new Date().toLocaleString('fa-IR')}`);
    console.log('─'.repeat(50));

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { 
        success: true, 
        message: 'پیام شما دریافت شد! (در حال حاضر در کنسول نمایش داده می‌شود)',
        note: 'برای ارسال واقعی ایمیل، لطفاً Gmail App Password را در .env.local تنظیم کنید'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش فرم' },
      { status: 500 }
    );
  }
}
