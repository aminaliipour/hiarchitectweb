'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/admin-layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, X, Plus, Edit, Trash2, Move } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface JourneySlide {
  id: string;
  milestone_id: string;
  title: string;
  description: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface JourneyMilestone {
  id: string;
  title: string;
  year: string;
}

export default function SlidesManagement({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [milestone, setMilestone] = useState<JourneyMilestone | null>(null);
  const [slides, setSlides] = useState<JourneySlide[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<JourneySlide | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  const [slideForm, setSlideForm] = useState({
    title: '',
    description: '',
    image_url: '',
    sort_order: 0
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadMilestone();
    loadSlides();
  }, [resolvedParams.id]);

  const loadMilestone = async () => {
    try {
      const response = await fetch(`/api/journey/${resolvedParams.id}`);
      const data = await response.json();
      
      if (data.success) {
        setMilestone(data.milestone);
      } else {
        alert('خطا در بارگذاری مرحله سفر');
        router.push('/admin/journey');
      }
    } catch (error) {
      console.error('Error loading milestone:', error);
      alert('خطا در بارگذاری مرحله سفر');
      router.push('/admin/journey');
    }
  };

  const loadSlides = async () => {
    try {
      const response = await fetch(`/api/journey/${resolvedParams.id}/slides?includeInactive=true`);
      const data = await response.json();
      
      if (data.success) {
        setSlides(data.slides || []);
      } else {
        console.error('Error loading slides:', data.error);
        setSlides([]);
      }
    } catch (error) {
      console.error('Error loading slides:', error);
      setSlides([]);
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
        setSlideForm(prev => ({ ...prev, image_url: data.url }));
        setImagePreview(data.url);
      } else {
        alert('خطا در آپلود تصویر: ' + data.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('خطا در آپلود تصویر');
    }
  };

  const handleSubmitSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slideForm.title || !slideForm.description) {
      alert('لطفاً عنوان و توضیحات را پر کنید');
      return;
    }

    setLoading(true);
    try {
      const url = editingSlide 
        ? `/api/journey/${resolvedParams.id}/slides/${editingSlide.id}`
        : `/api/journey/${resolvedParams.id}/slides`;
      
      const method = editingSlide ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...slideForm,
          sort_order: editingSlide ? editingSlide.sort_order : slides.length + 1
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(editingSlide ? 'اسلاید با موفقیت بروزرسانی شد' : 'اسلاید با موفقیت اضافه شد');
        resetForm();
        loadSlides();
      } else {
        alert('خطا: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('خطا در ذخیره اسلاید');
    } finally {
      setLoading(false);
    }
  };

  const deleteSlide = async (slideId: string) => {
    if (!confirm('آیا از حذف این اسلاید اطمینان دارید؟')) return;

    setDeleting(slideId);
    try {
      const response = await fetch(`/api/journey/${resolvedParams.id}/slides/${slideId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('اسلاید با موفقیت حذف شد');
        loadSlides();
      } else {
        alert('خطا در حذف اسلاید: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      alert('خطا در حذف اسلاید');
    } finally {
      setDeleting(null);
    }
  };

  const startEdit = (slide: JourneySlide) => {
    setEditingSlide(slide);
    setSlideForm({
      title: slide.title,
      description: slide.description,
      image_url: slide.image_url || '',
      sort_order: slide.sort_order
    });
    setImagePreview(slide.image_url || null);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setSlideForm({
      title: '',
      description: '',
      image_url: '',
      sort_order: 0
    });
    setImagePreview(null);
    setEditingSlide(null);
    setShowAddForm(false);
  };

  if (!milestone) {
    return (
      <AdminLayout title="مدیریت اسلایدها">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`مدیریت اسلایدها - ${milestone.title}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/admin/journey">
                <Button variant="outline" size="sm">
                  <ArrowRight className="w-4 h-4 ml-2" />
                  بازگشت
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">مدیریت اسلایدها</h1>
                <p className="text-gray-600">{milestone.year} - {milestone.title}</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 ml-2" />
              {showAddForm ? 'انصراف' : 'افزودن اسلاید'}
            </Button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingSlide ? 'ویرایش اسلاید' : 'اسلاید جدید'}
            </h3>
            
            <form onSubmit={handleSubmitSlide} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان *
                  </label>
                  <input
                    type="text"
                    value={slideForm.title}
                    onChange={(e) => setSlideForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="عنوان اسلاید"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تصویر
                  </label>
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
                      value={slideForm.image_url}
                      onChange={(e) => {
                        setSlideForm(prev => ({ ...prev, image_url: e.target.value }));
                        setImagePreview(e.target.value);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="لینک تصویر"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات *
                </label>
                <textarea
                  value={slideForm.description}
                  onChange={(e) => setSlideForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="توضیحات کامل اسلاید"
                  required
                />
              </div>

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
                      setSlideForm(prev => ({ ...prev, image_url: '' }));
                    }}
                    className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex justify-end space-x-4 space-x-reverse">
                <Button type="button" onClick={resetForm} variant="outline">
                  انصراف
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? 'در حال ذخیره...' : (editingSlide ? 'بروزرسانی' : 'ذخیره')}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Slides List */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            اسلایدها ({slides.length})
          </h3>

          {slides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">هنوز اسلایدی اضافه نشده است</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 ml-2" />
                اولین اسلاید را اضافه کنید
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide, index) => (
                <div key={slide.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {slide.image_url && (
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={slide.image_url}
                        alt={slide.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{slide.title}</h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {slide.description}
                    </p>
                    
                    <div className="flex justify-end space-x-2 space-x-reverse">
                      <button
                        onClick={() => startEdit(slide)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="ویرایش"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteSlide(slide.id)}
                        disabled={deleting === slide.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
