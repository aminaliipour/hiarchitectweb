import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { generatePersianPDF, type RegistrationData } from '../../../../lib/persianPdfGenerator';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'شناسه فرم الزامی است' }, { status: 400 });
    }

    // دریافت اطلاعات فرم از دیتابیس
    const result = await pool.query(
      'SELECT * FROM extended_registration_forms WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'فرم یافت نشد' }, { status: 404 });
    }

    const registration: RegistrationData = result.rows[0];

    // تولید PDF با استفاده از Persian PDF Generator
    const pdfOutput = await generatePersianPDF(registration);
    
    // Create safe filename with person's name (transliterate Persian to English)
    const persianToEnglishMap: { [key: string]: string } = {
      'آ': 'a', 'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch',
      'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's',
      'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f',
      'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h',
      'ی': 'y', 'ء': '', 'ئ': 'y', 'ؤ': 'v', 'إ': 'a', 'أ': 'a', 'ة': 'h'
    };
    
    const transliterate = (text: string): string => {
      return text.split('').map(char => persianToEnglishMap[char] || char).join('');
    };
    
    const safeName = registration.full_name 
      ? transliterate(registration.full_name)
          .replace(/[^a-zA-Z0-9\s]/g, '') // Keep only English letters, numbers and spaces
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .toLowerCase()
          .trim()
      : 'registration';
    
    const safeFileName = `${safeName}-${id}.pdf`;
    
    return new NextResponse(pdfOutput, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFileName}"`,
      },
    });
    
  } catch (error) {
    console.error('خطا در تولید PDF:', error);
    return NextResponse.json(
      { error: 'خطا در تولید PDF' },
      { status: 500 }
    );
  }
}