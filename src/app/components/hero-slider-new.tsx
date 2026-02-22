"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  filename: string;
  title: string;
  url: string;
  order: number;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Load slides from API
  useEffect(() => {
    const loadSlides = async () => {
      try {
        const response = await fetch('/api/sliders');
        if (response.ok) {
          const data = await response.json();
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
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

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
    <section className="relative h-screen w-full overflow-hidden" id="hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${currentSlideData.url}')`,
            }}
          >
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
                    پروژه معماری
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
                  طراحی و اجرای معماری مدرن
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="flex flex-col gap-4 text-sm text-gray-300 md:flex-row md:gap-8"
                >
                  <div>
                    <span className="text-yellow-500">موقعیت:</span> لاهیجان، گیلان
                  </div>
                  <div>
                    <span className="text-yellow-500">معمار:</span> استودیو های آرشیتکت
                  </div>
                </motion.div>
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
