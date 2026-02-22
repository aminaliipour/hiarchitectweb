import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const projectsDir = path.join(process.cwd(), 'public', 'images', 'projects');
    
    if (!fs.existsSync(projectsDir)) {
      return NextResponse.json({
        status: 'error',
        message: 'Projects directory not found'
      });
    }

    const projectFolders = fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const results = [];

    for (const folderName of projectFolders) {
      const projectDir = path.join(projectsDir, folderName);
      const infoFilePath = path.join(projectDir, 'project-info.json');
      
      // Count actual image files
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const allFiles = fs.readdirSync(projectDir);
      const imageFiles = allFiles.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      });

      let projectInfo = null;
      let jsonImages = 0;
      
      if (fs.existsSync(infoFilePath)) {
        try {
          const infoContent = fs.readFileSync(infoFilePath, 'utf8');
          projectInfo = JSON.parse(infoContent);
          jsonImages = projectInfo.images ? projectInfo.images.length : 0;
        } catch (error) {
          console.error(`Error parsing ${folderName}:`, error);
        }
      }

      results.push({
        project: folderName,
        actualImages: imageFiles.length,
        jsonImages: jsonImages,
        hasDuplication: jsonImages > 0 && imageFiles.length > 0,
        cleaned: projectInfo?.cleaned_at ? true : false,
        cleanedAt: projectInfo?.cleaned_at || null
      });
    }

    const duplicatedProjects = results.filter(r => r.hasDuplication);
    const cleanedProjects = results.filter(r => r.cleaned);

    return NextResponse.json({
      status: 'success',
      summary: {
        totalProjects: results.length,
        duplicatedProjects: duplicatedProjects.length,
        cleanedProjects: cleanedProjects.length,
        needsCleaning: duplicatedProjects.length
      },
      projects: results
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
