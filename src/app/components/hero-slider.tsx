"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroSlides = [
  {
    id: 1,
    title: "املاک صائب",
    subtitle: "طراحی مدرن برای خدمات املاک",
    location: "لاهیجان، گیلان",
    architect: "استودیو های آرشیتکت",
    image: "/images/slides/املاک صائب.jpg",
    category: "تجاری"
  },
  {
    id: 2,
    title: "بوتیک سیران",
    subtitle: "طراحی شیک و معاصر",
    location: "لاهیجان، گیلان",
    architect: "استودیو های آرشیتکت",
    image: "/images/slides/بوتیک سیران.jpg",
    category: "تجاری"
  },
  {
    id: 3,
    title: "سالن زیبایی ال بیوتی",
    subtitle: "فضایی لوکس و آرامش‌بخش",
    location: "لاهیجان، گیلان",
    architect: "استودیو های آرشیتکت",
    image: "/images/slides/سالن زیبایی ال بیوتی.jpg",
    category: "تجاری"
  },
  {
    id: 4,
    title: "طلافروشی آوین",
    subtitle: "طراحی مجلل و باشکوه",
    location: "لاهیجان، گیلان",
    architect: "استودیو های آرشیتکت",
    image: "/images/slides/طلافروشی آوین.JPG",
    category: "تجاری"
  },
  {
    id: 5,
    title: "کلینیک زیبایی سروش",
    subtitle: "محیطی مدرن و حرفه‌ای",
    location: "لاهیجان، گیلان",
    architect: "استودیو های آرشیتکت",
    image: "/images/slides/کلینیک زیبایی سروش.jpeg",
    category: "تجاری"
  },
  {
    id: 6,
    title: "ویلا بازغی",
    subtitle: "زندگی در هماهنگی با طبیعت",
    location: "شمال ایران",
    architect: "استودیو های آرشیتکت",
    image: "/images/slides/ویلا بازغی.JPG",
    category: "ویلایی"
  },
  {
    id: 7,
    title: "ویلا سوستان",
    subtitle: "طراحی مدرن ویلایی",
    location: "شمال ایران",
    architect: "استودیو های آرشیتکت",
    image: "/images/slides/ویلا سوستان.jpg",
    category: "ویلایی"
  },
  {
    id: 8,
    title: "ویلا زمیدان",
    subtitle: "معماری خاص و منحصر‌به‌فرد",
    location: "شمال ایران",
    architect: "استودیو های آرشیتکت",
    image: "/images/slides/ویلای زمیدان.jpg",
    category: "ویلایی"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section 
      className="relative h-screen overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative h-full w-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-full items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mb-4"
                >
                  <span className="inline-block rounded-full border border-yellow-500/30 bg-black/30 px-4 py-2 text-sm text-yellow-500 backdrop-blur-md">
                    {heroSlides[currentSlide].category}
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
                  {heroSlides[currentSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="mb-8 text-xl text-gray-200 md:text-2xl"
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="flex flex-col gap-4 text-sm text-gray-300 md:flex-row md:gap-8"
                >
                  <div>
                    <span className="text-yellow-500">موقعیت:</span> {heroSlides[currentSlide].location}
                  </div>
                  <div>
                    <span className="text-yellow-500">معمار:</span> {heroSlides[currentSlide].architect}
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

      {/* Slide Indicators - removed */}

      {/* Project Info Panel */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-8 right-8 z-20 rounded-lg bg-black/30 p-6 backdrop-blur-md"
      >
        <div className="text-right">
          <div className="mb-2 text-sm text-gray-300">پروژه {currentSlide + 1} از {heroSlides.length}</div>
          <div className="text-lg font-medium text-white">{heroSlides[currentSlide].title}</div>
        </div>
      </motion.div>
    </section>
  );
}
