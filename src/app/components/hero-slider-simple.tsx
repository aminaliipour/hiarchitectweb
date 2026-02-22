"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Slider {
  id: string;
  title: string;
  projectSlug?: string;
  order: number;
  imageUrl: string;
}

export default function HeroSliderSimple() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Load sliders from API
  useEffect(() => {
    const loadSliders = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/sliders-simple?t=${timestamp}`, {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          console.log('🎬 Loaded sliders:', data.sliders);
          setSliders(data.sliders || []);
        } else {
          console.error('Failed to load sliders');
        }
      } catch (error) {
        console.error('Error loading sliders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSliders();
    
    // Refresh sliders every 2 minutes
    const interval = setInterval(loadSliders, 120000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || sliders.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 8000); // 8 seconds per slide

    return () => clearInterval(interval);
  }, [isAutoPlaying, sliders.length, isHovered]);

  const nextSlide = () => {
    if (sliders.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }
  };

  const prevSlide = () => {
    if (sliders.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleSlideClick = () => {
    const currentSlideData = sliders[currentSlide];
    if (currentSlideData?.projectSlug) {
      window.location.href = `/project/${currentSlideData.projectSlug}`;
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

  // Show message if no sliders
  if (sliders.length === 0) {
    return (
      <section className="relative h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">هیچ اسلایدری یافت نشد</div>
          <p className="text-gray-400">لطفا ابتدا اسلایدرهای خود را از پنل مدیریت افزوده کنید</p>
        </div>
      </section>
    );
  }

  const currentSlideData = sliders[currentSlide];

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
          style={{ cursor: currentSlideData?.projectSlug ? 'pointer' : 'default' }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={currentSlideData.imageUrl}
              alt={currentSlideData.title}
              fill
              priority
              quality={100}
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Title Overlay */}
            <div className="relative z-10 flex h-full items-end justify-center pb-24">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-center"
              >
                <h1
                  className="mb-4 text-5xl font-bold text-white md:text-7xl lg:text-8xl"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {currentSlideData.title}
                </h1>

                {/* Show clickable indicator if project link exists */}
                {currentSlideData.projectSlug && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex items-center justify-center gap-2 text-[#D4AF37]"
                  >
                    <span className="text-sm">کلیک کنید تا جزئیات پروژه را ببینید</span>
                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
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
        </>
      )}

      {/* Slide Counter */}
      {sliders.length > 1 && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-8 right-8 z-20 rounded-lg bg-black/40 px-6 py-4 backdrop-blur-md"
        >
          <div className="text-right">
            <div className="text-sm text-gray-300">
              {currentSlide + 1} / {sliders.length}
            </div>
          </div>
        </motion.div>
      )}

      {/* Dots Navigation */}
      {sliders.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-[#D4AF37] w-8' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`برو به اسلاید ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
