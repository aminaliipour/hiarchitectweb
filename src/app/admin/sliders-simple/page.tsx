"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Slider {
  id: string;
  title: string;
  projectSlug?: string;
  order: number;
  imageUrl: string;
  created: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  category_name?: string;
}

export default function SimpleSliderManagePage() {
  const router = useRouter();
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  
  // فرم آپلود
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadProjectSlug, setUploadProjectSlug] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSliders();
    fetchProjects();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sliders-simple');
      if (response.ok) {
        const data = await response.json();
        setSliders(data.sliders || []);
      } else {
        setMessage("خطا در بارگذاری اسلایدرها");
      }
    } catch (error) {
      console.error('خطا در دریافت اسلایدرها:', error);
      setMessage("خطا در بارگذاری اسلایدرها");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?status=published&limit=100');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('خطا در دریافت پروژه‌ها:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadImage || !uploadTitle) {
      setMessage("لطفا تصویر و عنوان را وارد کنید");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', uploadImage);
      formData.append('title', uploadTitle);
      if (uploadProjectSlug) {
        formData.append('projectSlug', uploadProjectSlug);
      }

      const response = await fetch('/api/sliders-simple', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setMessage("اسلایدر با موفقیت افزوده شد");
        setShowUploadForm(false);
        resetUploadForm();
        fetchSliders();
      } else {
        const data = await response.json();
        setMessage(data.error || "خطا در آپلود اسلایدر");
      }
    } catch (error) {
      console.error('خطا در آپلود:', error);
      setMessage("خطا در آپلود اسلایدر");
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadImage(null);
    setUploadTitle("");
    setUploadProjectSlug("");
    setImagePreview("");
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این اسلاید اطمینان دارید؟')) return;

    try {
      const response = await fetch(`/api/sliders-simple?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage("اسلایدر با موفقیت حذف شد");
        fetchSliders();
      } else {
        const data = await response.json();
        setMessage(data.error || "خطا در حذف اسلایدر");
      }
    } catch (error) {
      console.error('خطا در حذف:', error);
      setMessage("خطا در حذف اسلایدر");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
              بازگشت به داشبورد
            </button>
            <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">مدیریت اسلایدرها</h1>
            <p className="text-gray-400">مدیریت اسلایدرهای صفحه اصلی</p>
          </div>
          
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {showUploadForm ? 'بستن فرم' : 'افزودن اسلاید جدید'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('موفقیت') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
          }`}>
            {message}
            <button 
              onClick={() => setMessage("")}
              className="float-left text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#D4AF37] mb-6">افزودن اسلاید جدید</h2>
            
            <form onSubmit={handleUpload} className="space-y-6">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={imagePreview}
                    alt="پیش‌نمایش"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  تصویر اسلایدر *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">فرمت‌های مجاز: JPG, PNG, WebP</p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  عنوان اسلایدر *
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="عنوان اسلایدر را وارد کنید"
                  required
                />
              </div>

              {/* Project Link */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  لینک به پروژه (اختیاری)
                </label>
                <select
                  value={uploadProjectSlug}
                  onChange={(e) => setUploadProjectSlug(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="">بدون لینک</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.slug}>
                      {project.title} {project.category_name ? `(${project.category_name})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  در صورت انتخاب، با کلیک روی اسلایدر به صفحه پروژه هدایت می‌شوید
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'در حال آپلود...' : 'افزودن اسلایدر'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    resetUploadForm();
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-400">تعداد اسلایدرها</p>
              <p className="text-2xl font-semibold text-white">{sliders.length}</p>
            </div>
          </div>
        </div>

        {/* Sliders List */}
        {sliders.length > 0 ? (
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#D4AF37] mb-6">اسلایدهای موجود</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sliders.map((slider) => (
                <div key={slider.id} className="relative group">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={slider.imageUrl}
                      alt={slider.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(slider.id)}
                        className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        title="حذف اسلاید"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-white truncate">{slider.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/20 px-2 py-1 rounded">
                        ترتیب: {slider.order}
                      </span>
                      {slider.projectSlug && (
                        <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          لینک به پروژه
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <div className="text-6xl mb-6 opacity-50">🖼️</div>
            <h3 className="text-xl font-medium text-white mb-2">هیچ اسلایدری یافت نشد</h3>
            <p className="text-gray-400 mb-6">هنوز هیچ اسلایدری افزوده نشده است</p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors"
            >
              افزودن اولین اسلاید
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
