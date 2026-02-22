"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  category_name: string;
  area?: string;
  year?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  main_image?: string;
}

interface ProjectImage {
  filename: string;
  url: string;
  isMainImage: boolean;
  size: number;
  uploadedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [message, setMessage] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category_id: "",
    area: "",
    year: "",
    location: "",
    latitude: "",
    longitude: "",
    status: "published"
  });

  useEffect(() => {
    fetchProjectData();
    fetchCategories();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      console.log('Fetching project with ID:', projectId); // Debug log
      
      // Get project info
      const response = await fetch(`/api/projects?id=${projectId}`, {
        credentials: 'include'
      });
      
      console.log('Project API response status:', response.status); // Debug log
      
      if (response.ok) {
        const data = await response.json();
        console.log('Project API response data:', data); // Debug log
        
        const projectData = data.projects?.[0];
        
        if (projectData) {
          console.log('Project data loaded:', projectData); // Debug log
          setProject(projectData);
          
          const newFormData = {
            title: projectData.title || "",
            slug: projectData.slug || "",
            description: projectData.description || "",
            category_id: projectData.category_id || "",
            area: String(projectData.area || ""),
            year: String(projectData.year || ""),
            location: projectData.location || "",
            latitude: String(projectData.latitude || ""),
            longitude: String(projectData.longitude || ""),
            status: projectData.status || "published"
          };
          
          console.log('Setting form data:', newFormData); // Debug log
          setFormData(newFormData);

          // Get project gallery
          const galleryResponse = await fetch(`/api/projects/gallery?slug=${projectData.slug}`, {
            credentials: 'include'
          });
          
          if (galleryResponse.ok) {
            const galleryData = await galleryResponse.json();
            setImages(galleryData.gallery || []);
          }
        } else {
          console.log('No project found in response'); // Debug log
          setMessage("پروژه یافت نشد");
        }
      } else {
        console.log('Project API failed with status:', response.status); // Debug log
        setMessage("خطا در بارگذاری اطلاعات پروژه");
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setMessage("خطا در بارگذاری اطلاعات پروژه");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/projects/categories');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Categories loaded:', data); // Debug log
        setCategories(data || []);
      } else {
        console.error('Categories API failed:', response.status);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    console.log(`Input changed: ${name} = ${value} (type: ${typeof value})`); // Debug log
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProject = async () => {
    console.log('=== Save Project Debug ===');
    console.log('Current formData:', formData);
    console.log('Project ID:', projectId);
    console.log('Project ID type:', typeof projectId);
    console.log('Project ID length:', projectId?.length);
    console.log('Is UUID format:', /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(projectId));
    console.log('Title value:', `"${formData.title}"`, 'Length:', formData.title?.length);
    console.log('Category ID value:', `"${formData.category_id}"`, 'Length:', formData.category_id?.length);

    if (!formData.title || !formData.category_id) {
      console.log('❌ Client validation failed:', { 
        title: formData.title || 'EMPTY', 
        category_id: formData.category_id || 'EMPTY',
        titleLength: formData.title?.length || 0,
        categoryLength: formData.category_id?.length || 0
      });
      setMessage("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }

    console.log('✅ Client validation passed');

    setSaving(true);
    setMessage("");

    try {
      // Find current main image from images state
      const currentMainImage = images.find(img => img.isMainImage);
      
      const requestBody = {
        title: (formData.title || '').trim(),
        description: (formData.description || '').trim() || null,
        category_id: formData.category_id,
        area: (formData.area || '').trim() || null,
        year: (formData.year || '').trim() || null,
        location: (formData.location || '').trim() || null,
        latitude: (formData.latitude || '').trim() || null,
        longitude: (formData.longitude || '').trim() || null,
        status: formData.status,
        main_image: currentMainImage?.filename || null
      };

      console.log('📤 Request body prepared:', requestBody);
      console.log('📤 Title after trim:', `"${requestBody.title}"`, 'isEmpty:', !requestBody.title);
      console.log('📤 Category ID:', `"${requestBody.category_id}"`, 'isEmpty:', !requestBody.category_id);

      // Additional validation
      if (!requestBody.title) {
        console.log('❌ Title is empty after trim');
        setMessage("عنوان نمی‌تواند خالی باشد");
        return;
      }

      if (!requestBody.category_id) {
        console.log('❌ Category ID is empty');
        setMessage("دسته‌بندی باید انتخاب شود");
        return;
      }

      console.log('🚀 Sending request to:', `/api/projects/${projectId}`);
      console.log('🚀 Sending request with body:', requestBody);

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      console.log('📨 Response status:', response.status);
      console.log('📨 Response headers:', [...response.headers.entries()]);
      console.log('📨 Response content-type:', response.headers.get('content-type'));

      const responseText = await response.text();
      console.log('📨 Raw response text:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('📨 Parsed response data:', responseData);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('❌ Response text was:', responseText.substring(0, 500));
        setMessage("خطا در پاسخ سرور - فرمت JSON نامعتبر");
        return;
      }

      if (response.ok) {
        setMessage("پروژه با موفقیت بروزرسانی شد");
        // Refresh data
        await fetchProjectData();
      } else {
        console.log('❌ Server error:', responseData);
        setMessage(responseData.error || responseData.details || `خطا ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Client error:', error);
      setMessage(`خطا در بروزرسانی پروژه: ${error}`);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setMessage("");

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });
      formData.append('projectSlug', project?.slug || '');

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        setMessage("تصاویر با موفقیت آپلود شدند");
        // Refresh images
        await fetchProjectData();
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "خطا در آپلود تصاویر");
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setMessage("خطا در آپلود تصاویر");
    } finally {
      setUploadingImages(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleSetMainImage = async (filename: string) => {
    if (!project) return;

    try {
      const response = await fetch('/api/projects/images/main', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          projectSlug: project.slug,
          filename: filename
        })
      });

      if (response.ok) {
        setMessage("عکس اصلی تغییر کرد");
        // Update images state - make sure only one image is main
        setImages(prev => prev.map(img => ({
          ...img,
          isMainImage: img.filename === filename // فقط تصویر انتخاب شده اصلی باشد
        })));
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "خطا در تنظیم عکس اصلی");
      }
    } catch (error) {
      console.error('Error setting main image:', error);
      setMessage("خطا در تنظیم عکس اصلی");
    }
  };

  const handleDeleteImage = async (filename: string) => {
    if (!project || !confirm('آیا از حذف این تصویر اطمینان دارید؟')) return;

    try {
      const response = await fetch(`/api/projects/gallery?slug=${project.slug}&filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage("تصویر حذف شد");
        // Remove from images state
        setImages(prev => prev.filter(img => img.filename !== filename));
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "خطا در حذف تصویر");
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage("خطا در حذف تصویر");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">پروژه یافت نشد</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors"
          >
            بازگشت
          </button>
        </div>
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
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
              بازگشت
            </button>
            <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">ویرایش پروژه</h1>
            <p className="text-gray-400">{project.title}</p>
          </div>
          
          <button
            onClick={handleSaveProject}
            disabled={saving}
            className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                در حال ذخیره...
              </>
            ) : (
              'ذخیره تغییرات'
            )}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('موفقیت') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
          }`}>
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Project Info Form */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#D4AF37] mb-6">اطلاعات پروژه</h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  عنوان پروژه *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  placeholder="نام پروژه را وارد کنید"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  اسلاگ (URL) - غیرقابل تغییر
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  placeholder="project-slug"
                />
                <p className="text-xs text-gray-500 mt-1">
                  برای حفظ لینک‌های موجود، اسلاگ قابل تغییر نیست
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  دسته‌بندی *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  required
                >
                  <option value="">دسته‌بندی را انتخاب کنید</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  توضیحات
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors resize-none"
                  placeholder="توضیحات پروژه را وارد کنید"
                />
              </div>

              {/* Project Details */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    متراژ
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                    placeholder="۱۲۰ متر"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    سال ساخت
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1300"
                    max="1500"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                    placeholder="۱۴۰۳"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    سال شمسی (مثال: ۱۳۹۰، ۱۴۰۳)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    مکان
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                    placeholder="لاهیجان، گیلان"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    عرض جغرافیایی (Latitude)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                    placeholder="37.207081"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    طول جغرافیایی (Longitude)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                    placeholder="50.009315"
                  />
                </div>
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-[#D4AF37] mb-2">📍 راهنمای دریافت مختصات</h4>
                <ol className="text-xs text-gray-400 space-y-1">
                  <li>1. به <a href="https://www.openstreetmap.org" target="_blank" className="text-blue-400 hover:underline">openstreetmap.org</a> بروید</li>
                  <li>2. مکان پروژه را روی نقشه پیدا کنید</li>
                  <li>3. روی نقطه مورد نظر کلیک راست کنید</li>
                  <li>4. &quot;Show address&quot; را انتخاب کنید</li>
                  <li>5. مختصات را از URL کپی کنید</li>
                </ol>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  وضعیت
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                >
                  <option value="published">منتشر شده</option>
                  <option value="draft">پیش‌نویس</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images Management */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#D4AF37] mb-6">مدیریت تصاویر</h2>
            
            {/* Upload Images */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                افزودن تصاویر جدید
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-black hover:file:bg-[#b8941f] disabled:opacity-50"
                />
                {uploadingImages && (
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                فرمت‌های مجاز: JPG, PNG, WebP
              </p>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.filename} className="relative group">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={`/images/projects/${project?.slug}/${image.filename}`}
                      alt={image.filename}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    
                    {/* Main Image Badge */}
                    {image.isMainImage && (
                      <div className="absolute top-2 left-2 bg-[#D4AF37] text-black px-2 py-1 rounded text-xs font-semibold">
                        عکس اصلی
                      </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      {!image.isMainImage && (
                        <button
                          onClick={() => handleSetMainImage(image.filename)}
                          className="p-2 bg-[#D4AF37] text-black rounded-full hover:bg-[#b8941f] transition-colors"
                          title="تنظیم به عنوان عکس اصلی"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteImage(image.filename)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        title="حذف تصویر"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-1 truncate" title={image.filename}>
                    {image.filename}
                  </p>
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4 opacity-50">📷</div>
                <p className="text-gray-400">هیچ تصویری یافت نشد</p>
                <p className="text-gray-500 text-sm">تصاویر جدید آپلود کنید</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
