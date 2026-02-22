import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectSlug = searchParams.get('slug');
    
    if (!projectSlug) {
      return NextResponse.json({ error: 'Project slug is required' }, { status: 400 });
    }

    const safeProjectFolder = projectSlug.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
    const projectDir = path.join(process.cwd(), 'public', 'images', 'projects', safeProjectFolder);
    
    const info: {
      projectSlug: string;
      safeProjectFolder: string;
      projectDir: string;
      exists: boolean;
      files: Array<{
        name: string;
        size: number;
        created: Date;
        modified: Date;
        isFile: boolean;
      }>;
    } = {
      projectSlug,
      safeProjectFolder,
      projectDir,
      exists: fs.existsSync(projectDir),
      files: []
    };

    if (fs.existsSync(projectDir)) {
      const files = fs.readdirSync(projectDir);
      info.files = files.map(file => {
        const filePath = path.join(projectDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isFile: stats.isFile()
        };
      });
    }

    return NextResponse.json(info, {
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('File check error:', error);
    return NextResponse.json(
      { 
        error: 'Error checking files', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
