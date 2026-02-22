import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    postgres_url: !!process.env.POSTGRES_URL,
    database_url: !!process.env.DATABASE_URL,
    jwt_secret: !!process.env.JWT_SECRET,
    admin_email: !!process.env.ADMIN_EMAIL,
    admin_password: !!process.env.ADMIN_PASSWORD
  });
}
