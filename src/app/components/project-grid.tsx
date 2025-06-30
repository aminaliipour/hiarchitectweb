"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { type Project } from "../lib/projects";

export default function ProjectGrid() {
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [gridSize, setGridSize] = useState("medium");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsResponse = await fetch('/api/projects');
        const projectsData = await projectsResponse.json();
        
        const categoriesResponse = await fetch('/api/projects/categories');
        const categoriesData = await categoriesResponse.json();
        
        setProjects(projectsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project: Project) => 
    selectedCategory === "همه" || project.category === selectedCategory
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
            مجموعه‌ای از پروژه‌های معماری و تجسم‌سازی که توسط تیم ما طراحی و اجرا شده است
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
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm ${
                  selectedCategory === category
                    ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                    : "border-gray-600 text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                }`}
              >
                {category}
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
          {filteredProjects.map((project: Project, index: number) => (
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
                    src={project.mainImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
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
                    {project.category}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <button className="group relative px-8 py-3 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300 overflow-hidden">
            <span className="relative z-10">مشاهده پروژه‌های بیشتر</span>
            <div className="absolute inset-0 bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
