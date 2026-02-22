import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost', 
  database: process.env.DB_NAME || 'hidb',
  password: process.env.DB_PASSWORD || 'admin@123',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Extended registration form submission started...');
    
    const formData = await request.formData();
    console.log('📋 Form data received, processing...');
    
    // Extract all form fields based on extended schema
    const registrationData = {
      // Personal Information
      full_name: formData.get('full_name') as string,
      birth_date: formData.get('birth_date') as string || null,
      national_id: formData.get('national_id') as string || null,
      phone: formData.get('phone') as string || null,
      mobile: formData.get('mobile') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string || null,
      
      // Behavioral Questions
      digital_interests: formData.get('digital_interests') ? JSON.parse(formData.get('digital_interests') as string) : [],
      first_salary_plan: formData.get('first_salary_plan') as string || null,
      shopping_preference: formData.get('shopping_preference') as string || null,
      attractive_traits: formData.get('attractive_traits') ? JSON.parse(formData.get('attractive_traits') as string) : [],
      mountain_path_choice: formData.get('mountain_path_choice') as string || null,
      free_time_activity: formData.get('free_time_activity') as string || null,
      work_mistake_reaction: formData.get('work_mistake_reaction') as string || null,
      soup_preference: formData.get('soup_preference') as string || null,
      workspace_cleanliness: formData.get('workspace_cleanliness') as string || null,
      previous_work_environment: formData.get('previous_work_environment') as string || null,
      colleague_problem_help: formData.get('colleague_problem_help') as string || null,
      colleague_oversight: formData.get('colleague_oversight') as string || null,
      overtime_request_reaction: formData.get('overtime_request_reaction') as string || null,
      rejection_reaction: formData.get('rejection_reaction') as string || null,
      
      // Educational Information
      education_level: formData.get('education_level') as string || null,
      field_of_study: formData.get('field_of_study') as string || null,
      university: formData.get('university') as string || null,
      graduation_year: formData.get('graduation_year') as string || null,
      gpa: formData.get('gpa') as string || null,
      
      // Work Experience
      work_experience_years: formData.get('work_experience_years') as string || null,
      current_position: formData.get('current_position') as string || null,
      work_history: formData.get('work_history') ? JSON.parse(formData.get('work_history') as string) : [],
      
      // Extended Questions
      why_join_company: formData.get('why_join_company') as string || null,
      criticism_opinion: formData.get('criticism_opinion') as string || null,
      teamwork_budget: formData.get('teamwork_budget') as string || null,
      improvement_suggestion: formData.get('improvement_suggestion') as string || null,
      group_criticism: formData.get('group_criticism') as string || null,
      group_management: formData.get('group_management') as string || null,
      employment_reason: formData.get('employment_reason') as string || null,
      goals_and_plans: formData.get('goals_and_plans') as string || null,
      customer_service: formData.get('customer_service') as string || null,
      salary_choice: formData.get('salary_choice') as string || null,
      company_research: formData.get('company_research') as string || null,
      skill_opinion: formData.get('skill_opinion') as string || null,
      career_goal: formData.get('career_goal') as string || null,
      
      // Personal Reflection
      worst_work_day: formData.get('worst_work_day') as string || null,
      best_work_day: formData.get('best_work_day') as string || null,
      biggest_work_challenge: formData.get('biggest_work_challenge') as string || null,
      what_motivates: formData.get('what_motivates') as string || null,
      personal_strengths: formData.get('personal_strengths') as string || null,
      
      // Skills & Experience
      skills: formData.get('skills') ? JSON.parse(formData.get('skills') as string) : [],
      software_proficiency: formData.get('software_proficiency') ? JSON.parse(formData.get('software_proficiency') as string) : [],
      languages: formData.get('languages') ? JSON.parse(formData.get('languages') as string) : [],
      has_portfolio: formData.get('has_portfolio') === 'true',
      portfolio_url: formData.get('portfolio_url') as string || null,
      project_types: formData.get('project_types') ? JSON.parse(formData.get('project_types') as string) : [],
      
      // Career Preferences  
      preferred_position: formData.get('preferred_position') as string || null,
      salary_expectation: formData.get('salary_expectation') as string || null,
      availability_date: formData.get('availability_date') as string || null,
      work_schedule_preference: formData.get('work_schedule_preference') as string || null,
      
      // Additional Information
      cover_letter: formData.get('cover_letter') as string || null,
      additional_notes: formData.get('additional_notes') as string || null
    };

    console.log('✅ Form data extracted:', {
      name: registrationData.full_name,
      email: registrationData.email,
      fieldCount: Object.keys(registrationData).length
    });

    // Validate required fields
    if (!registrationData.full_name || !registrationData.email || !registrationData.mobile) {
      return NextResponse.json(
        { error: 'نام، ایمیل و شماره موبایل الزامی است' },
        { status: 400 }
      );
    }

    // Handle file uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'registrations');
    const files = {
      resume: null as string | null,
      portfolio: null as string | null,
      certificates: [] as string[]
    };

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.log('Upload directory already exists or created');
    }

    // Process resume file
    const resumeFile = formData.get('resume_file') as File;
    if (resumeFile && resumeFile.size > 0) {
      const fileName = `${Date.now()}-resume-${resumeFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      await writeFile(filePath, buffer);
      files.resume = `/uploads/registrations/${fileName}`;
      console.log('📄 Resume file saved:', fileName);
    }

    // Process portfolio file
    const portfolioFile = formData.get('portfolio_file') as File;
    if (portfolioFile && portfolioFile.size > 0) {
      const fileName = `${Date.now()}-portfolio-${portfolioFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await portfolioFile.arrayBuffer());
      await writeFile(filePath, buffer);
      files.portfolio = `/uploads/registrations/${fileName}`;
      console.log('🎨 Portfolio file saved:', fileName);
    }

    // Process certificate files
    for (let i = 0; i < 10; i++) { // Support up to 10 certificates
      const certFile = formData.get(`certificate_${i}`) as File;
      if (certFile && certFile.size > 0) {
        const fileName = `${Date.now()}-cert${i}-${certFile.name}`;
        const filePath = path.join(uploadDir, fileName);
        const buffer = Buffer.from(await certFile.arrayBuffer());
        await writeFile(filePath, buffer);
        files.certificates.push(`/uploads/registrations/${fileName}`);
        console.log(`🏆 Certificate ${i} saved:`, fileName);
      }
    }

    // Insert into database using extended table
    const query = `
      INSERT INTO extended_registration_forms (
        full_name, birth_date, national_id, phone, mobile, email, address,
        digital_interests, first_salary_plan, shopping_preference, attractive_traits,
        mountain_path_choice, free_time_activity, work_mistake_reaction, soup_preference,
        workspace_cleanliness, previous_work_environment, colleague_problem_help,
        colleague_oversight, overtime_request_reaction, rejection_reaction,
        education_level, field_of_study, university, graduation_year, gpa,
        work_experience_years, current_position, work_history,
        why_join_company, criticism_opinion, teamwork_budget, improvement_suggestion,
        group_criticism, group_management, employment_reason, goals_and_plans,
        customer_service, salary_choice, company_research, skill_opinion, career_goal,
        worst_work_day, best_work_day, biggest_work_challenge, what_motivates, personal_strengths,
        skills, software_proficiency, languages, has_portfolio, portfolio_url, project_types,
        preferred_position, salary_expectation, availability_date, work_schedule_preference,
        cover_letter, additional_notes, resume_file, portfolio_file, certificate_files
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38,
        $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56,
        $57, $58, $59
      ) RETURNING id, created_at
    `;

    const values = [
      registrationData.full_name,
      registrationData.birth_date,
      registrationData.national_id,
      registrationData.phone,
      registrationData.mobile,
      registrationData.email,
      registrationData.address,
      registrationData.digital_interests,
      registrationData.first_salary_plan,
      registrationData.shopping_preference,
      registrationData.attractive_traits,
      registrationData.mountain_path_choice,
      registrationData.free_time_activity,
      registrationData.work_mistake_reaction,
      registrationData.soup_preference,
      registrationData.workspace_cleanliness,
      registrationData.previous_work_environment,
      registrationData.colleague_problem_help,
      registrationData.colleague_oversight,
      registrationData.overtime_request_reaction,
      registrationData.rejection_reaction,
      registrationData.education_level,
      registrationData.field_of_study,
      registrationData.university,
      registrationData.graduation_year,
      registrationData.gpa,
      registrationData.work_experience_years,
      registrationData.current_position,
      registrationData.work_history,
      registrationData.why_join_company,
      registrationData.criticism_opinion,
      registrationData.teamwork_budget,
      registrationData.improvement_suggestion,
      registrationData.group_criticism,
      registrationData.group_management,
      registrationData.employment_reason,
      registrationData.goals_and_plans,
      registrationData.customer_service,
      registrationData.salary_choice,
      registrationData.company_research,
      registrationData.skill_opinion,
      registrationData.career_goal,
      registrationData.worst_work_day,
      registrationData.best_work_day,
      registrationData.biggest_work_challenge,
      registrationData.what_motivates,
      registrationData.personal_strengths,
      registrationData.skills,
      registrationData.software_proficiency,
      registrationData.languages,
      registrationData.has_portfolio,
      registrationData.portfolio_url,
      registrationData.project_types,
      registrationData.preferred_position,
      registrationData.salary_expectation,
      registrationData.availability_date,
      registrationData.work_schedule_preference,
      registrationData.cover_letter,
      registrationData.additional_notes,
      files.resume,
      files.portfolio,
      files.certificates
    ];

    console.log('💾 Inserting into database...');
    const result = await pool.query(query, values);
    
    console.log('✅ Registration saved successfully:', {
      id: result.rows[0].id,
      created_at: result.rows[0].created_at
    });

    return NextResponse.json({
      success: true,
      message: 'فرم ثبت نام با موفقیت ارسال شد',
      id: result.rows[0].id,
      files_uploaded: {
        resume: !!files.resume,
        portfolio: !!files.portfolio,
        certificates: files.certificates.length
      }
    });

  } catch (error) {
    console.error('❌ Registration submission error:', error);
    
    return NextResponse.json(
      { 
        error: 'خطا در ثبت فرم',
        details: error instanceof Error ? error.message : 'خطای نامشخص'
      },
      { status: 500 }
    );
  }
}

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
    
    // Data query
    paramCount++;
    const dataQuery = `
      SELECT 
        id, full_name, email, mobile, 
        education_level, work_experience_years, preferred_position,
        status, created_at, updated_at
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
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت لیست فرم‌ها' },
      { status: 500 }
    );
  }
}