import { NextResponse } from 'next/server';
import { removeAuthCookie } from '../../../lib/auth';

export async function POST() {
  const response = NextResponse.json({ message: 'خروج موفقیت‌آمیز' });
  return removeAuthCookie(response);
}
