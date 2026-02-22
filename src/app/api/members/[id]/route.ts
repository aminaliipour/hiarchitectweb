import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';
import { connectDB, Member, MemberFile } from '@/lib/database';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

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

// Helper function to delete member's folder and files
async function deleteMemberFolderByKeys(nationalCode?: string, firstName?: string, lastName?: string) {
  try {
    const folderBase = path.join(process.cwd(), 'public', 'files');
    const tryPaths: string[] = [];

    // Primary: national code folder (digits only)
    if (nationalCode) {
      const cleanNC = nationalCode.toString().trim().replace(/[^0-9]/g, '');
      if (cleanNC) tryPaths.push(path.join(folderBase, cleanNC));
    }

    // Fallback: legacy name-based folder
    if (firstName || lastName) {
      const legacyName = `${firstName || ''}_${lastName || ''}`
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^\w\-\.]/g, '_');
      if (legacyName) tryPaths.push(path.join(folderBase, legacyName));
    }

    let deletedAny = false;
    for (const p of tryPaths) {
      if (fs.existsSync(p)) {
        fs.rmSync(p, { recursive: true, force: true });
        console.log(`Deleted member folder: ${p}`);
        deletedAny = true;
      } else {
        console.log(`Member folder not found (skip): ${p}`);
      }
    }
    return deletedAny;
  } catch (error) {
    console.error('Error deleting member folder:', error);
    return false;
  }
}

// GET - Get single member
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await checkAuth(request);

    const { id: memberId } = await context.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(memberId) || memberId.length !== 24) {
      return NextResponse.json(
        { error: 'شناسه عضو نامعتبر است' },
        { status: 400 }
      );
    }

    const member = await Member.findById(memberId).lean();

    if (!member) {
      return NextResponse.json(
        { error: 'عضو یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      member: {
        id: member._id.toString(),
        ...member
      }
    });

  } catch (error) {
    console.error('Get member error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'خطا در دریافت اطلاعات عضو' },
      { status: 500 }
    );
  }
}

// PUT - Update member
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await checkAuth(request);

    const { id: memberId } = await context.params;
    const body = await request.json();
    const { first_name, last_name, position, national_code, phone, email, status } = body;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(memberId) || memberId.length !== 24) {
      return NextResponse.json(
        { error: 'شناسه عضو نامعتبر است' },
        { status: 400 }
      );
    }

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

    // Check if member exists
    const existingMember = await Member.findById(memberId);

    if (!existingMember) {
      return NextResponse.json(
        { error: 'عضو یافت نشد' },
        { status: 404 }
      );
    }

    // Check if national code already exists for other members
    const duplicateNationalCode = await Member.findOne({
      national_code: national_code.trim(),
      _id: { $ne: memberId }
    });

    if (duplicateNationalCode) {
      return NextResponse.json(
        { error: 'عضو دیگری با این کد ملی وجود دارد' },
        { status: 409 }
      );
    }

    // Check if email already exists for other members (only if email is provided)
    if (email && email.trim()) {
      const duplicateEmail = await Member.findOne({
        email: email.trim(),
        _id: { $ne: memberId }
      });

      if (duplicateEmail) {
        return NextResponse.json(
          { error: 'عضو دیگری با این ایمیل وجود دارد' },
          { status: 409 }
        );
      }
    }

    // Update member
    const updatedMember = await Member.findByIdAndUpdate(
      memberId,
      {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        position: position ? position.trim() : null,
        national_code: national_code.trim(),
        phone: phone ? phone.trim() : null,
        email: email ? email.trim() : null,
        status: status || 'active',
        updated_at: new Date()
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'اطلاعات عضو با موفقیت بروزرسانی شد',
      member: {
        id: updatedMember!._id.toString(),
        ...updatedMember!.toObject()
      }
    });

  } catch (error) {
    console.error('Update member error:', error);
    return NextResponse.json(
      { error: 'خطا در بروزرسانی اطلاعات عضو' },
      { status: 500 }
    );
  }
}

// DELETE - Delete member
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await checkAuth(request);

    const { id: memberId } = await context.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(memberId) || memberId.length !== 24) {
      return NextResponse.json(
        { error: 'شناسه عضو نامعتبر است' },
        { status: 400 }
      );
    }

    // Check if member exists
    const memberInfo = await Member.findById(memberId).lean();

    if (!memberInfo) {
      return NextResponse.json(
        { error: 'عضو یافت نشد' },
        { status: 404 }
      );
    }

    // Delete member's folder and files first
    const folderDeleted = await deleteMemberFolderByKeys(
      memberInfo.national_code,
      memberInfo.first_name,
      memberInfo.last_name
    );

    // Delete member from database
    await Member.findByIdAndDelete(memberId);

    // Delete related member files
    await MemberFile.deleteMany({ member_id: memberId });

    return NextResponse.json({
      success: true,
      message: `عضو ${memberInfo.first_name} ${memberInfo.last_name} با موفقیت حذف شد`,
      folderDeleted: folderDeleted,
      memberFolder: (memberInfo.national_code || `${memberInfo.first_name}_${memberInfo.last_name}`.replace(/\s+/g, '_'))
    });

  } catch (error) {
    console.error('Delete member error:', error);
    return NextResponse.json(
      { error: 'خطا در حذف عضو' },
      { status: 500 }
    );
  }
}
