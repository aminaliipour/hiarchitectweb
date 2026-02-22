import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import path from 'path';
import { writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const memberId = formData.get('memberId') as string;
    const description = formData.get('description') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'فایل انتخاب نشده است' }, { status: 400 });
    }

    if (!memberId) {
      return NextResponse.json({ error: 'شناسه عضو مشخص نشده است' }, { status: 400 });
    }

    // Get member information to create folder with their national code
    const memberQuery = 'SELECT first_name, last_name, national_code FROM members WHERE id = $1';
    const memberResult = await pool.query(memberQuery, [memberId]);
    
    if (memberResult.rows.length === 0) {
      return NextResponse.json({ error: 'عضو پیدا نشد' }, { status: 404 });
    }

    const member = memberResult.rows[0];
    // Use ONLY national code as the folder key
    let folderKey = (member.national_code || '').toString().trim();
    // Sanitize to digits only
    folderKey = folderKey.replace(/[^0-9]/g, '');
    
    // If no national code, return error (we require national code for file management)
    if (!folderKey) {
      return NextResponse.json({ error: 'عضو باید دارای کد ملی باشد' }, { status: 400 });
    }

    // Validate file size (max 100MB - much larger limit for member files)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'حجم فایل نباید بیشتر از 100 مگابایت باشد' }, { status: 400 });
    }

  // Create member-specific directory path (by national code)
  const memberDirPath = path.join(process.cwd(), 'public', 'files', folderKey);
    
    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const fileName = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(memberDirPath, fileName);

    // Create member directory if it doesn't exist
    if (!fs.existsSync(memberDirPath)) {
      fs.mkdirSync(memberDirPath, { recursive: true });
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file to member's directory
    await writeFile(filePath, buffer);

    // Update file URL to match new directory structure
  const fileUrl = `/files/${folderKey}/${fileName}`;

    // Save file info to database
    const query = `
      INSERT INTO member_files (member_id, file_name, original_name, file_url, file_size, file_type, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      memberId,
      fileName,
      file.name,
      fileUrl,
      file.size,
      file.type,
      description
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: 'فایل با موفقیت آپلود شد',
      file: result.rows[0],
      memberFolder: folderKey
    });

  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'خطا در آپلود فایل' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json({ error: 'شناسه عضو مشخص نشده است' }, { status: 400 });
    }

    // Get member info first
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
      return NextResponse.json({ error: 'عضو باید دارای کد ملی باشد' }, { status: 400 });
    }

    // Get files from database
    const dbQuery = `
      SELECT 
        mf.*,
        m.first_name,
        m.last_name
      FROM member_files mf
      JOIN members m ON mf.member_id = m.id
      WHERE mf.member_id = $1
      ORDER BY mf.created_at DESC
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
          member_id: memberId,
          original_name: filename,
          stored_name: filename,
          file_url: `/files/${folderKey}/${filename}`,
          file_size: stats.size,
          file_type: getMimeType(filename),
          description: 'فایل دستی (خارج از سیستم اضافه شده)',
          created_at: stats.ctime,
          updated_at: stats.mtime,
          first_name: member.first_name,
          last_name: member.last_name,
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'شناسه فایل مشخص نشده است' }, { status: 400 });
    }

    // Get file info first
    const getFileQuery = 'SELECT * FROM member_files WHERE id = $1';
    const fileResult = await pool.query(getFileQuery, [fileId]);

    if (fileResult.rows.length === 0) {
      return NextResponse.json({ error: 'فایل یافت نشد' }, { status: 404 });
    }

    const file = fileResult.rows[0];

    // Delete file from filesystem
    const fs = require('fs');
    const filePath = path.join(process.cwd(), 'public', file.file_url);
    
    try {
      await fs.promises.unlink(filePath);
    } catch (fileError) {
      console.warn('Could not delete file from filesystem:', fileError);
    }

    // Delete from database
    const deleteQuery = 'DELETE FROM member_files WHERE id = $1';
    await pool.query(deleteQuery, [fileId]);

    return NextResponse.json({
      success: true,
      message: 'فایل با موفقیت حذف شد'
    });

  } catch (error: any) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { error: 'خطا در حذف فایل' },
      { status: 500 }
    );
  }
}
