"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Helper function to get all images from a project folder
const getProjectImages = (projectPath: string, imageNames: string[]) => {
  return imageNames.map(name => `${projectPath}/${name}`)
}

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("همه")
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<string>("")

  const rotateY = useMotionValue(0)
  const scale = useTransform(rotateY, [-45, 0, 45], [0.8, 1, 0.8])
  const opacity = useTransform(rotateY, [-45, 0, 45], [0.5, 1, 0.5])

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      rotateY.set(rotateY.get() === 0 ? 5 : rotateY.get() === 5 ? -5 : 0)
    }, 3000)

    return () => clearInterval(interval)
  }, [rotateY])

  const filters = ["همه", "مسکونی", "تجاری", "ویلایی"]

  const projects = [
    // تجاری
    {
      id: 1,
      title: "آزمایشگاه رحمانی",
      category: "تجاری",
      image: "/images/projects/تجاری/آزمایشگاه رحمانی/01(1).jpg",
      images: getProjectImages("/images/projects/تجاری/آزمایشگاه رحمانی", [
        "004.jpg", "01(1).jpg", "02.jpg", "03.jpg", "04(1).jpg", "05.jpg", "07.jpg", "088.jpg"
      ]),
      description: "طراحی مدرن و کارآمد برای آزمایشگاه تشخیص طبی",
    },
    {
      id: 2,
      title: "آوین گلد",
      category: "تجاری", 
      image: "/images/projects/تجاری/آوین گلد/2025_06_28_11_25_IMG_7151.JPG",
      images: getProjectImages("/images/projects/تجاری/آوین گلد", [
        "2025_06_28_11_25_IMG_7151.JPG", "2025_06_28_11_25_IMG_7152.JPG", "2025_06_28_11_25_IMG_7153.JPG", "2025_06_28_11_25_IMG_7154.JPG"
      ]),
      description: "طلافروشی مجلل با طراحی لوکس و نورپردازی حرفه‌ای",
    },
    {
      id: 3,
      title: "بوتیک لنا",
      category: "تجاری",
      image: "/images/projects/تجاری/بوتیک لنا/IMG_0538.JPG",
      images: getProjectImages("/images/projects/تجاری/بوتیک لنا", [
        "IMG_0538.JPG", "IMG_0539.JPG", "IMG_0540.JPG", "IMG_0541.JPG", "IMG_0542.JPG", "IMG_0543.JPG", "IMG_0544.JPG", "IMG_0545.JPG", "IMG_0546.JPG", "IMG_0547.JPG"
      ]),
      description: "بوتیک مد و پوشاک با طراحی شیک و مدرن",
    },
    {
      id: 4,
      title: "سالن زیبایی نگار حیدری",
      category: "تجاری",
      image: "/images/projects/تجاری/سالن زیبایی نگار حیدری/IMG_1356.JPG",
      images: getProjectImages("/images/projects/تجاری/سالن زیبایی نگار حیدری", [
        "IMG_1356.JPG", "IMG_1357.JPG", "IMG_1358.JPG", "IMG_1359.JPG", "IMG_1360.JPG", "IMG_1361.JPG", "IMG_1362.JPG", "IMG_1363.JPG"
      ]),
      description: "سالن زیبایی با فضای آرامش‌بخش و تجهیزات مدرن",
    },
    {
      id: 5,
      title: "گل از ماهان",
      category: "تجاری",
      image: "/images/projects/تجاری/گل از ماهان/1.jpg",
      images: getProjectImages("/images/projects/تجاری/گل از ماهان", [
        "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"
      ]),
      description: "گل فروشی زیبا با طراحی طبیعی و دلنشین",
    },
    
    // مسکونی
    {
      id: 6,
      title: "مسکونی دانش",
      category: "مسکونی",
      image: "/images/projects/مسکونی/مسکونی دانش/1.jpg",
      images: getProjectImages("/images/projects/مسکونی/مسکونی دانش", [
        "0.jpg", "0003.jpg", "0022222.jpg", "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg"
      ]),
      description: "آپارتمان مسکونی با طراحی مدرن و کارآمد",
    },
    {
      id: 7,
      title: "مسکونی کارگر14",
      category: "مسکونی",
      image: "/images/projects/مسکونی/مسکونی کارگر14/1 (1).jpg",
      images: getProjectImages("/images/projects/مسکونی/مسکونی کارگر14", [
        "1 (1).jpg", "2 (1) (2).jpg", "3 (1).jpg", "4 (1).jpg", "5 (1).jpg", "5 (1) (2).jpg", "6 (2).jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg"
      ]),
      description: "واحد مسکونی در خیابان کارگر با طراحی معاصر",
    },
    
    // ویلایی
    {
      id: 8,
      title: "محوطه ویلا ساحل",
      category: "ویلایی",
      image: "/images/projects/ویلایی/محوطه ویلا ساحل/IMG_7453.jpeg",
      images: getProjectImages("/images/projects/ویلایی/محوطه ویلا ساحل", [
        "IMG_7453.jpeg", "IMG_7454.jpeg", "IMG_7455.jpeg", "IMG_7456.jpeg", "IMG_7457.jpeg", "IMG_7458.jpeg", "IMG_7459.jpeg", "IMG_7460.jpeg"
      ]),
      description: "طراحی محوطه ویلا در کنار ساحل با منظره‌ای بی‌نظیر",
    },
    {
      id: 9,
      title: "ویلا فدایی",
      category: "ویلایی",
      image: "/images/projects/ویلایی/ویلا فدایی/1.jpg",
      images: getProjectImages("/images/projects/ویلایی/ویلا فدایی", [
        "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"
      ]),
      description: "ویلای مدرن با طراحی منحصر‌به‌فرد و نمای زیبا",
    },
    {
      id: 10,
      title: "ویلا گلپور",
      category: "ویلایی",
      image: "/images/projects/ویلایی/ویلا گلپور/1.jpg",
      images: getProjectImages("/images/projects/ویلایی/ویلا گلپور", [
        "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "8.jpg", "9.jpg", "17.jpg"
      ]),
      description: "ویلای لوکس با باغ و فضای سبز گسترده",
    },
  ]

  const spotlightProjects = [
    {
      id: 1,
      title: "آوین گلد",
      description: "طلافروشی مجلل با طراحی لوکس که فضایی پر از زیبایی و شکوه برای نمایش جواهرات ایجاد می‌کند.",
      image: "/images/projects/تجاری/آوین گلد/2025_06_28_11_25_IMG_7151.JPG",
      details: "تکمیل‌شده در ۱۴۰۳ • تجاری • طراحی داخلی",
    },
    {
      id: 2,
      title: "ویلا گلپور",
      description: "ویلای لوکس با باغ گسترده که ترکیبی هماهنگ از معماری مدرن و طراحی محوطه‌سازی ارائه می‌دهد.",
      image: "/images/projects/ویلایی/ویلا گلپور/1.jpg",
      details: "تکمیل‌شده در ۱۴۰۳ • ویلایی • معماری + محوطه‌سازی",
    },
    {
      id: 3,
      title: "سالن زیبایی نگار حیدری",
      description: "فضایی آرامش‌بخش و مدرن برای خدمات زیبایی با توجه به آسایش و راحتی مشتریان.",
      image: "/images/projects/تجاری/سالن زیبایی نگار حیدری/IMG_1356.JPG",
      details: "تکمیل‌شده در ۱۴۰۳ • تجاری • طراحی داخلی",
    },
  ]

  const filteredProjects =
    activeFilter === "همه" ? projects : projects.filter((project) => project.category === activeFilter)

  const openProjectGallery = (project: typeof projects[0]) => {
    setLightboxImages(project.images)
    setLightboxIndex(0)
    setSelectedProject(project.title)
    setLightboxOpen(true)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)
  }

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)
  }

  return (
    <section id="portfolio" className="bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-4xl font-bold text-white"
          >
            نمونه‌کارهای ما
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-gray-300"
          >
            مجموعه متنوع پروژه‌های ما را کاوش کنید که تعهد ما به طراحی نوآورانه و یکپارچگی محلی را به نمایش می‌گذارند.
          </motion.p>
        </div>

        {/* Project Spotlight with 3D effect */}
        <div className="mb-20">
          <h3 className="mb-8 text-center text-2xl font-bold text-white">پروژه‌های شاخص</h3>
          <div className="relative overflow-hidden rounded-xl bg-gray-900/30 backdrop-blur-sm border border-gray-800">
            <motion.div
              className="relative h-[60vh] w-full perspective-1000"
              style={{
                rotateY,
                scale,
                opacity,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={spotlightIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={spotlightProjects[spotlightIndex].image || "/placeholder.svg"}
                    alt={spotlightProjects[spotlightIndex].title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <h4 className="mb-2 text-3xl font-bold text-white">{spotlightProjects[spotlightIndex].title}</h4>
                    <p className="mb-4 max-w-2xl text-gray-200">{spotlightProjects[spotlightIndex].description}</p>
                    <p className="text-sm text-yellow-500">{spotlightProjects[spotlightIndex].details}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setSpotlightIndex((prev) => (prev === 0 ? spotlightProjects.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-yellow-500 hover:text-black"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setSpotlightIndex((prev) => (prev === spotlightProjects.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-yellow-500 hover:text-black"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-2">
              {spotlightProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSpotlightIndex(index)}
                  className={`h-2 w-2 rounded-full ${spotlightIndex === index ? "bg-yellow-500" : "bg-white/50"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {filters.map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-colors",
                activeFilter === filter
                  ? "bg-yellow-500 text-black"
                  : "bg-black text-white border border-gray-800 hover:border-yellow-500/50",
              )}
            >
              {filter}
            </motion.button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" ref={containerRef}>
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-gray-900 border border-gray-800"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <motion.button
                      onClick={() => openProjectGallery(project)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-black shadow-lg"
                    >
                      <Maximize2 className="h-6 w-6" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">{project.title}</h3>
                  <p className="mb-3 text-sm text-gray-400 line-clamp-2">{project.description}</p>
                  <span className="inline-block rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-500">
                    {project.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[90vh] max-w-[90vw] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute -top-12 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Image container */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                <Image
                  src={lightboxImages[lightboxIndex] || "/placeholder.svg"}
                  alt={`${selectedProject} - تصویر ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Navigation arrows */}
              {lightboxImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-yellow-500 hover:text-black"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-yellow-500 hover:text-black"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image counter and project title */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
                <div className="rounded-full bg-black/50 px-4 py-2 text-white backdrop-blur-sm">
                  <p className="text-center text-sm">
                    {selectedProject} - {lightboxIndex + 1} از {lightboxImages.length}
                  </p>
                </div>
              </div>

              {/* Thumbnails */}
              {lightboxImages.length > 1 && (
                <div className="absolute -bottom-20 left-1/2 flex -translate-x-1/2 transform gap-2 max-w-full overflow-x-auto">
                  {lightboxImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setLightboxIndex(index)}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 transition-colors ${
                        index === lightboxIndex ? "border-yellow-500" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}