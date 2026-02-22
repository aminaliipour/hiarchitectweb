import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    // Create transporter using Gmail SMTP
    // For Gmail, you need to:
    // 1. Enable 2-Factor Authentication
    // 2. Generate an App Password (not your regular password)
    // 3. Use the app password in GMAIL_PASS
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pezhmanalavi0@gmail.com', // Your Gmail address
        pass: process.env.GMAIL_PASS || 'your-app-password' // App password from Gmail
      }
    });

    // Email content
    const mailOptions = {
      from: 'pezhmanalavi0@gmail.com',
      to: 'pezhmanalavi0@gmail.com',
      subject: `پیام جدید از وبسایت های آرشیتکت - ${name}`,
      html: `
        <div style="font-family: 'Tahoma', Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
          <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 20px; border-radius: 10px 10px 0 0; color: #000;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">پیام جدید از وبسایت</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">های آرشیتکت - دفتر معماری لاهیجان</p>
          </div>
          
          <div style="background: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-right: 4px solid #fbbf24;">
              <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">اطلاعات فرستنده:</h3>
              <p style="margin: 5px 0; color: #555;"><strong>نام:</strong> ${name}</p>
              <p style="margin: 5px 0; color: #555;"><strong>ایمیل:</strong> ${email}</p>
              ${projectType ? `<p style="margin: 5px 0; color: #555;"><strong>نوع پروژه:</strong> ${getProjectTypeLabel(projectType)}</p>` : ''}
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">پیام:</h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-right: 4px solid #2196f3;">
              <p style="margin: 0; color: #1976d2; font-size: 14px;">
                <strong>💡 نکته:</strong> برای پاسخ، مستقیماً به ایمیل فرستنده (${email}) پاسخ دهید.
              </p>
            </div>
            
            <div style="margin-top: 20px; text-align: center; padding: 15px; background: #f5f5f5; border-radius: 8px;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                این پیام از طریق فرم تماس وبسایت hiarchitect.ir ارسال شده است<br>
                تاریخ ارسال: ${new Date().toLocaleDateString('fa-IR')} - ساعت: ${new Date().toLocaleTimeString('fa-IR')}
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'پیام شما با موفقیت ارسال شد' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.' },
      { status: 500 }
    );
  }
}

// Helper function to convert project type to Persian label
function getProjectTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    'residential': 'مسکونی',
    'commercial': 'تجاری', 
    'renovation': 'بازسازی',
    'interior': 'طراحی داخلی',
    'other': 'سایر'
  };
  return labels[type] || type;
}
