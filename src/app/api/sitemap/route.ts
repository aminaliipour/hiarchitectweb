import { NextResponse } from 'next/server';
import { getProjects } from '../../lib/projects';

export async function GET() {
  const projects = getProjects();
  const baseUrl = 'https://hiarchitect.ir';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      url: `${baseUrl}/#about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: `${baseUrl}/#portfolio`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      url: `${baseUrl}/#services`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: `${baseUrl}/#contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    }
  ];

  const projectPages = projects.map(project => ({
    url: `${baseUrl}/project/${encodeURIComponent(project.slug)}`,
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.7'
  }));

  const allPages = [...staticPages, ...projectPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, must-revalidate'
    }
  });
}
