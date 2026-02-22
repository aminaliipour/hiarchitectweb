"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useParams } from "next/navigation";

interface ProjectGalleryImage {
  filename: string;
  url: string;
  isMainImage: boolean;
  uploadedAt: string;
  size: number;
  lastModified: string;
  category?: 'execution' | 'design';
}

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category_name?: string;
  main_image?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<ProjectData | null>(null);
  const [gallery, setGallery] = useState<ProjectGalleryImage[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'design' | 'execution'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (slug) {
        try {
          // Fetch project info from API
          const response = await fetch(`/api/projects?slug=${slug}`);
          if (response.ok) {
            const projectsData = await response.json();
            const projectData = projectsData.projects?.find((p: any) => p.slug === slug);

            if (projectData) {
              setProject(projectData);

              // Fetch gallery from project folder
              const galleryResponse = await fetch(`/api/projects/gallery?slug=${slug}`);
              if (galleryResponse.ok) {
                const galleryData = await galleryResponse.json();
                setGallery(galleryData.gallery || []);

                // Update project with gallery main image if available
                let mainImageUrl = null;
                if (galleryData.mainImage) {
                  // Create safe folder name for URL
                  const safeProjectFolder = slug.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
                  // Encode filename for URL safety
                  const encodedFilename = encodeURIComponent(galleryData.mainImage);
                  mainImageUrl = `/images/projects/${safeProjectFolder}/${encodedFilename}`;
                }

                setProject(prev => prev ? {
                  ...prev,
                  main_image: mainImageUrl || projectData.main_image || (galleryData.gallery && galleryData.gallery[0]?.url)
                } : null);
              }
            } else {
              setProject(null);
            }
          } else {
            setProject(null);
          }
        } catch (error) {
          console.error('Error fetching project:', error);
          setProject(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProject();
  }, [slug]);

  // Update document title and meta when project loads
  useEffect(() => {
    if (project) {
      document.title = `${project.title} | پروژه ${project.category_name || 'معماری'} | های آرشیتکت`;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content',
          `پروژه ${project.category_name || 'معماری'} ${project.title} - شرکت معماری های آرشیتکت | طراحی و اجرای پروژه‌های معماری در لاهیجان و گیلان`
        );
      }

      // Add JSON-LD structured data for project
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": project.title,
        "description": `پروژه ${project.category_name || 'معماری'} ${project.title} - شرکت معماری های آرشیتکت`,
        "image": gallery.map(img => `https://hiarchitect.ir${img.url}`),
        "creator": {
          "@type": "Organization",
          "name": "شرکت معماری های آرشیتکت",
          "url": "https://hiarchitect.ir"
        },
        "dateCreated": "2024",
        "genre": project.category_name || 'معماری',
        "keywords": [
          project.category_name || 'معماری',
          "معماری",
          "طراحی",
          "لاهیجان",
          "گیلان",
          project.title
        ].join(", "),
        "url": `https://hiarchitect.ir/project/${slug}`,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://hiarchitect.ir/project/${slug}`
        }
      };

      // Remove existing project schema
      const existingSchema = document.querySelector('script[data-schema="project"]');
      if (existingSchema) {
        existingSchema.remove();
      }

      // Add new schema
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'project');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [project, gallery, slug]);

  // Debug state changes
  useEffect(() => {
    console.log('Lightbox state changed:', { lightboxOpen, lightboxImageIndex });
  }, [lightboxOpen, lightboxImageIndex]);

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
        <div className="text-center">
          <h1 className="text-4xl text-white mb-4">پروژه یافت نشد</h1>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.history.back();
              }
            }}
            className="text-[#D4AF37] hover:underline"
          >
            بازگشت به پروژه‌ها
          </button>
        </div>
      </div>
    );
  }

  const navigateToProjects = () => {
    if (typeof window !== 'undefined') {
      // Mark that user has visited the site
      sessionStorage.setItem('hasVisited', 'true');
      window.location.href = '/#projects';
    }
  };

  const openLightbox = (index: number) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };

  const nextLightboxImage = () => {
    const currentGallery = activeTab === 'all' ? gallery : gallery.filter(img => img.category === activeTab || (!img.category && activeTab === 'design'));
    setLightboxImageIndex((prev) => (prev + 1) % currentGallery.length);
  };

  const prevLightboxImage = () => {
    const currentGallery = activeTab === 'all' ? gallery : gallery.filter(img => img.category === activeTab || (!img.category && activeTab === 'design'));
    setLightboxImageIndex((prev) => (prev - 1 + currentGallery.length) % currentGallery.length);
  };

  // Get filtered gallery based on active tab
  const getFilteredGallery = () => {
    if (activeTab === 'all') return gallery;
    // Default to 'design' if category is not set (for backward compatibility)
    return gallery.filter(img => img.category === activeTab || (!img.category && activeTab === 'design'));
  };

  const filteredGallery = getFilteredGallery();

  // Count images by category
  const executionCount = gallery.filter(img => img.category === 'execution').length;
  const designCount = gallery.filter(img => img.category === 'design' || !img.category).length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative h-screen cursor-pointer" onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(0);
      }}>
        <Image
          src={project.main_image || gallery[0]?.url || '/images/Hi-logo.png'}
          alt={project.title}
          fill
          className="object-cover"
          priority
          unoptimized
          onError={(e) => {
            console.error('Main image failed to load:', project.main_image);
            // Fallback to company logo
            const target = e.target as HTMLImageElement;
            target.src = '/images/Hi-logo.png';
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-20 p-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateToProjects();
            }}
            className="inline-flex items-center gap-2 text-white hover:text-[#D4AF37] transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            بازگشت به پروژه‌ها
          </button>
        </nav>

        {/* Project Info */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="inline-block bg-[#D4AF37] text-black px-4 py-2 rounded-full text-sm mb-4">
              {project.category_name || 'معماری'}
            </div>
            <h1 className="text-5xl md:text-7xl font-light mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              {project.description}
            </p>
          </motion.div>
        </div>

        {/* Click to view hint */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-black/50 text-white px-4 py-2 rounded-full text-sm opacity-0 hover:opacity-100 transition-opacity duration-300">
          کلیک کنید برای مشاهده گالری
        </div>
      </div>

      {/* Image Gallery */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-light mb-8 text-center"
          >
            گالری تصاویر
          </motion.h2>

          {/* Category Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${activeTab === 'all'
                ? 'bg-[#D4AF37] text-black shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              همه تصاویر ({gallery.length})
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${activeTab === 'design'
                ? 'bg-[#D4AF37] text-black shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              <span className="text-xl mr-2">📐</span>
              طراحی ({designCount})
            </button>
            <button
              onClick={() => setActiveTab('execution')}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${activeTab === 'execution'
                ? 'bg-[#D4AF37] text-black shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              <span className="text-xl mr-2">🏗️</span>
              اجرا ({executionCount})
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGallery.map((image, index) => (
              <motion.div
                key={image.filename}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative aspect-square cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-[#D4AF37] transition-all duration-300"
                style={{ minHeight: '200px' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Image clicked:', index, 'URL:', image.url); // Debug log
                  openLightbox(index);
                }}
              >
                <Image
                  src={image.url}
                  alt={`${project.title} - تصویر ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                  unoptimized
                  onError={(e) => {
                    console.error('Image failed to load:', image.url);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
                {/* زوم آیکون */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Image Counter */}
          <div className="text-center mt-8">
            <span className="text-gray-400">
              {activeTab === 'all' ? `${gallery.length} تصویر` :
                activeTab === 'design' ? `${designCount} تصویر طراحی` :
                  `${executionCount} تصویر اجرا`}
            </span>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12"
          >
            <div>
              <h3 className="text-2xl font-light mb-6 text-[#D4AF37]">
                جزئیات پروژه
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">نام پروژه:</span>
                  <span>{project.title}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">دسته‌بندی:</span>
                  <span>{project.category_name || 'معماری'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">تعداد تصاویر:</span>
                  <span>{gallery.length}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-light mb-6 text-[#D4AF37]">
                توضیحات
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {project.description}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back to Projects */}
      <section className="py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <button
            onClick={() => navigateToProjects()}
            className="group relative inline-flex items-center gap-3 px-8 py-3 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300 overflow-hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            <span className="relative z-10">بازگشت به پروژه‌ها</span>
            <div className="absolute inset-0 bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </button>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => {
              console.log('Lightbox background clicked, closing...'); // Debug log
              setLightboxOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={filteredGallery[lightboxImageIndex]?.url || '/images/placeholder.svg'}
                  alt={`${project.title} - تصویر ${lightboxImageIndex + 1}`}
                  width={1920}
                  height={1080}
                  className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain"
                  unoptimized
                  onError={() => {
                    console.error('Lightbox image failed to load:', filteredGallery[lightboxImageIndex]?.url);
                  }}
                />
              </div>

              {/* Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightboxImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-full p-4 text-white z-10 shadow-lg"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightboxImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-full p-4 text-white z-10 shadow-lg"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Close button clicked'); // Debug log
                  setLightboxOpen(false);
                }}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 rounded-full p-4 text-white z-10 shadow-lg"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image Info */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 rounded-lg px-6 py-3 backdrop-blur-sm text-center z-10 shadow-lg">
                <p className="text-white mb-1 text-lg">{project.title} - تصویر {lightboxImageIndex + 1}</p>
                <p className="text-gray-300 text-sm">{lightboxImageIndex + 1} از {filteredGallery.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
