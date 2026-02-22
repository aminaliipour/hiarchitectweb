import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('member_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'لطفاً وارد شوید' }, { status: 401 });
    }

    // Verify token
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    let decoded: any;
    
    try {
      decoded = jwt.verify(token, secret);
    } catch (error) {
      return NextResponse.json({ error: 'نشست شما منقضی شده است' }, { status: 401 });
    }

    const memberId = decoded.memberId;

    // Get member info to determine folder
    const memberQuery = `
      SELECT id, first_name, last_name, national_code
      FROM members 
      WHERE id = $1
    `;
    const memberResult = await pool.query(memberQuery, [memberId]);
    
    if (memberResult.rows.length === 0) {
      return NextResponse.json({ error: 'عضو یافت نشد' }, { status: 404 });
    }

    const member = memberResult.rows[0];
    let folderKey = (member.national_code || '').toString().trim().replace(/[^0-9]/g, '');
    
    if (!folderKey) {
      return NextResponse.json({ error: 'حساب کاربری شما نیاز به تکمیل دارد' }, { status: 400 });
    }

    // Get files from database
    const dbQuery = `
      SELECT 
        id,
        file_name,
        original_name,
        file_url,
        file_size,
        file_type,
        description,
        created_at
      FROM member_files
      WHERE member_id = $1
      ORDER BY created_at DESC
    `;

    const dbResult = await pool.query(dbQuery, [memberId]);
    let allFiles = [...dbResult.rows];

    // Check for manual files in the member's directory
    const memberDirPath = path.join(process.cwd(), 'public', 'files', folderKey);
    
    if (fs.existsSync(memberDirPath)) {
      const filesInDirectory = fs.readdirSync(memberDirPath);
      const dbFilenames = dbResult.rows.map(f => path.basename(f.file_url || ''));
      
      // Find files that exist in directory but not in database (manual uploads)
      const manualFiles = filesInDirectory.filter(filename => {
        return !dbFilenames.includes(filename) && !filename.startsWith('.');
      });

      // Add manual files to the result
      for (const filename of manualFiles) {
        const filePath = path.join(memberDirPath, filename);
        const stats = fs.statSync(filePath);
        
        // Create a database-like object for manual files
        const manualFile = {
          id: `manual_${filename}`,
          file_name: filename,
          original_name: filename,
          file_url: `/files/${folderKey}/${filename}`,
          file_size: stats.size,
          file_type: getMimeType(filename),
          description: 'فایل دستی',
          created_at: stats.ctime,
          is_manual: true
        };
        
        allFiles.push(manualFile);
      }
    }

    // Sort all files by creation date (newest first)
    allFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      files: allFiles,
      member_folder: `/files/${folderKey}/`,
      manual_files_count: allFiles.filter(f => f.is_manual).length,
      database_files_count: allFiles.filter(f => !f.is_manual).length
    });

  } catch (error: any) {
    console.error('Get member files error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت فایل‌ها' },
      { status: 500 }
    );
  }
}

// Helper function to get MIME type based on file extension
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}
