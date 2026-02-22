'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../components/auth-layout';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);

  // دریافت دسته‌بندی‌ها
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        console.log('Fetching categories...');
        const response = await fetch('/api/projects/categories', {
          credentials: 'include'
        });
        
        console.log('Categories response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Categories data:', data);
          setCategories(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch categories:', response.status);
          setCategories([]);
        }
      } catch (error) {
        console.error('خطا در دریافت دسته‌بندی‌ها:', error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // اضافه کردن تصاویر به FormData
    if (selectedImages && selectedImages.length > 0) {
      Array.from(selectedImages).forEach((file, index) => {
        formData.append(`images`, file);
      });
    }

    try {
      console.log('Submitting form data...');
      const response = await fetch('/api/projects', {
        method: 'POST',
        credentials: 'include', // استفاده از cookie authentication
        body: formData
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Success result:', result);
        alert('پروژه با موفقیت اضافه شد!');
        router.push('/admin/projects');
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        try {
          const error = JSON.parse(errorText);
          alert(`خطا: ${error.message || error.error || 'مشکلی در ایجاد پروژه رخ داد'}`);
        } catch {
          alert(`خطا: ${errorText || 'مشکلی در ایجاد پروژه رخ داد'}`);
        }
      }
    } catch (error) {
      console.error('خطا در ارسال فرم:', error);
      alert('خطا در ارسال اطلاعات: ' + (error instanceof Error ? error.message : 'نامشخص'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImages(e.target.files);
    }
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button
            onClick={() => router.push('/admin/projects')}
            className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            <span>بازگشت به مدیریت پروژه‌ها</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            افزودن پروژه جدید
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* عنوان پروژه */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان پروژه *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="عنوان پروژه را وارد کنید"
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
              placeholder="مثال: villa-shomal"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              فقط از حروف انگلیسی، اعداد و خط تیره استفاده کنید
            </p>
          </div>

          {/* دسته‌بندی */}
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              دسته‌بندی *
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">
                {categoriesLoading ? 'در حال بارگذاری...' : 'انتخاب دسته‌بندی...'}
              </option>
              {!categoriesLoading && categories && categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))
              ) : (
                !categoriesLoading && (
                  <option disabled>هیچ دسته‌بندی‌ای موجود نیست</option>
                )
              )}
            </select>
          </div>

          {/* توضیحات */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              توضیحات
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="توضیح کوتاهی از پروژه..."
            />
          </div>

          {/* مساحت */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                مساحت (متر مربع)
              </label>
              <input
                type="number"
                id="area"
                name="area"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="120"
              />
            </div>

            {/* سال */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                سال اجرا
              </label>
              <input
                type="number"
                id="year"
                name="year"
                min="1300"
                max="1500"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="1403"
              />
              <p className="text-xs text-gray-500 mt-1">
                سال شمسی (مثال: ۱۳۹۰، ۱۴۰۳)
              </p>
            </div>
          </div>

          {/* موقعیت */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              موقعیت
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="لاهیجان، گیلان"
            />
          </div>

          {/* مختصات جغرافیایی */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                عرض جغرافیایی (Latitude)
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="37.207077"
              />
              <p className="text-xs text-gray-500 mt-1">
                مثال: 37.207077 (استفاده از openstreetmap.org)
              </p>
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                طول جغرافیایی (Longitude)
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="50.009334"
              />
              <p className="text-xs text-gray-500 mt-1">
                مثال: 50.009334 (استفاده از openstreetmap.org)
              </p>
            </div>
          </div>

          {/* راهنمای دریافت مختصات */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              🗺️ راهنمای دریافت مختصات:
            </h4>
            <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>1. به سایت <a href="https://www.openstreetmap.org" target="_blank" className="underline">openstreetmap.org</a> بروید</li>
              <li>2. موقعیت پروژه را روی نقشه پیدا کنید</li>
              <li>3. روی موقعیت راست کلیک کنید</li>
              <li>4. گزینه "Show address" را انتخاب کنید</li>
              <li>5. مختصات نمایش داده شده را در فیلدهای بالا وارد کنید</li>
            </ol>
          </div>

          {/* تصاویر */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تصاویر پروژه
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              می‌توانید چندین فایل انتخاب کنید - هیچ محدودیتی در فرمت یا حجم وجود ندارد
            </p>
            {selectedImages && selectedImages.length > 0 && (
              <p className="text-sm text-green-600 mt-1">
                {selectedImages.length} تصویر انتخاب شده
              </p>
            )}
          </div>

          {/* دکمه‌ها */}
          <div className="flex justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
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
              <span>{loading ? 'در حال ذخیره...' : 'ذخیره پروژه'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </AuthLayout>
  );
}
