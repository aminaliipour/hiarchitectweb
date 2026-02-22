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
        const error = await response.json();
        alert(`خطا در حذف: ${error.message}`);
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
              className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
              <span>بازگشت به داشبورد</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مدیریت پروژه‌ها</h1>
          </div>
          <button
            onClick={() => router.push('/admin/projects/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            افزودن پروژه جدید
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="mr-3 text-gray-600 dark:text-gray-400">در حال بارگذاری...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">هیچ پروژه‌ای یافت نشد</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              با کلیک روی دکمه &ldquo;افزودن پروژه جدید&rdquo; اولین پروژه خود را اضافه کنید.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/admin/projects/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                افزودن پروژه جدید
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    عنوان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    اسلاگ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    مساحت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    سال
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    موقعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {project.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {project.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {project.area ? `${project.area} متر مربع` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {project.year || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {project.location || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        project.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {project.status === 'active' ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 space-x-reverse">
                      <button
                        onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => router.push(`/admin/projects/${project.id}/images`)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        تصاویر
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
