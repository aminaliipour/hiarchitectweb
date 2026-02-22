"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { type Project } from "../types";

export default function ProjectGrid() {
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [gridSize, setGridSize] = useState("medium");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50); // Display all projects initially - increased from 12

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch projects from API with limit
        const projectsUrl = `/api/projects?status=published&limit=${limit}&page=${currentPage}`;
        console.log('Fetching projects from:', projectsUrl);
        
        const projectsResponse = await fetch(projectsUrl);
        if (!projectsResponse.ok) {
          throw new Error(`Projects API failed: ${projectsResponse.status}`);
        }
        const projectsData = await projectsResponse.json();
        
        console.log('Projects data received:', {
          projectsCount: projectsData.projects?.length || 0,
          pagination: projectsData.pagination
        });
        
        // Check if there are more projects to load
        setHasMore(projectsData.pagination && projectsData.pagination.pages > currentPage);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/projects/categories');
        if (!categoriesResponse.ok) {
          console.warn('Categories API failed:', categoriesResponse.status);
          setProjects(projectsData.projects || []);
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
        
        setProjects(projectsWithGallery);
        setCategories([{id: 'all', name: 'همه', slug: 'all'}, ...(categoriesData || [])]);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setCategories([{id: 'all', name: 'همه', slug: 'all'}]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage, limit]);

  // Function to load more projects
  const loadMoreProjects = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const projectsResponse = await fetch(`/api/projects?status=published&limit=${limit}&page=${nextPage}`);
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        
        // For each new project, try to get its gallery info
        const projectsWithGallery = await Promise.all(
          (projectsData.projects || []).map(async (project: Project) => {
            try {
              const galleryResponse = await fetch(`/api/projects/gallery?slug=${project.slug}`);
              if (galleryResponse.ok) {
                const galleryData = await galleryResponse.json();
                
                let mainImage = project.main_image;
                if (galleryData.mainImage) {
                  const safeProjectFolder = project.slug.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
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
        
        // Append new projects to existing ones
        setProjects(prevProjects => [...prevProjects, ...projectsWithGallery]);
        setCurrentPage(nextPage);
        setHasMore(projectsData.pagination && projectsData.pagination.pages > nextPage);
      }
    } catch (error) {
      console.error('Error loading more projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project: Project) => 
    selectedCategory === "همه" || project.category_name === selectedCategory
  );

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
              <div className="text-6xl mb-4 opacity-50">📁</div>
              <h3 className="text-2xl text-gray-400 mb-2">
                {selectedCategory === "همه" ? "هیچ پروژه‌ای یافت نشد" : `هیچ پروژه‌ای در دسته "${selectedCategory}" یافت نشد`}
              </h3>
              <p className="text-gray-500">
                پروژه‌های جدید به زودی اضافه خواهند شد
              </p>
            </div>
          ) : (
            filteredProjects.map((project: Project, index: number) => (
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

        {/* Load More Button */}
        {hasMore && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16"
          >
            <button 
              onClick={loadMoreProjects}
              disabled={loading}
              className="group relative px-8 py-3 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    در حال بارگذاری...
                  </>
                ) : (
                  'مشاهده پروژه‌های بیشتر'
                )}
              </span>
              <div className="absolute inset-0 bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
