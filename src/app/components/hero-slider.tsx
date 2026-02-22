"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Slide {
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
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Load slides from API
  useEffect(() => {
    const loadSlides = async () => {
      try {
        // Add timestamp to bypass cache
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/sliders?t=${timestamp}`, {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          console.log('🎬 Loaded slides:', data.sliders);
          setSlides(data.sliders || []);
        } else {
          console.error('Failed to load slides');
        }
      } catch (error) {
        console.error('Error loading slides:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSlides();
    
    // Refresh slides every 2 minutes to catch new uploads
    const interval = setInterval(loadSlides, 120000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // Changed from 5000 to 10000 (10 seconds)

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, isHovered]);

  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleSlideClick = () => {
    const currentSlideData = slides[currentSlide];
    if (currentSlideData?.project_link) {
      // Navigate to project page
      window.location.href = `/project/${currentSlideData.project_link}`;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <section className="relative h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-2xl">در حال بارگذاری...</div>
      </section>
    );
  }

  // Show message if no slides
  if (slides.length === 0) {
    return (
      <section className="relative h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-2xl">هیچ اسلایدی یافت نشد</div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className="relative h-screen w-full overflow-hidden" 
      id="hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
          onClick={handleSlideClick}
          style={{ cursor: currentSlideData?.project_link ? 'pointer' : 'default' }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={currentSlideData.url}
              alt={currentSlideData.title}
              fill
              priority
              quality={100}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex h-full items-center justify-center">
              <div className="container mx-auto px-6 text-center lg:text-right">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mb-6"
                >
                  <span className="inline-block rounded-full border border-yellow-500/30 bg-black/30 px-4 py-2 text-sm text-yellow-500 backdrop-blur-md">
                    {currentSlideData.category || 'پروژه معماری'}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mb-6 text-5xl font-bold text-white md:text-7xl lg:text-8xl"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {currentSlideData.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="mb-8 text-xl text-gray-200 md:text-2xl"
                >
                  {currentSlideData.subtitle || 'طراحی و اجرای معماری مدرن'}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="flex flex-col gap-4 text-sm text-gray-300 md:flex-row md:gap-8"
                >
                  <div>
                    <span className="text-yellow-500">موقعیت:</span> {currentSlideData.location || 'لاهیجان، گیلان'}
                  </div>
                  <div>
                    <span className="text-yellow-500">معمار:</span> {currentSlideData.architect || 'استودیو های آرشیتکت'}
                  </div>
                </motion.div>

                {/* Show clickable indicator if project link exists */}
                {currentSlideData.project_link && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                    className="mt-6 flex items-center gap-2 text-yellow-500"
                  >
                    <span className="text-sm">🔗 کلیک کنید تا جزئیات پروژه را ببینید</span>
                    <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-md transition-all hover:bg-black/50 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-md transition-all hover:bg-black/50 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Project Info Panel */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-8 right-8 z-20 rounded-lg bg-black/30 p-6 backdrop-blur-md"
      >
        <div className="text-right">
          <div className="mb-2 text-sm text-gray-300">پروژه {currentSlide + 1} از {slides.length}</div>
          <div className="text-lg font-medium text-white">{currentSlideData.title}</div>
        </div>
      </motion.div>
    </section>
  );
}
