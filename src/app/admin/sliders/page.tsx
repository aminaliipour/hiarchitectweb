'use client';

import { useEffect, useState, useRef } from 'react';
import AdminLayout from '../components/admin-layout';

interface Slider {
  id: string;
  filename: string;
  title: string;
  subtitle?: string;
  location?: string;
  architect?: string;
  category?: string;
  url: string;
  order: number;
  project_link?: string;
}

interface EditingSlider extends Slider {
  isEditing: boolean;
}

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState<EditingSlider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    subtitle: '',
    location: '',
    architect: '',
    category: '',
    order: 1,
    project_link: ''
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // States for project images selection
  const [showProjectImages, setShowProjectImages] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [projectImages, setProjectImages] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingProjectImages, setLoadingProjectImages] = useState(false);
  const [selectedProjectImage, setSelectedProjectImage] = useState<any>(null);

  useEffect(() => {
    loadSliders();
  }, []);

  const loadSliders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/sliders');
      const data = await response.json();
      
      if (response.ok) {
        const slidersWithEdit = (data.sliders || []).map((slider: Slider, index: number) => ({
          ...slider,
          id: `${slider.filename}-${index}`, // Use filename + index to ensure uniqueness
          isEditing: false
        }));
        setSliders(slidersWithEdit);
      } else {
        setError(data.error || 'خطا در بارگذاری اسلایدرها');
      }
    } catch (error) {
      console.error('Error loading sliders:', error);
      setError('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProjectImage) {
      // Use project image
      await createSliderFromProjectImage();
      return;
    }
    
    if (!uploadFile || !uploadData.title.trim()) {
      alert('لطفاً تصویر و عنوان را وارد کنید');
      return;
    }

    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', uploadFile);
      formData.append('title', uploadData.title.trim());
      
      if (uploadData.subtitle.trim()) formData.append('subtitle', uploadData.subtitle.trim());
      if (uploadData.location.trim()) formData.append('location', uploadData.location.trim());
      if (uploadData.architect.trim()) formData.append('architect', uploadData.architect.trim());
      if (uploadData.category.trim()) formData.append('category', uploadData.category.trim());
      if (uploadData.project_link.trim()) formData.append('project_link', uploadData.project_link.trim());
      
      formData.append('order', uploadData.order.toString());

      const response = await fetch('/api/sliders', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert('اسلایدر با موفقیت اضافه شد!');
        setShowUploadForm(false);
        setUploadData({
          title: '',
          subtitle: '',
          location: '',
          architect: '',
          category: '',
          order: 1,
          project_link: ''
        });
        setUploadFile(null);
        setUploadPreview(null);
        await loadSliders();
      } else {
        alert('خطا در افزودن اسلایدر: ' + (result.error || 'خطای نامشخص'));
      }
    } catch (error) {
      console.error('Error uploading slider:', error);
      alert('خطا در اتصال به سرور');
    } finally {
      setUploadLoading(false);
    }
  };

  const deleteSlider = async (sliderId: string, filename: string) => {
    if (!confirm(`آیا مطمئن هستید که می‌خواهید اسلایدر "${filename}" را حذف کنید؟`)) {
      return;
    }

    try {
      // Find the slider to get its order
      const slider = sliders.find(s => s.id === sliderId);
      if (!slider) {
        alert('اسلایدر یافت نشد');
        return;
      }

      const response = await fetch(`/api/sliders/${slider.order}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('اسلایدر با موفقیت حذف شد');
        await loadSliders();
      } else {
        const data = await response.json();
        alert('خطا در حذف اسلایدر: ' + (data.error || 'خطای نامشخص'));
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      alert('خطا در حذف اسلایدر');
    }
  };

  // Start editing a slider
  const startEdit = (sliderId: string) => {
    setSliders(sliders.map(slider => 
      slider.id === sliderId 
        ? { ...slider, isEditing: true }
        : { ...slider, isEditing: false }
    ));
  };

  // Cancel editing
  const cancelEdit = (sliderId: string) => {
    setSliders(sliders.map(slider => 
      slider.id === sliderId 
        ? { ...slider, isEditing: false }
        : slider
    ));
  };

  // Update slider field during editing
  const updateSlider = (sliderId: string, field: string, value: string | number) => {
    setSliders(sliders.map(slider => 
      slider.id === sliderId 
        ? { ...slider, [field]: value }
        : slider
    ));
  };

  // Save slider changes
  const saveSlider = async (slider: EditingSlider) => {
    try {
      // Check if order already exists in another slider
      const existingSlider = sliders.find(s => s.id !== slider.id && s.order === slider.order);
      if (existingSlider) {
        if (!confirm(`ترتیب ${slider.order} از قبل برای اسلایدر دیگری استفاده شده است. آیا می‌خواهید ترتیب آن اسلایدر با این اسلایدر جابجا شود؟`)) {
          return;
        }
        // Swap orders
        existingSlider.order = Math.max(...sliders.map(s => s.order)) + 1; // Temporary order
      }

      const response = await fetch(`/api/sliders/${slider.order}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: slider.title,
          subtitle: slider.subtitle,
          location: slider.location,
          architect: slider.architect,
          category: slider.category,
          order: slider.order,
          project_link: slider.project_link
        }),
      });

      if (response.ok) {
        // If we had a conflict, update the other slider too
        if (existingSlider) {
          await fetch(`/api/sliders/${existingSlider.order}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: existingSlider.title,
              subtitle: existingSlider.subtitle,
              location: existingSlider.location,
              architect: existingSlider.architect,
              category: existingSlider.category,
              order: existingSlider.order,
              project_link: existingSlider.project_link
            }),
          });
        }
        
        alert('اسلایدر با موفقیت به‌روزرسانی شد');
        await loadSliders(); // Reload to get fresh order
      } else {
        const data = await response.json();
        alert('خطا در به‌روزرسانی: ' + (data.error || 'خطای نامشخص'));
      }
    } catch (error) {
      console.error('Error updating slider:', error);
      alert('خطا در اتصال به سرور');
    }
  };





  // Load all projects for selection
  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await fetch('/api/projects?limit=1000');
      const data = await response.json();
      
      if (response.ok) {
        setProjects(data.projects || []);
      } else {
        setError('خطا در بارگذاری پروژه‌ها');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('خطا در اتصال به سرور');
    } finally {
      setLoadingProjects(false);
    }
  };

  // Load images for selected project
  const loadProjectImages = async (projectSlug: string) => {
    if (!projectSlug) {
      setProjectImages([]);
      return;
    }

    try {
      setLoadingProjectImages(true);
      const response = await fetch(`/api/projects/images?projectSlug=${encodeURIComponent(projectSlug)}`);
      const data = await response.json();
      
      if (response.ok) {
        setProjectImages(data.images || []);
      } else {
        console.error('Error loading project images:', data.error);
        setProjectImages([]);
      }
    } catch (error) {
      console.error('Error loading project images:', error);
      setProjectImages([]);
    } finally {
      setLoadingProjectImages(false);
    }
  };

  // Handle project selection change
  const handleProjectSelect = (projectSlug: string) => {
    setSelectedProject(projectSlug);
    setSelectedProjectImage(null);
    if (projectSlug) {
      loadProjectImages(projectSlug);
    } else {
      setProjectImages([]);
    }
  };

  // Handle project image selection
  const handleProjectImageSelect = (image: any) => {
    setSelectedProjectImage(image);
    setUploadPreview(image.url);
    setUploadFile(null); // Clear uploaded file
    
    // Find project details to auto-fill form
    const project = projects.find(p => p.slug === selectedProject);
    if (project) {
      setUploadData({
        ...uploadData,
        title: project.title || '',
        location: project.location || '',
        project_link: `https://hiarchitect.ir/project/${project.slug}` || ''
      });
    }
  };

  // Create slider from selected project image
  const createSliderFromProjectImage = async () => {
    if (!selectedProjectImage || !uploadData.title.trim()) {
      alert('لطفاً تصویر پروژه و عنوان را انتخاب کنید');
      return;
    }

    setUploadLoading(true);

    try {
      // Create FormData with image URL instead of file
      const formData = new FormData();
      formData.append('imageUrl', selectedProjectImage.url);
      formData.append('filename', selectedProjectImage.filename);
      formData.append('title', uploadData.title.trim());
      
      if (uploadData.subtitle.trim()) formData.append('subtitle', uploadData.subtitle.trim());
      if (uploadData.location.trim()) formData.append('location', uploadData.location.trim());
      if (uploadData.architect.trim()) formData.append('architect', uploadData.architect.trim());
      if (uploadData.category.trim()) formData.append('category', uploadData.category.trim());
      if (uploadData.project_link.trim()) formData.append('project_link', uploadData.project_link.trim());
      
      formData.append('order', uploadData.order.toString());
      formData.append('fromProjectImage', 'true');

      const response = await fetch('/api/sliders', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert('اسلایدر از تصویر پروژه با موفقیت ایجاد شد!');
        setShowUploadForm(false);
        setShowProjectImages(false);
        setUploadData({
          title: '',
          subtitle: '',
          location: '',
          architect: '',
          category: '',
          order: 1,
          project_link: ''
        });
        setUploadFile(null);
        setUploadPreview(null);
        setSelectedProjectImage(null);
        setSelectedProject('');
        setProjectImages([]);
        await loadSliders();
      } else {
        alert('خطا در ایجاد اسلایدر: ' + (result.error || 'خطای نامشخص'));
      }
    } catch (error) {
      console.error('Error creating slider from project image:', error);
      alert('خطا در اتصال به سرور');
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="مدیریت اسلایدرها">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری اسلایدرها...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="مدیریت اسلایدرها">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مدیریت اسلایدرها</h1>
            <p className="text-gray-600 mt-1">
              {sliders.length} اسلایدر - آپلود، ویرایش، حذف و ترتیب‌دهی
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadSliders}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              بروزرسانی
            </button>
            <button
              onClick={() => {
                setShowProjectImages(!showProjectImages);
                if (!showProjectImages && projects.length === 0) {
                  loadProjects();
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {showProjectImages ? 'بستن' : 'از پروژه‌ها'}
            </button>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {showUploadForm ? 'بستن فرم' : 'اسلایدر جدید'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-700">❌ {error}</div>
          </div>
        )}

        {/* Project Images Selection */}
        {showProjectImages && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">انتخاب از تصاویر پروژه‌ها</h2>
              <button
                onClick={() => setShowProjectImages(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">انتخاب پروژه</label>
                {loadingProjects ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">در حال بارگذاری پروژه‌ها...</p>
                  </div>
                ) : (
                  <select
                    value={selectedProject}
                    onChange={(e) => handleProjectSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">-- انتخاب پروژه --</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.slug}>
                        {project.title} ({project.slug})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Project Images Grid */}
              {selectedProject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    انتخاب تصویر ({projectImages.length} تصویر موجود)
                  </label>
                  
                  {loadingProjectImages ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="text-gray-600 mt-2">در حال بارگذاری تصاویر...</p>
                    </div>
                  ) : projectImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {projectImages.map((image, index) => (
                        <div
                          key={index}
                          className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                            selectedProjectImage?.filename === image.filename
                              ? 'border-purple-500 ring-2 ring-purple-200'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => handleProjectImageSelect(image)}
                        >
                          <img
                            src={image.url}
                            alt={image.filename}
                            className="w-full h-24 object-cover"
                          />
                          {image.isMainImage && (
                            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                              اصلی
                            </div>
                          )}
                          {selectedProjectImage?.filename === image.filename && (
                            <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                            {image.filename}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      هیچ تصویری برای این پروژه یافت نشد
                    </div>
                  )}
                </div>
              )}

              {/* Continue to Form Button */}
              {selectedProjectImage && (
                <div className="pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowProjectImages(false);
                      setShowUploadForm(true);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ادامه با این تصویر ({selectedProjectImage.filename})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedProjectImage 
                ? `ایجاد اسلایدر از تصویر پروژه: ${selectedProjectImage.filename}`
                : 'آپلود اسلایدر جدید'
              }
            </h2>
            
            {selectedProjectImage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">تصویر از پروژه انتخاب شده:</span>
                  <span>{projects.find(p => p.slug === selectedProject)?.title}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload - Only show if no project image selected */}
                {!selectedProjectImage && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تصویر اسلایدر *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                      {uploadPreview ? (
                        <div className="space-y-2">
                          <img
                            src={uploadPreview}
                            alt="پیش‌نمایش"
                            className="w-full h-32 object-cover rounded mx-auto"
                          />
                          <p className="text-sm text-gray-600">{uploadFile?.name}</p>
                          <button
                            type="button"
                            onClick={() => {
              setUploadFile(null);
              setUploadPreview(null);
            }}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            حذف تصویر
                          </button>
                        </div>
                      ) : (
                        <div>
                          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-gray-600">کلیک کنید یا فایل را بکشید</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Project Image Preview - Only show if project image selected */}
                {selectedProjectImage && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تصویر انتخاب شده از پروژه
                    </label>
                    <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                      <div className="flex items-center gap-4">
                        <img
                          src={selectedProjectImage.url}
                          alt={selectedProjectImage.filename}
                          className="w-32 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{selectedProjectImage.filename}</p>
                          <p className="text-sm text-gray-600">از پروژه: {projects.find(p => p.slug === selectedProject)?.title}</p>
                          {selectedProjectImage.isMainImage && (
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                              تصویر اصلی پروژه
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProjectImage(null);
                            setUploadPreview(null);
                            setShowProjectImages(true);
                          }}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          تغییر تصویر
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عنوان *</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="عنوان اسلایدر"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">زیرعنوان</label>
                  <input
                    type="text"
                    value={uploadData.subtitle}
                    onChange={(e) => setUploadData({...uploadData, subtitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="زیرعنوان اسلایدر"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">موقعیت</label>
                  <input
                    type="text"
                    value={uploadData.location}
                    onChange={(e) => setUploadData({...uploadData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="تهران، ایران"
                  />
                </div>

                {/* Architect */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">معمار</label>
                  <input
                    type="text"
                    value={uploadData.architect}
                    onChange={(e) => setUploadData({...uploadData, architect: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="نام معمار"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">انتخاب دسته‌بندی</option>
                    <option value="ویلا">ویلا</option>
                    <option value="آپارتمان">آپارتمان</option>
                    <option value="تجاری">تجاری</option>
                    <option value="اداری">اداری</option>
                    <option value="فرهنگی">فرهنگی</option>
                    <option value="مسکونی">مسکونی</option>
                  </select>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ترتیب نمایش</label>
                  <input
                    type="number"
                    value={uploadData.order}
                    onChange={(e) => setUploadData({...uploadData, order: parseInt(e.target.value) || 1})}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Project Link */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">لینک پروژه</label>
                  <input
                    type="url"
                    value={uploadData.project_link}
                    onChange={(e) => setUploadData({...uploadData, project_link: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://example.com/project"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {uploadLoading ? 
                    (selectedProjectImage ? 'در حال ایجاد...' : 'در حال آپلود...') :
                    (selectedProjectImage ? 'ایجاد اسلایدر' : 'آپلود اسلایدر')
                  }
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    if (selectedProjectImage) {
                      setSelectedProjectImage(null);
                      setUploadPreview(null);
                    }
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        )}

        {sliders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">🖼️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ اسلایدری وجود ندارد</h3>
            <p className="text-gray-600 mb-6">
              برای شروع، اولین اسلایدر خود را آپلود کنید
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              آپلود اسلایدر اول
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sliders
              .sort((a, b) => a.order - b.order)
              .map((slider) => (
              <div key={slider.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-80 h-48 bg-gray-100 relative">
                    <img
                      src={slider.url}
                      alt={slider.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                      ترتیب: {slider.order}
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    {slider.isEditing ? (
                      /* Edit Mode */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان</label>
                            <input
                              type="text"
                              value={slider.title}
                              onChange={(e) => updateSlider(slider.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">زیرعنوان</label>
                            <input
                              type="text"
                              value={slider.subtitle || ''}
                              onChange={(e) => updateSlider(slider.id, 'subtitle', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">موقعیت</label>
                            <input
                              type="text"
                              value={slider.location || ''}
                              onChange={(e) => updateSlider(slider.id, 'location', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">معمار</label>
                            <input
                              type="text"
                              value={slider.architect || ''}
                              onChange={(e) => updateSlider(slider.id, 'architect', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
                            <select
                              value={slider.category || ''}
                              onChange={(e) => updateSlider(slider.id, 'category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              <option value="">انتخاب دسته‌بندی</option>
                              <option value="ویلا">ویلا</option>
                              <option value="آپارتمان">آپارتمان</option>
                              <option value="تجاری">تجاری</option>
                              <option value="اداری">اداری</option>
                              <option value="فرهنگی">فرهنگی</option>
                              <option value="مسکونی">مسکونی</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ترتیب</label>
                            <input
                              type="number"
                              value={slider.order}
                              onChange={(e) => updateSlider(slider.id, 'order', parseInt(e.target.value) || 1)}
                              min="1"
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">لینک پروژه</label>
                          <input
                            type="url"
                            value={slider.project_link || ''}
                            onChange={(e) => updateSlider(slider.id, 'project_link', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <button
                            onClick={() => saveSlider(slider)}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                          >
                            ذخیره
                          </button>
                          <button
                            onClick={() => cancelEdit(slider.id)}
                            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
                          >
                            انصراف
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{slider.title}</h3>
                            {slider.subtitle && (
                              <p className="text-gray-600 mb-2">{slider.subtitle}</p>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                              {slider.location && <div>📍 {slider.location}</div>}
                              {slider.architect && <div>👤 {slider.architect}</div>}
                              {slider.category && <div>🏷️ {slider.category}</div>}
                              <div>📁 {slider.filename}</div>
                            </div>

                            {slider.project_link && (
                              <a
                                href={slider.project_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm"
                              >
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                مشاهده پروژه
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => startEdit(slider.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors"
                          >
                            ✏️ ویرایش
                          </button>
                          <button
                            onClick={() => deleteSlider(slider.id, slider.filename)}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                          >
                            🗑️ حذف
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">راهنمای استفاده:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• برای آپلود اسلایدر جدید روی دکمه "اسلایدر جدید" کلیک کنید</li>
                <li>• برای استفاده از تصاویر پروژه‌های موجود روی دکمه "از پروژه‌ها" کلیک کنید</li>
                <li>• برای ویرایش هر اسلایدر روی دکمه "ویرایش" کلیک کنید</li>
                <li>• برای تغییر ترتیب نمایش فیلد "ترتیب" را در حین ویرایش تغییر دهید</li>
                <li>• فرمت‌های پشتیبانی شده: JPG, PNG, WebP, GIF</li>
                <li>• بهترین اندازه تصاویر: نسبت 16:9 با رزولوشن 1920x1080</li>
              </ul>
            </div>
          </div>
        </div>
      </div>


    </AdminLayout>
  );
}