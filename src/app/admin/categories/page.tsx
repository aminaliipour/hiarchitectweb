'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/auth-layout';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // دریافت دسته‌بندی‌ها
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/projects/categories', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setCategories(Array.isArray(data) ? data : []);
        } else {
          console.error('خطا در دریافت دسته‌بندی‌ها');
          setCategories([]);
        }
      } catch (error) {
        console.error('خطا در دریافت دسته‌بندی‌ها:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`آیا از حذف دسته‌بندی "${name}" اطمینان دارید؟`)) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/categories?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setCategories(categories.filter(cat => cat.id !== id));
        alert('دسته‌بندی با موفقیت حذف شد');
      } else {
        const error = await response.json();
        alert(`خطا در حذف: ${error.message}`);
      }
    } catch (error) {
      console.error('خطا در حذف دسته‌بندی:', error);
      alert('خطا در حذف دسته‌بندی');
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            مدیریت دسته‌بندی‌ها
          </h1>
        </div>
        <button
          onClick={() => router.push('/admin/categories/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          افزودن دسته‌بندی جدید
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <div className="text-4xl mb-4">🏷️</div>
            <h3 className="text-lg font-medium mb-2">دسته‌بندی وجود ندارد</h3>
            <p className="text-sm mb-6">هنوز دسته‌بندی‌ای ایجاد نشده است</p>
            <button
              onClick={() => router.push('/admin/categories/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              افزودن اولین دسته‌بندی
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories && categories.length > 0 && categories.map((category) => (
                <div key={category.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h4>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="حذف دسته‌بندی"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    اسلاگ: {category.slug}
                  </p>
                  {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {category.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
              {categories?.length || 0} دسته‌بندی موجود
            </div>
          </div>
        )}
      </div>
    </div>
    </AuthLayout>
  );
}
