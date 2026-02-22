'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthLayout from '../../components/auth-layout';

interface ProjectFolder {
  folderName: string;
  slug: string;
  name: string;
  totalImages: number;
  mainImage: string | null;
  hasInfo: boolean;
  lastUpdated: string | null;
}

interface ProjectImage {
  filename: string;
  url: string;
  isMainImage: boolean;
  uploadedAt: string;
  category?: 'execution' | 'design';
}

// Utility function to force refresh images and clear cache
const forceRefreshImages = async (projectSlug?: string) => {
  if (typeof window !== 'undefined') {
    // Clear service worker cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('images') || name.includes('projects') || name.includes('static')) {
            caches.delete(name);
          }
        });
      });
    }

    // Force reload all images on the page
    const images = document.querySelectorAll('img[src*="/images/projects/"]');
    images.forEach(img => {
      const src = (img as HTMLImageElement).src;
      const baseUrl = src.split('?')[0];
      (img as HTMLImageElement).src = `${baseUrl}?t=${Date.now()}&refresh=true&bust=${Math.random()}`;
    });

    // Call refresh API if projectSlug is provided
    if (projectSlug) {
      try {
        await fetch('/api/projects/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ projectSlug })
        });
      } catch (error) {
        console.error('Error calling refresh API:', error);
      }
    }
  }
};

export default function ProjectImagesPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectFolder[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'execution' | 'design'>('design');
  const [viewCategory, setViewCategory] = useState<'all' | 'execution' | 'design'>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    console.log('selectedCategory changed to:', selectedCategory);
  }, [selectedCategory]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects/folders', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectImages = async (projectSlug: string) => {
    setImagesLoading(true);
    try {
      const timestamp = Date.now();
      const cacheBuster = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/projects/gallery?slug=${projectSlug}&t=${timestamp}&cb=${cacheBuster}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        setProjectImages(data.gallery || []);
      }
    } catch (error) {
      console.error('Error fetching project images:', error);
      setProjectImages([]);
    } finally {
      setImagesLoading(false);
    }
  };

  const handleProjectSelect = (projectSlug: string) => {
    setSelectedProject(projectSlug);
    fetchProjectImages(projectSlug);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedProject) return;

    setUploadLoading(true);
    setMessage('');

    try {
      let uploadedCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectSlug', selectedProject);
        formData.append('projectName', selectedProject);
        formData.append('category', selectedCategory);
        formData.append('isMainImage', (i === 0 && projectImages.length === 0).toString());

        // Debug log
        console.log('Uploading with category:', selectedCategory);
        console.log('FormData category:', formData.get('category'));

        const response = await fetch('/api/projects/images', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'خطا در آپلود فایل');
        }

        uploadedCount++;
        setMessage(`فایل ${uploadedCount} از ${files.length} آپلود شد`);

        // Force browser cache clear for new images
        await forceRefreshImages(selectedProject);

        // Refresh images after each upload for immediate feedback
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a bit more for file system
        await fetchProjectImages(selectedProject);
      }

      setMessage(`همه فایل‌ها با موفقیت آپلود شدند (${uploadedCount} فایل)`);

      // Final force refresh
      await forceRefreshImages(selectedProject);

      // Final refresh to ensure all data is up to date
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait longer for all operations
      await Promise.all([
        fetchProjectImages(selectedProject),
        fetchProjects()
      ]);

      // Clear the file input
      e.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('خطا: ' + (error as Error).message);
    } finally {
      setUploadLoading(false);
    }
  };

  const deleteImage = async (projectSlug: string, filename: string) => {
    if (!confirm('آیا از حذف این تصویر اطمینان دارید؟')) return;

    try {
      const response = await fetch(`/api/projects/gallery?slug=${projectSlug}&filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('تصویر با موفقیت حذف شد');

        // Force refresh images
        await forceRefreshImages(projectSlug);

        // Immediate refresh after deletion
        await Promise.all([
          fetchProjectImages(projectSlug),
          fetchProjects()
        ]);
      } else {
        const errorData = await response.json();
        setMessage('خطا: ' + (errorData.error || 'مشکل در حذف تصویر'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('خطا در حذف تصویر');
    }
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
            <p className="text-gray-300">در حال بارگذاری...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 space-x-reverse text-gray-300 hover:text-[#D4AF37] transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
              <span>بازگشت</span>
            </button>
            <h1 className="text-3xl font-bold text-[#D4AF37]">مدیریت تصاویر پروژه‌ها</h1>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg border backdrop-blur-sm ${message.includes('خطا')
            ? 'bg-red-900/20 border-red-500/30 text-red-300'
            : 'bg-green-900/20 border-green-500/30 text-green-300'
            }`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Project List */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-[#D4AF37]">پروژه‌ها</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {projects.map((project) => (
                <button
                  key={project.folderName}
                  onClick={() => handleProjectSelect(project.slug)}
                  className={`w-full text-right p-4 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/50 ${selectedProject === project.slug
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : 'border-gray-600/30 bg-gray-800/20'
                    }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    {project.mainImage && (
                      <div className="w-12 h-12 relative rounded overflow-hidden border border-gray-600/30">
                        <Image
                          src={`/api/images/projects/${project.slug}/${encodeURIComponent(project.mainImage.split('/').pop() || '')}`}
                          alt={project.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 text-right">
                      <h3 className="font-medium truncate text-white">{project.name}</h3>
                      <p className="text-sm text-gray-400">{project.totalImages} تصویر</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            {selectedProject ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#D4AF37]">
                    تصاویر پروژه: {projects.find(p => p.slug === selectedProject)?.name}
                  </h2>
                </div>

                {/* Category Selector */}
                <div className="mb-6 bg-gray-800/40 p-4 rounded-lg border border-gray-700/50">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    نوع تصاویر برای آپلود
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        console.log('Setting category to: design');
                        setSelectedCategory('design');
                      }}
                      className={`flex-1 px-6 py-3 rounded-lg transition-all duration-300 font-medium ${selectedCategory === 'design'
                        ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/30'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30'
                        }`}
                    >
                      <span className="text-xl mr-2">📐</span>
                      تصاویر طراحی
                    </button>
                    <button
                      onClick={() => {
                        console.log('Setting category to: execution');
                        setSelectedCategory('execution');
                      }}
                      className={`flex-1 px-6 py-3 rounded-lg transition-all duration-300 font-medium ${selectedCategory === 'execution'
                        ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/30'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30'
                        }`}
                    >
                      <span className="text-xl mr-2">🏗️</span>
                      تصاویر اجرا
                    </button>
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => forceRefreshImages(selectedProject)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200 flex items-center gap-2"
                    title="بروزرسانی اجباری تصاویر"
                  >
                    🔄 بروزرسانی
                  </button>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    disabled={uploadLoading}
                    className="flex-1 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37]/20 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/30 file:cursor-pointer"
                  />
                </div>

                {uploadLoading && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
                    <p className="mt-2 text-gray-300">در حال آپلود...</p>
                  </div>
                )}

                {imagesLoading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
                    <p className="mt-2 text-gray-300">در حال بارگذاری تصاویر...</p>
                  </div>
                )}

                {/* View Category Filter Tabs */}
                {!imagesLoading && projectImages.length > 0 && (
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setViewCategory('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewCategory === 'all'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                        }`}
                    >
                      همه ({projectImages.length})
                    </button>
                    <button
                      onClick={() => setViewCategory('design')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewCategory === 'design'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                        }`}
                    >
                      📐 طراحی ({projectImages.filter(img => img.category === 'design' || !img.category).length})
                    </button>
                    <button
                      onClick={() => setViewCategory('execution')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewCategory === 'execution'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                        }`}
                    >
                      🏗️ اجرا ({projectImages.filter(img => img.category === 'execution').length})
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {projectImages
                    .filter(image => {
                      if (viewCategory === 'all') return true;
                      if (viewCategory === 'design') return image.category === 'design' || !image.category;
                      return image.category === 'execution';
                    })
                    .map((image, index) => {
                      // Use API route for serving images with cache busting
                      const imageUrl = `/api/images/projects/${selectedProject}/${encodeURIComponent(image.filename)}?t=${Date.now()}`;
                      return (
                        <div key={`${image.filename}-${Date.now()}-${index}`} className="relative group">
                          <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-600/30 bg-gray-800/20 backdrop-blur-sm">
                            <Image
                              src={imageUrl}
                              alt={image.filename}
                              fill
                              className="object-cover"
                              unoptimized
                              priority={image.isMainImage}
                              onError={(e) => {
                                console.log(`Failed to load image: ${imageUrl}`);
                                // Try to reload with timestamp
                                const target = e.target as HTMLImageElement;
                                if (target && !target.src.includes('reload=')) {
                                  target.src = `/api/images/projects/${selectedProject}/${encodeURIComponent(image.filename)}?reload=${Date.now()}`;
                                }
                              }}
                              onLoad={() => {
                                console.log(`Successfully loaded image: ${imageUrl}`);
                              }}
                            />
                            {image.isMainImage && (
                              <div className="absolute top-2 right-2 bg-[#D4AF37] text-black text-xs px-2 py-1 rounded">
                                اصلی
                              </div>
                            )}
                            {image.category && (
                              <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded ${image.category === 'execution'
                                ? 'bg-green-600 text-white'
                                : 'bg-blue-600 text-white'
                                }`}>
                                {image.category === 'execution' ? '🏗️ اجرا' : '📐 طراحی'}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                              <button
                                onClick={() => deleteImage(selectedProject, image.filename)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 truncate">{image.filename}</p>
                        </div>
                      );
                    })}
                </div>

                {projectImages.filter(image => {
                  if (viewCategory === 'all') return true;
                  if (viewCategory === 'design') return image.category === 'design' || !image.category;
                  return image.category === 'execution';
                }).length === 0 && (
                    <div className="text-center py-8 text-gray-400 col-span-full">
                      <div className="text-4xl mb-4">📷</div>
                      <p>
                        {viewCategory === 'all'
                          ? 'هیچ تصویری برای این پروژه یافت نشد'
                          : viewCategory === 'design'
                            ? 'هیچ تصویر طراحی یافت نشد'
                            : 'هیچ تصویر اجرا یافت نشد'}
                      </p>
                    </div>
                  )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-4">📁</div>
                <p>یک پروژه را انتخاب کنید</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
