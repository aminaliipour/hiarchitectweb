import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hidb',
  password: process.env.DB_PASSWORD || 'admin@123',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    console.log('🔍 Fetching registration with ID:', id);
    
    const query = `
      SELECT * FROM extended_registration_forms 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      console.log('❌ Registration not found:', id);
      return NextResponse.json(
        { success: false, message: 'فرم یافت نشد' },
        { status: 404 }
      );
    }
    
    console.log('✅ Registration found:', result.rows[0].full_name);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching registration:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت فرم' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, additional_notes } = body;
    
    console.log('📝 Updating registration:', { id, status, additional_notes: additional_notes?.length });
    
    const query = `
      UPDATE extended_registration_forms 
      SET 
        status = $1,
        additional_notes = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, status, additional_notes, updated_at
    `;
    
    const result = await pool.query(query, [status, additional_notes, id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'فرم یافت نشد' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'وضعیت فرم با موفقیت به‌روزرسانی شد',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی فرم' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    console.log('🗑️ Deleting registration:', id);
    
    const query = `
      DELETE FROM extended_registration_forms 
      WHERE id = $1
      RETURNING id
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'فرم یافت نشد' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'فرم با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف فرم' },
      { status: 500 }
    );
  }
}