import fs from 'fs';
import path from 'path';

export interface Project {
  id: string;
  title: string;
  category: string;
  mainImage: string;
  images: string[];
  description: string;
  slug: string;
}

export function getProjects(): Project[] {
  const projectsPath = path.join(process.cwd(), 'public', 'images', 'projects');
  const projects: Project[] = [];
  let projectId = 1;

  try {
    // خواندن کتگوری‌ها
    const categories = fs.readdirSync(projectsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const category of categories) {
      const categoryPath = path.join(projectsPath, category);
      
      // خواندن پروژه‌های هر کتگوری
      const projectFolders = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const projectFolder of projectFolders) {
        const projectPath = path.join(categoryPath, projectFolder);
        
        // خواندن عکس‌های پروژه
        const imageFiles = fs.readdirSync(projectPath)
          .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
          .sort(); // مرتب کردن تا عکس اول همیشه یکی باشه

        if (imageFiles.length > 0) {
          const slug = `${category}-${projectFolder}`
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-آ-ی]/g, '')
            .replace(/--+/g, '-')
            .replace(/^-|-$/g, '');

          const project: Project = {
            id: projectId.toString(),
            title: projectFolder,
            category: category,
            mainImage: encodeURI(`/images/projects/${category}/${projectFolder}/${imageFiles[0]}`),
            images: imageFiles.map(img => encodeURI(`/images/projects/${category}/${projectFolder}/${img}`)),
            description: `پروژه ${category} - ${projectFolder}`,
            slug: slug
          };

          projects.push(project);
          projectId++;
        }
      }
    }

    return projects;
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

export function getProjectBySlug(slug: string): Project | null {
  const projects = getProjects();
  return projects.find(project => project.slug === slug) || null;
}

export function getProjectCategories(): string[] {
  const projects = getProjects();
  const categories = [...new Set(projects.map(p => p.category))];
  return ['همه', ...categories];
}
