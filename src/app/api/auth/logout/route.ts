import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'خروج موفقیت‌آمیز' });
  
  // Remove simple auth cookie
  response.cookies.set('admin_logged', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Delete cookie
    path: '/'
  });
  
  return response;
}
