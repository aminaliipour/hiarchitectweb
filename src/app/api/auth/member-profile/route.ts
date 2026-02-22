import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Use environment variables for database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hidb',
  password: process.env.DB_PASSWORD || 'admin@123',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('member_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get member data from database
    const result = await pool.query(
      'SELECT id, first_name, last_name, position, phone, email, created_at FROM members WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    const member = result.rows[0];

    return NextResponse.json({
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

  } catch (error) {
    console.error('Error fetching member profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
