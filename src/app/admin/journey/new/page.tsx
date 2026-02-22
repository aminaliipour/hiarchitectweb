'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/admin-layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, X } from 'lucide-react';
import Image from 'next/image';

export default function NewJourneyMilestone() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    image_url: '',
    video_url: '',
    hotspot_x: 50,
    hotspot_y: 50,
    sort_order: 0,
    is_slideshow: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.year || !formData.title || !formData.description) {
      alert('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    setLoading(true);
    try {
      // حذف فیلد is_slideshow از داده‌های ارسالی
      const { is_slideshow, ...submitData } = formData;
      
      const response = await fetch('/api/journey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        alert('مرحله سفر با موفقیت اضافه شد');
        router.push('/admin/journey');
      } else {
        alert('خطا: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating milestone:', error);
      alert('خطا در ایجاد مرحله سفر');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'journey');

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, image_url: data.url }));
        setImagePreview(data.url);
      } else {
        alert('خطا در آپلود تصویر: ' + data.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('خطا در آپلود تصویر');
    }
  };

  return (
    <AdminLayout title="افزودن مرحله جدید">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">افزودن مرحله جدید</h1>
              <p className="text-gray-600">یک مرحله جدید به سفر شرکت اضافه کنید</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سال / برچسب *
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="مثال: 1395، معرفی، تیم"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ترتیب نمایش
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="عنوان مرحله"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="توضیحات کامل در مورد این مرحله"
                required
              />
            </div>

            {/* Slideshow Option */}
            <div>
              <label className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  checked={formData.is_slideshow}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_slideshow: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  اسلایدشو (امکان اضافه کردن چندین اسلاید)
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                اگر این گزینه فعال باشد، بعد از ایجاد می‌توانید اسلایدها را اضافه کنید
              </p>
            </div>

            {/* Media - فقط زمانی نمایش داده شود که slideshow غیرفعال باشد */}
            {!formData.is_slideshow && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">رسانه</h3>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تصویر
                </label>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={imagePreview}
                        alt="پیش‌نمایش"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image_url: '' }));
                        }}
                        className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 ml-2" />
                      آپلود تصویر
                    </label>
                    
                    <span className="text-sm text-gray-500">یا</span>
                    
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, image_url: e.target.value }));
                        setImagePreview(e.target.value);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="لینک تصویر"
                    />
                  </div>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  لینک ویدیو (اختیاری)
                </label>
                <input
                  type="text"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>
            )}

            {/* Hotspot Position - فقط زمانی نمایش داده شود که slideshow غیرفعال باشد */}
            {!formData.is_slideshow && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">موقعیت نقطه تعاملی</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    موقعیت افقی (درصد)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.hotspot_x}
                    onChange={(e) => setFormData(prev => ({ ...prev, hotspot_x: parseInt(e.target.value) || 50 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    موقعیت عمودی (درصد)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.hotspot_y}
                    onChange={(e) => setFormData(prev => ({ ...prev, hotspot_y: parseInt(e.target.value) || 50 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                انصراف
              </button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'در حال ذخیره...' : 'ذخیره مرحله'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
