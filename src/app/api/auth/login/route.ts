import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, User } from '@/lib/database';
import { generateToken, createAuthResponse } from '../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'ایمیل و رمز عبور الزامی است' },
        { status: 400 }
      );
    }

    // Find user in database
    let user;
    try {
      user = await User.findOne({ email }).lean();
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'خطا در دسترسی به دیتابیس. ممکن است دیتابیس راه‌اندازی نشده باشد. لطفا ابتدا به /setup بروید.' },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'ایمیل یا رمز عبور اشتباه است. اگر اولین بار است که وارد می‌شوید، ابتدا دیتابیس را از /setup راه‌اندازی کنید.' },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'ایمیل یا رمز عبور اشتباه است' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    console.log('🔑 Generated token for user:', user.email);
    console.log('🔑 Token (first 30 chars):', token.substring(0, 30) + '...');

    // Create response with token
    const response = NextResponse.json({
      message: 'ورود موفقیت‌آمیز',
      token: token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      }
    });

    const finalResponse = createAuthResponse(response, token);
    console.log('✅ Login successful, cookie set for:', user.email);
    
    return finalResponse;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'خطای سرور: ' + (error instanceof Error ? error.message : 'نامشخص') },
      { status: 500 }
    );
  }
}
