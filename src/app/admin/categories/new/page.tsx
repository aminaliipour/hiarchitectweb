'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/auth-layout';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const categoryData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string
    };

    try {
      const response = await fetch('/api/projects/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(categoryData)
      });

      if (response.ok) {
        alert('دسته‌بندی با موفقیت اضافه شد!');
        router.push('/admin/categories');
      } else {
        const error = await response.json();
        alert(`خطا: ${error.message || 'مشکلی در ایجاد دسته‌بندی رخ داد'}`);
      }
    } catch (error) {
      console.error('خطا در ارسال فرم:', error);
      alert('خطا در ارسال اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button
            onClick={() => router.push('/admin/categories')}
            className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            <span>بازگشت به مدیریت دسته‌بندی‌ها</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            افزودن دسته‌بندی جدید
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* نام دسته‌بندی */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نام دسته‌بندی *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="مثال: صنعتی"
            />
          </div>

          {/* اسلاگ */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسلاگ (آدرس URL) *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="مثال: sanati"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              فقط از حروف انگلیسی، اعداد و خط تیره استفاده کنید
            </p>
          </div>

          {/* توضیحات */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              توضیحات
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="توضیح کوتاهی از این دسته‌بندی..."
            />
          </div>

          {/* دکمه‌ها */}
          <div className="flex justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={() => router.push('/admin/categories')}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 space-x-reverse"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              )}
              <span>{loading ? 'در حال ذخیره...' : 'ذخیره دسته‌بندی'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </AuthLayout>
  );
}
