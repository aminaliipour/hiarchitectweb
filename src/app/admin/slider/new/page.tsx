"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageCropper from "../../../components/ImageCropper";

interface Project {
  id: string;
  title: string;
  slug: string;
  category_name?: string;
}

export default function NewSliderPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [location, setLocation] = useState("");
  const [architect, setArchitect] = useState("");
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState(1);
  const [projectLink, setProjectLink] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showCropper, setShowCropper] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [cropData, setCropData] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  } | null>(null);

  // Load projects for linking
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch('/api/projects?status=published&limit=100');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      } else {
        console.error('Failed to load projects');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setOriginalImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (newCropData: {
    x: number;
    y: number;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  }) => {
    console.log('🖼️ Crop completed with data:', newCropData);
    setCropData(newCropData);
    setShowCropper(false);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImage(null);
    setOriginalImage(null);
    setImagePreview("");
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started');
    console.log('📝 Form data:', { title, subtitle, location, architect, category, order, image: image ? { name: image.name, size: image.size, type: image.type } : null });
    
    if (!title || !image) {
      console.log('❌ Validation failed:', { title: !!title, image: !!image });
      setMessage("لطفاً عنوان و تصویر را وارد کنید");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('location', location);
      formData.append('architect', architect);
      formData.append('category', category);
      formData.append('order', order.toString());
      formData.append('project_link', projectLink);
      formData.append('image', image);

      console.log('📤 Sending FormData:', { title, subtitle, location, architect, category, order, projectLink, imageName: image.name });

      const response = await fetch('/api/sliders', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      console.log('📨 Response status:', response.status);
      const data = await response.json();
      console.log('📨 Response data:', data);

      if (response.ok) {
        setMessage("اسلاید با موفقیت اضافه شد");
        setTimeout(() => {
          router.push('/admin/slider');
        }, 2000);
      } else {
        setMessage(data.error || "خطا در افزودن اسلاید");
      }
    } catch (error) {
      console.error('Error uploading slider:', error);
      setMessage("خطا در آپلود اسلاید");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
              بازگشت
            </button>
            <h1 className="text-3xl font-bold text-[#D4AF37]">افزودن اسلاید جدید</h1>
            <p className="text-gray-400">تصویر جدید برای اسلایدر صفحه اصلی</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('موفقیت') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-900 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                عنوان اسلاید *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                placeholder="عنوان اسلاید را وارد کنید"
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                زیرعنوان
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                placeholder="زیرعنوان اسلاید (اختیاری)"
              />
            </div>

            {/* Category and Order Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  دسته‌بندی
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  <option value="تجاری">تجاری</option>
                  <option value="مسکونی">مسکونی</option>
                  <option value="ویلایی">ویلایی</option>
                  <option value="اداری">اداری</option>
                  <option value="صنعتی">صنعتی</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ترتیب نمایش
                </label>
                <input
                  type="number"
                  min="1"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  placeholder="ترتیب نمایش"
                />
                <p className="text-xs text-gray-500 mt-1">
                  عدد کمتر = نمایش زودتر
                </p>
              </div>
            </div>

            {/* Project Link Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                لینک پروژه (اختیاری)
              </label>
              {loadingProjects ? (
                <div className="flex items-center text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D4AF37] mr-2"></div>
                  در حال بارگیری پروژه‌ها...
                </div>
              ) : (
                <select
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                >
                  <option value="">انتخاب پروژه (اختیاری)</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.slug}>
                      {project.title} {project.category_name && `- ${project.category_name}`}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-gray-500 mt-1">
                اگر انتخاب کنید، کلیک روی اسلایدر به صفحه پروژه منتقل می‌شود
              </p>
            </div>

            {/* Location and Architect Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  موقعیت
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  placeholder="مثال: لاهیجان، گیلان"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  معمار
                </label>
                <input
                  type="text"
                  value={architect}
                  onChange={(e) => setArchitect(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  placeholder="نام معمار یا استودیو"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                تصویر اسلاید *
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-black hover:file:bg-[#b8941f]"
                  required
                />
                <p className="text-xs text-gray-500">
                  هر نوع فایلی قابل آپلود است - بدون محدودیت فرمت یا حجم
                </p>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-300">پیش‌نمایش:</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => imagePreview && setShowCropper(true)}
                          className="px-3 py-1 text-xs bg-[#D4AF37] text-black rounded hover:bg-[#b8941f] transition-colors"
                        >
                          ویرایش تصویر
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setOriginalImage(null);
                            setImagePreview("");
                            // Reset file input
                            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          حذف تصویر
                        </button>
                      </div>
                    </div>
                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-800">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    در حال آپلود...
                  </>
                ) : (
                  'افزودن اسلاید'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                لغو
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && imagePreview && (
        <ImageCropper
          src={imagePreview}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          initialAspectRatio={16/9}
        />
      )}
    </div>
  );
}
