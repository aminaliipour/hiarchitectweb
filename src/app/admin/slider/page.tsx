"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Slider {
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
  } | null;
}

export default function SliderManagePage() {
  const router = useRouter();
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSliders();
    
    // Set up auto-refresh every 30 seconds to catch new uploads
    const interval = setInterval(() => {
      fetchSliders();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Add focus event listener to refresh when window gets focus
  useEffect(() => {
    const handleFocus = () => {
      fetchSliders();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await fetch('/api/sliders', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSliders(data.sliders || []);
      } else {
        setMessage("خطا در بارگذاری اسلایدرها");
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
      setMessage("خطا در بارگذاری اسلایدرها");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('آیا از حذف این اسلاید اطمینان دارید؟')) return;

    try {
      const response = await fetch(`/api/sliders?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage("اسلاید با موفقیت حذف شد");
        // Force refresh after delete
        setTimeout(fetchSliders, 1000);
      } else {
        const data = await response.json();
        setMessage(data.error || "خطا در حذف اسلاید");
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      setMessage("خطا در حذف اسلاید");
    }
  };

  const handleClearCache = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setMessage("کش با موفقیت پاک شد");
        // Refresh data after cache clear
        setTimeout(fetchSliders, 1000);
      } else {
        setMessage("خطا در پاک کردن کش");
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      setMessage("خطا در پاک کردن کش");
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
            <p className="text-gray-400">مدیریت تصاویر اسلایدر صفحه اصلی</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleClearCache}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              پاک کردن کش
            </button>
            <button
              onClick={fetchSliders}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'در حال بروزرسانی...' : 'بروزرسانی فهرست'}
            </button>
            <button
              onClick={() => router.push('/admin/slider/new')}
              className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              افزودن اسلاید جدید
            </button>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">تعداد اسلایدها</p>
                <p className="text-2xl font-semibold text-white">{sliders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        {sliders.length > 0 ? (
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#D4AF37] mb-6">اسلایدهای موجود</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sliders.map((slider) => (
                <div key={slider.id} className="relative group">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={slider.url}
                      alt={slider.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                      <button
                        onClick={() => router.push(`/admin/slider/edit/${slider.id}`)}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        title="ویرایش اسلاید"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(slider.filename)}
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
                    {slider.subtitle && (
                      <p className="text-sm text-gray-300 truncate">{slider.subtitle}</p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-400 truncate">{slider.filename}</p>
                      <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/20 px-2 py-1 rounded">
                        ترتیب: {slider.order}
                      </span>
                    </div>
                    {(slider.location || slider.category) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {slider.category && (
                          <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
                            {slider.category}
                          </span>
                        )}
                        {slider.location && (
                          <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">
                            📍 {slider.location}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <div className="text-6xl mb-6 opacity-50">🖼️</div>
            <h3 className="text-xl font-medium text-white mb-2">هیچ اسلایدی یافت نشد</h3>
            <p className="text-gray-400 mb-6">هنوز هیچ تصویری برای اسلایدر صفحه اصلی افزوده نشده است</p>
            <button
              onClick={() => router.push('/admin/slider/new')}
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
