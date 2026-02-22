import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../lib/auth';
import { connectDB, Member } from '@/lib/database';

// Helper function to check authentication
async function checkAuth(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    throw new Error('احراز هویت نشده');
  }

  const payload = verifyToken(token);
  if (!payload) {
    throw new Error('توکن نامعتبر');
  }

  return payload;
}

// GET - Get all members
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await checkAuth(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    // Build search query
    let query: any = {};

    if (search) {
      query = {
        $or: [
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { position: { $regex: search, $options: 'i' } },
          { national_code: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Get total count
    const total = await Member.countDocuments(query);

    // Get members
    const members = await Member.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedMembers = members.map((member: any) => ({
      id: member._id.toString(),
      first_name: member.first_name,
      last_name: member.last_name,
      position: member.position,
      national_code: member.national_code,
      phone: member.phone,
      email: member.email,
      status: member.status,
      created_at: member.created_at,
      updated_at: member.updated_at
    }));

    return NextResponse.json({
      success: true,
      members: formattedMembers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get members error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'خطا در دریافت اعضا' },
      { status: 500 }
    );
  }
}

// POST - Create new member
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await checkAuth(request);

    const body = await request.json();
    const { first_name, last_name, position, national_code, phone, email } = body;

    // Validate required fields
    if (!first_name || !last_name || !national_code) {
      return NextResponse.json(
        { error: 'نام، نام خانوادگی و کد ملی الزامی است' },
        { status: 400 }
      );
    }

    // Validate national code format (10 digits)
    if (!/^\d{10}$/.test(national_code)) {
      return NextResponse.json(
        { error: 'کد ملی باید 10 رقم باشد' },
        { status: 400 }
      );
    }

    // Validate email format only if provided
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'فرمت ایمیل صحیح نیست' },
          { status: 400 }
        );
      }
    }

    // Validate phone format only if provided (Iranian mobile)
    if (phone && phone.trim()) {
      if (!/^09\d{9}$/.test(phone)) {
        return NextResponse.json(
          { error: 'شماره تماس باید با 09 شروع شده و 11 رقم باشد' },
          { status: 400 }
        );
      }
    }

    // Check if national code already exists
    const existingMember = await Member.findOne({ national_code: national_code.trim() });

    if (existingMember) {
      return NextResponse.json(
        { error: 'عضوی با این کد ملی قبلاً ثبت شده است' },
        { status: 409 }
      );
    }

    // If email is provided, check for duplicate email
    if (email && email.trim()) {
      const existingEmail = await Member.findOne({ email: email.trim() });

      if (existingEmail) {
        return NextResponse.json(
          { error: 'عضوی با این ایمیل قبلاً ثبت شده است' },
          { status: 409 }
        );
      }
    }

    // Insert new member
    const newMember = await Member.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      position: position ? position.trim() : null,
      national_code: national_code.trim(),
      phone: phone ? phone.trim() : null,
      email: email ? email.trim() : null
    });

    return NextResponse.json({
      success: true,
      message: 'عضو جدید با موفقیت اضافه شد',
      member: {
        id: newMember._id.toString(),
        ...newMember.toObject()
      }
    });

  } catch (error) {
    console.error('Create member error:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد عضو جدید' },
      { status: 500 }
    );
  }
}
