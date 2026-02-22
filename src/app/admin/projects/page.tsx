'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/auth-layout';

interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  area?: number;
  year?: number;
  location?: string;
  status: string;
  created_at: string;
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // دریافت پروژه‌ها از دیتابیس
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects?limit=100', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          
          // بررسی ساختار داده
          if (data.projects && Array.isArray(data.projects)) {
            setProjects(data.projects);
          } else if (Array.isArray(data)) {
            setProjects(data);
          } else {
            console.error('Unexpected data structure:', data);
            setProjects([]);
          }
        } else {
          console.error('Failed to fetch projects', response.status);
          setProjects([]);
        }
      } catch (error) {
        console.error('خطا در دریافت پروژه‌ها:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`آیا از حذف پروژه "${title}" اطمینان دارید؟`)) {
      return;
    }

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setProjects(projects.filter(project => project.id !== id));
        alert('پروژه با موفقیت حذف شد');
      } else {
        const errorData = await response.json();
        alert(`خطا در حذف: ${errorData.message || 'مشکل در حذف پروژه'}`);
      }
    } catch (error) {
      console.error('خطا در حذف پروژه:', error);
      alert('خطا در حذف پروژه');
    }
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center space-x-2 space-x-reverse text-gray-300 hover:text-[#D4AF37] transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
              <span>بازگشت به داشبورد</span>
            </button>
            <h1 className="text-3xl font-bold text-[#D4AF37]">
              مدیریت پروژه‌ها
            </h1>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={() => router.push('/admin/projects/images')}
              className="bg-green-600/80 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 backdrop-blur-sm"
            >
              مدیریت تصاویر
            </button>
            <button
              onClick={() => router.push('/admin/projects/new')}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-black px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
            >
              افزودن پروژه جدید
            </button>
          </div>
        </div>

        <div className="bg-gray-800/20 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-600/30">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
            <p className="text-gray-300">در حال بارگذاری پروژه‌ها...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-lg font-medium mb-2">هنوز پروژه‌ای وجود ندارد</h3>
            <p className="text-sm mb-6">برای شروع، اولین پروژه خود را اضافه کنید</p>
            <button
              onClick={() => router.push('/admin/projects/new')}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-black px-6 py-3 rounded-lg transition-colors duration-300 font-medium"
            >
              افزودن پروژه اول
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* لیست پروژه‌ها */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-700/30 backdrop-blur-sm p-6 rounded-lg border border-gray-600/30 hover:border-[#D4AF37]/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {project.title}
                    </h3>
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => router.push(`/project/${project.slug}`)}
                        className="text-[#D4AF37] hover:text-[#B8941F] transition-colors duration-300"
                        title="مشاهده پروژه"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                        title="ویرایش پروژه"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-300"
                        title="حذف پروژه"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300">
                      <strong>اسلاگ:</strong> {project.slug}
                    </p>
                    
                    {project.description && (
                      <p className="text-gray-400 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-4">
                      {project.area && <span>مساحت: {project.area} متر</span>}
                      {project.year && <span>سال: {project.year}</span>}
                      {project.location && <span>📍 {project.location}</span>}
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'published' 
                          ? 'bg-green-900/30 border border-green-600/30 text-green-300' 
                          : 'bg-yellow-900/30 border border-yellow-600/30 text-yellow-300'
                      }`}>
                        {project.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                      </span>
                      
                      <span className="text-xs text-gray-500">
                        {new Date(project.created_at).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center text-sm text-gray-400 mt-8">
              {projects.length} پروژه موجود
            </div>
          </div>
        )}
      </div>
    </div>
    </AuthLayout>
  );
}
