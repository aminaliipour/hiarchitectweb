import { NextRequest, NextResponse } from 'next/server';
import { connectDB, RegistrationForm } from '@/lib/database';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

// Safe JSON parsing helper
function safeJSONParse(value: string | null, fallback: any = null): any {
  if (!value || value === 'null' || value === 'undefined') {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    console.log('⚠️ JSON parse error for value:', value, error);
    return fallback;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Extended registration form submission started...');

    await connectDB();

    const formData = await request.formData();
    console.log('📋 Form data received, processing...');

    // Extract all form fields
    const registrationData = {
      full_name: formData.get('full_name') as string,
      birth_date: formData.get('birth_date') ? new Date(formData.get('birth_date') as string) : undefined,
      national_id: formData.get('national_id') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      mobile: formData.get('mobile') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string || undefined,

      education_level: formData.get('education_level') as string || undefined,
      field_of_study: formData.get('field_of_study') as string || undefined,
      university: formData.get('university') as string || undefined,
      graduation_year: formData.get('graduation_year') ? parseInt(formData.get('graduation_year') as string) : undefined,
      gpa: formData.get('gpa') ? parseFloat(formData.get('gpa') as string) : undefined,

      work_experience_years: formData.get('work_experience_years') ? parseInt(formData.get('work_experience_years') as string) : undefined,
      current_position: formData.get('current_position') as string || undefined,

      skills: safeJSONParse(formData.get('skills') as string, []),
      software_proficiency: safeJSONParse(formData.get('software_proficiency') as string, []),
      languages: safeJSONParse(formData.get('languages') as string, []),
      has_portfolio: formData.get('has_portfolio') === 'true',
      portfolio_url: formData.get('portfolio_url') as string || undefined,
      project_types: safeJSONParse(formData.get('project_types') as string, []),

      preferred_position: formData.get('preferred_position') as string || undefined,
      salary_expectation: formData.get('salary_expectation') as string || undefined,
      availability_date: formData.get('availability_date') ? new Date(formData.get('availability_date') as string) : undefined,
      work_schedule_preference: formData.get('work_schedule_preference') as string || undefined,

      cover_letter: formData.get('cover_letter') as string || undefined,
      additional_notes: formData.get('additional_notes') as string || undefined,

      status: 'pending'
    };

    console.log('✅ Form data extracted:', {
      name: registrationData.full_name,
      email: registrationData.email,
      mobile: registrationData.mobile
    });

    // Validate required fields
    if (!registrationData.full_name || !registrationData.email || !registrationData.mobile) {
      return NextResponse.json(
        { error: 'نام و نام خانوادگی، ایمیل و شماره موبایل الزامی است' },
        { status: 400 }
      );
    }

    // Handle file uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'registrations');
    const files = {
      resume: undefined as string | undefined,
      portfolio: undefined as string | undefined,
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
    for (let i = 0; i < 10; i++) {
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

    // Add files to registration data
    const finalData = {
      ...registrationData,
      resume_file: files.resume,
      portfolio_file: files.portfolio,
      certificates: files.certificates
    };

    console.log('💾 Saving to MongoDB...');

    const registration = await RegistrationForm.create(finalData);

    console.log('✅ Registration saved successfully:', registration._id);

    return NextResponse.json({
      success: true,
      message: 'فرم ثبت نام با موفقیت ارسال شد',
      id: registration._id,
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
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await RegistrationForm.countDocuments(filter);

    // Get data
    const registrations = await RegistrationForm.find(filter)
      .select('full_name email mobile education_level work_experience_years preferred_position status created_at updated_at')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: registrations,
      registrations, // For backward compatibility
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
      {
        success: false,
        error: 'خطا در دریافت لیست فرم‌ها',
        message: error instanceof Error ? error.message : 'خطای نامشخص',
        data: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      },
      { status: 500 }
    );
  }
}