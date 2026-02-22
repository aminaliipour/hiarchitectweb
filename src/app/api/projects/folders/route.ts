import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// GET - List all project folders and their info
export async function GET(request: NextRequest) {
  try {
    const projectsBaseDir = path.join(process.cwd(), 'public', 'images', 'projects');
    
    // Check if projects directory exists
    if (!fs.existsSync(projectsBaseDir)) {
      return NextResponse.json({
        projects: [],
        totalProjects: 0
      });
    }

    const projectFolders = fs.readdirSync(projectsBaseDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const projectsData = [];

    for (const folderName of projectFolders) {
      const projectDir = path.join(projectsBaseDir, folderName);
      const infoFilePath = path.join(projectDir, 'project-info.json');
      
      let projectInfo: any = {
        slug: folderName,
        name: folderName,
        images: []
      };

      // Read project info if exists
      if (fs.existsSync(infoFilePath)) {
        try {
          const infoContent = fs.readFileSync(infoFilePath, 'utf8');
          projectInfo = JSON.parse(infoContent);
        } catch (error) {
          console.error(`Error parsing project info for ${folderName}:`, error);
        }
      }

      // Count actual image files
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const allFiles = fs.readdirSync(projectDir);
      const imageFiles = allFiles.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      });

      // Get main image
      const mainImageFile = imageFiles.find(file => file.startsWith('main-')) || imageFiles[0];
      const mainImageUrl = mainImageFile ? `/images/projects/${folderName}/${mainImageFile}` : null;

      projectsData.push({
        folderName: folderName,
        slug: projectInfo.slug || folderName,
        name: projectInfo.name || folderName,
        totalImages: imageFiles.length,
        mainImage: mainImageUrl,
        hasInfo: fs.existsSync(infoFilePath),
        lastUpdated: projectInfo.lastUpdated || null,
        created: projectInfo.created || null
      });
    }

    // Sort by last updated (most recent first)
    projectsData.sort((a, b) => {
      const dateA = new Date(a.lastUpdated || 0).getTime();
      const dateB = new Date(b.lastUpdated || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({
      projects: projectsData,
      totalProjects: projectsData.length,
      projectsDirectory: projectsBaseDir
    });

  } catch (error) {
    console.error('List projects error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت لیست پروژه‌ها' },
      { status: 500 }
    );
  }
}
