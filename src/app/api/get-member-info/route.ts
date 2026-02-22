import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET() {
  try {
    // دریافت اطلاعات عضو امین علیپور
    const query = `
      SELECT 
        id,
        first_name,
        last_name,
        email,
        phone,
        national_code,
        status
      FROM members
      WHERE email = 'aminemalipour@gmail.com'
      OR first_name LIKE '%امین%'
      OR first_name LIKE '%amin%'
      ORDER BY created_at DESC
      LIMIT 5;
    `;
    
    const result = await pool.query(query);

    return NextResponse.json({
      success: true,
      members: result.rows,
      message: 'اطلاعات اعضا برای تست'
    });

  } catch (error) {
    console.error('خطا در دریافت اطلاعات عضو:', error);
    return NextResponse.json({ 
      error: 'خطا در دریافت اطلاعات عضو',
      details: error instanceof Error ? error.message : 'خطای نامشخص'
    }, { status: 500 });
  }
}
