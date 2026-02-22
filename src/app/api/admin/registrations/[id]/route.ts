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

// GET - Get detailed registration information
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'شناسه فرم الزامی است' },
        { status: 400 }
      );
    }

    const query = `
      SELECT * FROM extended_registration_forms 
      WHERE id = $1 AND status != 'deleted'
    `;

    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'فرم مورد نظر یافت نشد' },
        { status: 404 }
      );
    }

    const registration = result.rows[0];

    // Format the response for better frontend consumption
    const formattedRegistration = {
      ...registration,
      // Parse JSON fields safely
      digital_interests: registration.digital_interests || [],
      attractive_traits: registration.attractive_traits || [],
      skills: registration.skills || [],
      software_proficiency: registration.software_proficiency || [],
      languages: registration.languages || [],
      project_types: registration.project_types || [],
      work_history: registration.work_history || [],
      certificate_files: registration.certificate_files || [],
      
      // Format dates
      created_at: new Date(registration.created_at).toLocaleString('fa-IR'),
      updated_at: registration.updated_at ? new Date(registration.updated_at).toLocaleString('fa-IR') : null,
      birth_date: registration.birth_date ? new Date(registration.birth_date).toLocaleDateString('fa-IR') : null,
      availability_date: registration.availability_date ? new Date(registration.availability_date).toLocaleDateString('fa-IR') : null,
    };

    return NextResponse.json({
      success: true,
      registration: formattedRegistration
    });

  } catch (error) {
    console.error('❌ Error fetching registration details:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت جزئیات فرم' },
      { status: 500 }
    );
  }
}