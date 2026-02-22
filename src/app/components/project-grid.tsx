"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { type Project } from "../types";

export default function ProjectGrid() {
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [gridSize, setGridSize] = useState("medium");
  const [allProjects, setAllProjects] = useState<Project[]>([]); // All projects for search
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch ALL projects at once for search
        const projectsUrl = `/api/projects?status=published&limit=1000`;
        console.log('Fetching all projects from:', projectsUrl);
        
        const projectsResponse = await fetch(projectsUrl);
        if (!projectsResponse.ok) {
          throw new Error(`Projects API failed: ${projectsResponse.status}`);
        }
        const projectsData = await projectsResponse.json();
        
        console.log('Projects data received:', {
          projectsCount: projectsData.projects?.length || 0
        });
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/projects/categories');
        if (!categoriesResponse.ok) {
          console.warn('Categories API failed:', categoriesResponse.status);
          setAllProjects(projectsData.projects || []);
          setCategories([{id: 'all', name: 'همه', slug: 'all'}]);
          return;
        }
        const categoriesData = await categoriesResponse.json();
        
        // For each project, try to get its gallery info to get better main image
        const projectsWithGallery = await Promise.all(
          (projectsData.projects || projectsData || []).map(async (project: Project) => {
            try {
              const galleryResponse = await fetch(`/api/projects/gallery?slug=${project.slug}`);
              if (galleryResponse.ok) {
                const galleryData = await galleryResponse.json();
                
                // Use gallery main image if available, otherwise use project main_image
                let mainImage = project.main_image;
                if (galleryData.mainImage) {
                  // Create safe folder name for URL (same as API)
                  const safeProjectFolder = project.slug.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
                  // Encode filename for URL safety
                  const encodedFilename = encodeURIComponent(galleryData.mainImage);
                  mainImage = `/images/projects/${safeProjectFolder}/${encodedFilename}`;
                }
                
                return {
                  ...project,
                  main_image: mainImage,
                  gallery_count: galleryData.totalImages || 0
                };
              }
            } catch (error) {
              console.warn(`Gallery fetch failed for ${project.slug}:`, error);
            }
            return project;
          })
        );
        
        setAllProjects(projectsWithGallery);
        setCategories([{id: 'all', name: 'همه', slug: 'all'}, ...(categoriesData || [])]);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setAllProjects([]);
        setCategories([{id: 'all', name: 'همه', slug: 'all'}]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter all projects based on category and search (across ALL projects, not just current page)
  const filteredProjects = allProjects.filter((project: Project) => {
    const matchesCategory = selectedCategory === "همه" || project.category_name === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.category_name && project.category_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const getGridCols = () => {
    switch (gridSize) {
      case "small": return "grid-cols-2 md:grid-cols-4";
      case "medium": return "grid-cols-1 md:grid-cols-3";
      case "large": return "grid-cols-1 md:grid-cols-2";
      default: return "grid-cols-1 md:grid-cols-3";
    }
  };

  return (
    <section id="projects" className="min-h-screen bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-light mb-6"
          >
            <span className="font-thin">نمونه</span>{" "}
            <span className="text-[#D4AF37] font-normal">پروژه ها</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            مجموعه‌ای از پروژه‌های معماری که توسط تیم ما طراحی و اجرا شده است
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی پروژه بر اساس نام، توضیحات یا دسته‌بندی..."
              className="w-full px-6 py-4 pr-12 bg-gray-900/50 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {(searchQuery || selectedCategory !== "همه") && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-gray-400 mt-3 text-center"
            >
              نمایش {filteredProjects.length} پروژه
              {searchQuery && ` برای "${searchQuery}"`}
              {selectedCategory !== "همه" && ` در دسته "${selectedCategory}"`}
            </motion.p>
          )}
        </motion.div>

        {/* Filters and Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
        >
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm ${
                  selectedCategory === category.name
                    ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                    : "border-gray-600 text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Size Controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">اندازه:</span>
            <div className="flex gap-2">
              {["small", "medium", "large"].map((size) => (
                <button
                  key={size}
                  onClick={() => setGridSize(size)}
                  className={`w-8 h-8 rounded border-2 transition-all duration-300 ${
                    gridSize === size
                      ? "border-[#D4AF37] bg-[#D4AF37]/20"
                      : "border-gray-600 hover:border-[#D4AF37]"
                  }`}
                  title={size === "small" ? "کوچک" : size === "medium" ? "متوسط" : "بزرگ"}
                >
                  <div className={`w-full h-full rounded flex items-center justify-center`}>
                    <div className={`bg-current rounded ${
                      size === "small" ? "w-2 h-2" : size === "medium" ? "w-3 h-3" : "w-4 h-4"
                    }`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          layout
          className={`grid ${getGridCols()} gap-6`}
        >
          {initialLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="group relative cursor-pointer overflow-hidden bg-gray-900 rounded-lg animate-pulse"
                style={{ aspectRatio: gridSize === "large" ? "16/10" : "4/3" }}
              >
                <div className="w-full h-full bg-gray-800"></div>
                <div className="absolute top-4 right-4 bg-gray-700 px-3 py-1 rounded-full w-16 h-6"></div>
              </div>
            ))
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-4 opacity-50">�</div>
              <h3 className="text-2xl text-gray-400 mb-2">
                {searchQuery 
                  ? `هیچ پروژه‌ای برای "${searchQuery}" یافت نشد`
                  : selectedCategory === "همه" 
                    ? "هیچ پروژه‌ای یافت نشد" 
                    : `هیچ پروژه‌ای در دسته "${selectedCategory}" یافت نشد`
                }
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? "لطفا کلمات جستجوی دیگری را امتحان کنید"
                  : "پروژه‌های جدید به زودی اضافه خواهند شد"
                }
              </p>
              {(searchQuery || selectedCategory !== "همه") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("همه");
                  }}
                  className="mt-6 px-6 py-2 bg-[#D4AF37] text-black rounded-full hover:bg-[#b8941f] transition-colors"
                >
                  مشاهده همه پروژه‌ها
                </button>
              )}
            </div>
          ) : (
            currentPageProjects.map((project: Project, index: number) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                ease: "easeOut"
              }}
              className="group relative cursor-pointer overflow-hidden bg-gray-900 rounded-lg"
              style={{ aspectRatio: gridSize === "large" ? "16/10" : "4/3" }}
            >
              <Link href={`/project/${project.slug}`} className="block w-full h-full">
                <div className="relative w-full h-full">
                  <Image
                    src={project.main_image || '/images/Hi-logo.png'}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to logo if image fails to load
                      (e.target as HTMLImageElement).src = '/images/Hi-logo.png';
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-2xl font-light mb-2 text-[#D4AF37]">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-4">
                        {project.description}
                      </p>
                      <div className="inline-flex items-center gap-2 text-white">
                        <span className="text-sm">مشاهده پروژه</span>
                        <svg 
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-black/70 text-[#D4AF37] px-3 py-1 rounded-full text-xs">
                    {project.category_name}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16"
          >
            <div className="mb-6 text-gray-400 text-sm">
              صفحه {currentPage} از {totalPages} - نمایش {currentPageProjects.length} از {filteredProjects.length} پروژه
            </div>
            <div className="flex justify-center items-center gap-2 flex-wrap">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-700 disabled:hover:text-white"
              >
                <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(pageNum => {
                  // Show first page, last page, current page, and pages around current
                  return pageNum === 1 || 
                         pageNum === totalPages || 
                         Math.abs(pageNum - currentPage) <= 1;
                })
                .map((pageNum, index, array) => (
                  <div key={pageNum} className="flex items-center gap-2">
                    {/* Show ellipsis if there's a gap */}
                    {index > 0 && array[index - 1] !== pageNum - 1 && (
                      <span className="text-gray-400 px-2">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[40px] px-3 py-2 rounded-lg transition-all duration-300 ${
                        currentPage === pageNum
                          ? "bg-[#D4AF37] text-black font-medium"
                          : "bg-gray-900 border border-gray-700 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  </div>
                ))
              }

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-700 disabled:hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
