import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

// Use environment variables for database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hidb',
  password: process.env.DB_PASSWORD || 'admin@123',
  port: parseInt(process.env.DB_PORT || '5432'),
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Full request body:', body);
    
    const { phone, national_code } = body;

    console.log('Member login attempt:', { phone, national_code: national_code ? '***' : 'undefined' });
    
    // Debug: Log database connection info (without sensitive data)
    console.log('Database connection config:', {
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'hidb',
      user: process.env.DB_USER || 'postgres',
      port: process.env.DB_PORT || '5432',
      hasPassword: !!(process.env.DB_PASSWORD),
      hasDatabaseUrl: !!(process.env.DATABASE_URL)
    });

    // Validate required fields
    if (!phone || !national_code) {
      console.log('Missing fields:', { phone: !!phone, national_code: !!national_code });
      return NextResponse.json(
        { error: 'شماره تماس و کد ملی الزامی است' },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!/^09\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'فرمت شماره تماس صحیح نیست' },
        { status: 400 }
      );
    }

    // Validate national code format
    if (!/^\d{10}$/.test(national_code)) {
      return NextResponse.json(
        { error: 'فرمت کد ملی صحیح نیست' },
        { status: 400 }
      );
    }

    // Find member with matching phone and national code
    const result = await pool.query(
      `SELECT id, first_name, last_name, position, phone, email, status, created_at 
       FROM members 
       WHERE phone = $1 AND national_code = $2 AND status = 'active'`,
      [phone, national_code]
    );

    if (result.rows.length === 0) {
      console.log('Login failed: Member not found or inactive');
      return NextResponse.json(
        { error: 'شماره تماس یا کد ملی اشتباه است یا حساب کاربری غیرفعال است' },
        { status: 401 }
      );
    }

    const member = result.rows[0];
    console.log('Member found:', { id: member.id, name: `${member.first_name} ${member.last_name}` });

    // Create JWT token
    const tokenPayload = {
      memberId: member.id, // اضافه کردن memberId
      id: member.id,
      type: 'member',
      phone: member.phone,
      name: `${member.first_name} ${member.last_name}`,
      position: member.position
    };

    const secret = JWT_SECRET;
    const token = jwt.sign(tokenPayload, secret, { expiresIn: '30d' });

    // Create response with member data
    const response = NextResponse.json({
      success: true,
      message: 'ورود موفقیت‌آمیز',
      member: {
        id: member.id,
        firstName: member.first_name,
        lastName: member.last_name,
        position: member.position,
        phone: member.phone,
        email: member.email,
        createdAt: member.created_at
      }
    });

    // Set token as HTTP-only cookie
    response.cookies.set('member_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days in seconds
    });

    return response;

  } catch (error: any) {
    console.error('Member login error:', error);
    
    // Check if it's a database connection error
    if (error.code === '28P01') {
      console.error('Database authentication failed. Check your database credentials.');
      return NextResponse.json(
        { error: 'خطا در اتصال به دیتابیس. لطفاً با مدیر سیستم تماس بگیرید.' },
        { status: 500 }
      );
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Database connection refused. Check if PostgreSQL is running.');
      return NextResponse.json(
        { error: 'سرور دیتابیس در دسترس نیست.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'خطا در ورود' },
      { status: 500 }
    );
  }
}
