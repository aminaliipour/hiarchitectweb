"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ImageCropper from "../../../../components/ImageCropper";

interface SliderData {
  id: number;
  filename: string;
  title: string;
  subtitle?: string;
  location?: string;
  architect?: string;
  category?: string;
  url: string;
  order: number;
  project_link?: string | null;
  cropData?: {
    x: number;
    y: number;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  };
}

interface Project {
  id: string;
  title: string;
  slug: string;
  category_name?: string;
}

export default function EditSliderPage() {
  const params = useParams();
  const router = useRouter();
  const sliderId = params.id as string;

  const [slider, setSlider] = useState<SliderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string>("");
  const [cropData, setCropData] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  } | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    location: "",
    architect: "",
    category: "",
    order: 1,
    project_link: ""
  });

  useEffect(() => {
    fetchSliderData();
    loadProjects();
  }, [sliderId]);

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

  const fetchSliderData = async () => {
    try {
      const response = await fetch('/api/sliders');
      if (response.ok) {
        const data = await response.json();
        const sliderData = data.sliders.find((s: SliderData) => s.id === parseInt(sliderId));
        
        if (sliderData) {
          console.log('📥 Slider data loaded:', sliderData);
          setSlider(sliderData);
          setFormData({
            title: sliderData.title || "",
            subtitle: sliderData.subtitle || "",
            location: sliderData.location || "",
            architect: sliderData.architect || "",
            category: sliderData.category || "",
            order: sliderData.order || 1,
            project_link: sliderData.project_link || ""
          });
          
          // Set existing crop data if available
          if (sliderData.cropData) {
            console.log('🔄 Setting existing cropData:', sliderData.cropData);
            setCropData(sliderData.cropData);
          }
        } else {
          setMessage("اسلاید یافت نشد");
        }
      } else {
        setMessage("خطا در بارگذاری اطلاعات اسلاید");
      }
    } catch (error) {
      console.error('Error fetching slider:', error);
      setMessage("خطا در بارگذاری اطلاعات اسلاید");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 1 : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📁 New image file selected:', file.name);
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result as string);
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
    setNewImagePreview("");
    setCropData(null);
  };

  const handleSaveSlider = async () => {
    if (!formData.title.trim()) {
      setMessage("عنوان نمی‌تواند خالی باشد");
      return;
    }

    setSaving(true);
    setMessage("");
    
    console.log('💾 Saving slider with cropData:', cropData);

    try {
      // If there's a new image file (uploaded), update the image
      if (newImage) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', newImage);
        uploadFormData.append('title', formData.title);
        uploadFormData.append('subtitle', formData.subtitle);
        uploadFormData.append('location', formData.location);
        uploadFormData.append('architect', formData.architect);
        uploadFormData.append('category', formData.category);
        uploadFormData.append('order', formData.order.toString());
        
        // Include crop data if exists
        if (cropData) {
          uploadFormData.append('cropData', JSON.stringify(cropData));
        }

        const uploadResponse = await fetch(`/api/sliders/${sliderId}/image`, {
          method: 'POST',
          credentials: 'include',
          body: uploadFormData
        });

        if (uploadResponse.ok) {
          setMessage("اسلاید با تصویر جدید بروزرسانی شد");
          setTimeout(() => {
            router.push('/admin/slider');
          }, 2000);
        } else {
          const errorData = await uploadResponse.json();
          setMessage(errorData.error || "خطا در آپلود تصویر");
        }
      } else {
        // Update metadata and crop data only (no new image file)
        // This happens when we crop the existing image or just update text
        const updateData = {
          ...formData,
          cropData: cropData // Always include cropData, even if null
        };

        console.log('📤 Sending update data:', updateData);

        const response = await fetch(`/api/sliders/${sliderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          setMessage(cropData ? 
            "اسلاید با ناحیه نمایش جدید بروزرسانی شد" : 
            "اسلاید با موفقیت بروزرسانی شد"
          );
          setTimeout(() => {
            router.push('/admin/slider');
          }, 2000);
        } else {
          const errorData = await response.json();
          setMessage(errorData.error || "خطا در بروزرسانی اسلاید");
        }
      }
    } catch (error) {
      console.error('Error updating slider:', error);
      setMessage("خطا در بروزرسانی اسلاید");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!slider) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">اسلاید یافت نشد</h1>
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
            <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">ویرایش اسلاید</h1>
            <p className="text-gray-400">{slider.title}</p>
          </div>
          
          <button
            onClick={handleSaveSlider}
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
          {/* Slider Info Form */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#D4AF37] mb-6">اطلاعات اسلاید</h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  عنوان اسلاید *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
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
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  placeholder="زیرعنوان اسلاید (اختیاری)"
                />
              </div>

              {/* Category and Order */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    دسته‌بندی
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
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
                    name="order"
                    min="1"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                    placeholder="ترتیب نمایش"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    عدد کمتر = نمایش زودتر
                  </p>
                </div>
              </div>

              {/* Location and Architect */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    موقعیت
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
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
                    name="architect"
                    value={formData.architect}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                    placeholder="نام معمار یا استودیو"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#D4AF37] mb-6">تصویر اسلاید</h2>
            
            {/* Current Image */}
            <div className="mb-6">
              <p className="text-sm text-gray-300 mb-2">
                تصویر فعلی:
              </p>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                <Image
                  src={newImagePreview || slider.url}
                  alt={slider.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
            
            {/* Image Upload */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  تغییر تصویر (اختیاری)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-black hover:file:bg-[#b8941f]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  فرمت‌های مجاز: JPG, PNG, WebP - حداکثر 5MB
                </p>
              </div>

              {newImagePreview && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCropper(true)}
                    className="px-3 py-2 text-sm bg-[#D4AF37] text-black rounded hover:bg-[#b8941f] transition-colors"
                  >
                    ویرایش تصویر جدید
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewImage(null);
                      setNewImagePreview("");
                      setCropData(null);
                      // Reset file input
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    حذف تصویر جدید
                  </button>
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-400 space-y-2 mt-4">
              <p><span className="text-gray-300">نام فایل فعلی:</span> {slider.filename}</p>
              {newImage && (
                <p className="text-green-400">
                  <span className="text-gray-300">✓ تصویر جدید آماده ذخیره</span>
                </p>
              )}
            </div>
          </div>

      {/* Image Cropper Modal */}
      {showCropper && newImagePreview && (
        <ImageCropper
          src={newImagePreview}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          initialAspectRatio={16/9}
          initialCropData={null}
        />
      )}
        </div>
      </div>
    </div>
  );
}
