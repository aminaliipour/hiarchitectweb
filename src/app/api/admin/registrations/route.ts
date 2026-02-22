import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hidb',
  password: process.env.DB_PASSWORD || 'admin@123',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// GET - List all registrations with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    const queryParams: any[] = [];
    let paramCount = 0;
    
    if (status && status !== 'all') {
      paramCount++;
      whereClause += `WHERE status = $${paramCount}`;
      queryParams.push(status);
    }
    
    if (search) {
      paramCount++;
      const searchClause = paramCount === 1 ? 'WHERE' : 'AND';
      whereClause += ` ${searchClause} (full_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }
    
    // Count query
    const countQuery = `SELECT COUNT(*) FROM extended_registration_forms ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);
    
    // Data query - Get extended fields for admin
    paramCount++;
    const dataQuery = `
      SELECT 
        id, full_name, email, mobile, birth_date, address,
        education_level, field_of_study, university, work_experience_years,
        preferred_position, salary_expectation, has_portfolio, portfolio_url,
        status, created_at, updated_at,
        -- Count of answered behavioral questions
        CASE 
          WHEN digital_interests IS NOT NULL OR first_salary_plan IS NOT NULL 
          THEN true ELSE false 
        END as has_behavioral_answers,
        -- Count of answered open-ended questions  
        CASE 
          WHEN why_join_company IS NOT NULL OR employment_reason IS NOT NULL
          THEN true ELSE false
        END as has_detailed_answers,
        -- Skills and languages count
        COALESCE(array_length(skills, 1), 0) as skills_count,
        COALESCE(array_length(languages, 1), 0) as languages_count
      FROM extended_registration_forms 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    
    queryParams.push(limit, offset);
    const dataResult = await pool.query(dataQuery, queryParams);
    
    return NextResponse.json({
      registrations: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching admin registrations:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت لیست فرم‌ها' },
      { status: 500 }
    );
  }
}

// PATCH - Update registration status and add notes
export async function PATCH(request: NextRequest) {
  try {
    const { id, status, notes } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'شناسه فرم و وضعیت الزامی است' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected', 'interview'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'وضعیت نامعتبر' },
        { status: 400 }
      );
    }

    const query = `
      UPDATE extended_registration_forms 
      SET status = $1, additional_notes = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 
      RETURNING id, status, updated_at
    `;

    const result = await pool.query(query, [status, notes || null, id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'فرم مورد نظر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'وضعیت فرم به‌روزرسانی شد',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error updating registration status:', error);
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی وضعیت' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a registration (soft delete by changing status)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'شناسه فرم الزامی است' },
        { status: 400 }
      );
    }

    // Soft delete by updating status
    const query = `
      UPDATE extended_registration_forms 
      SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status != 'deleted'
      RETURNING id
    `;

    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'فرم مورد نظر یافت نشد یا قبلاً حذف شده' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'فرم با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('❌ Error deleting registration:', error);
    return NextResponse.json(
      { error: 'خطا در حذف فرم' },
      { status: 500 }
    );
  }
}