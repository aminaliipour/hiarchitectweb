import { NextResponse } from 'next/server';
import { getProjects } from '../lib/projects';

export async function GET() {
  const baseUrl = 'https://hiarchitect.ir';
  const currentDate = new Date().toISOString().split('T')[0];
  const projects = getProjects();

  const pages = [
    {
      url: `${baseUrl}/`,
      changefreq: 'daily',
      priority: '1.0',
    },
    {
      url: `${baseUrl}/registration`,
      changefreq: 'weekly',
      priority: '0.6',
    },
  ];

  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/project/${encodeURIComponent(project.slug)}`,
    changefreq: 'monthly',
    priority: '0.8',
  }));

  const allPages = [...pages, ...projectPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allPages
    .map(
      (page) => `  <url>\n    <loc>${page.url}</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`
    )
    .join('\n')}\n</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
}
