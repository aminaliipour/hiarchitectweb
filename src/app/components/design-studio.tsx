"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { MessageCircle, ChevronLeft, Home, Users, Eye, Hammer } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DesignStudio() {
  const [activeStage, setActiveStage] = useState<string | null>(null)
  const [showDetailView, setShowDetailView] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"up" | "right" | "down" | "left">("up")
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)

  const stages = useMemo(() => [
    { 
      id: "مشاوره", 
      label: "مشاوره", 
      color: "#FBCC0A", // زرد اصلی شرکت
      angle: 0, 
      position: "right" as const, // راست (3 o'clock)
      icon: Users,
      bgGradient: "from-yellow-500/20 to-yellow-600/20"
    },
    { 
      id: "نظارت", 
      label: "نظارت", 
      color: "#F5C000", // مشتق زرد کمی تیره‌تر
      angle: 90, 
      position: "down" as const, // پایین (6 o'clock)
      icon: Eye,
      bgGradient: "from-yellow-400/20 to-yellow-500/20"
    },
    { 
      id: "طراحی", 
      label: "طراحی", 
      color: "#E6B800", // مشتق زرد طلایی
      angle: 180, 
      position: "left" as const, // چپ (9 o'clock)
      icon: Home,
      bgGradient: "from-yellow-600/20 to-yellow-700/20"
    },
    { 
      id: "اجرا", 
      label: "اجرا", 
      color: "#FFD700", // مشتق زرد روشن‌تر
      angle: 270, 
      position: "up" as const, // بالا (12 o'clock)
      icon: Hammer,
      bgGradient: "from-yellow-300/20 to-yellow-400/20"
    },
  ], [])

  const stageContent = {
    مشاوره: {
      title: "مشاوره اولیه",
      subtitle: "شروع سفر طراحی",
      description:
        "ما با درک دیدگاه، نیازها و ویژگی‌های منحصربه‌فرد فضای شما آغاز می‌کنیم. تیم ما بازدیدهای میدانی دقیق و گفت‌وگوهای عمیق را برای تعیین پارامترهای پروژه انجام می‌دهد.",
      features: [
        "تحلیل کامل سایت و محیط",
        "بررسی نیازها و الزامات",
        "تعیین بودجه و زمان‌بندی",
        "مشاوره تخصصی رایگان"
      ],
      image: "/images/projects/kazheh/before/3.jpg",
      video: "/placeholder.svg?height=400&width=600",
    },
    نظارت: {
      title: "نظارت بر اجرا",
      subtitle: "کنترل کیفیت و پیشرفت",
      description:
        "تیم متخصص ما بر فرآیند اجرای پروژه نظارت دقیق می‌کند. از شروع کار تا تحویل نهایی، تمام مراحل تحت کنترل کامل قرار دارد تا کیفیت و زمان‌بندی طبق برنامه پیش برود.",
      features: [
        "نظارت مستمر بر اجرا",
        "کنترل کیفیت مواد و کارایی",
        "گزارش‌دهی مرحله‌ای",
        "هماهنگی با پیمانکاران"
      ],
      image: "/images/projects/kazheh/final/1.jpg",
      video: "/placeholder.svg?height=400&width=600",
    },
    طراحی: {
      title: "طراحی تفصیلی",
      subtitle: "تبدیل ایده به واقعیت",
      description:
        "ما برنامه‌های جامع، مدل‌های سه‌بعدی و انتخاب مواد را توسعه می‌دهیم. هر جنبه از طراحی بهینه‌سازی می‌شود تا عملکرد، زیبایی و هماهنگی با دیدگاه شما تضمین شود.",
      features: [
        "نقشه‌های کامل فنی",
        "مدل‌سازی سه‌بعدی",
        "انتخاب مصالح و متریال",
        "محاسبات دقیق هزینه"
      ],
      image: "/placeholder.svg?height=600&width=800",
      video: "/placeholder.svg?height=400&width=600",
      pricingFiles: [
        {
          name: "تعرفه طراحی تجاری",
          path: "/tarahi price/تعرفه طراحی تجاری.pdf"
        },
        {
          name: "تعرفه طراحی مسکونی", 
          path: "/tarahi price/تعرفه طراحی مسکونی.pdf"
        }
      ]
    },
    اجرا: {
      title: "اجرای پروژه",
      subtitle: "تحقق رویای شما",
      description:
        "تیم ما بر اجرای طراحی نظارت دارد و با پیمانکاران و صنعتگران همکاری نزدیک می‌کند تا هر جزئیات به کمال اجرا شود.",
      features: [
        "نظارت کامل بر اجرا",
        "کنترل کیفیت مستمر",
        "هماهنگی با پیمانکاران",
        "تحویل به موقع پروژه"
      ],
      image: "/placeholder.svg?height=600&width=800",
      video: "/placeholder.svg?height=400&width=600",
    },
  }

  // Handle stage click with slide animation from button position
  const handleStageClick = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId)
    if (!stage) return
    
    setActiveStage(stageId)
    setSlideDirection(stage.position) // Use position instead of direction
    setShowDetailView(true)
  }

  // Handle back to wheel
  const handleBackToWheel = () => {
    setShowDetailView(false)
    setActiveStage(null)
  }

  // Remove wheel rotation effect - wheel should stay static
  // useEffect(() => {
  //   // Only animate wheel if not in detail view
  //   if (showDetailView || !activeStage) return
    
  //   // Animate the wheel when active stage changes
  //   const stageIndex = stages.findIndex((stage) => stage.id === activeStage)
  //   const angle = stageIndex * (360 / stages.length)

  //   wheelControls.start({
  //     rotate: -angle,
  //     transition: { type: "spring", stiffness: 100, damping: 20 },
  //   })
  // }, [activeStage, showDetailView, wheelControls, stages])

  return (
    <section id="design-studio" className="relative bg-gray-950 py-24 overflow-hidden">
      {/* Background Elements - Blueprint Animation */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="h-full w-full bg-[url('/placeholder.svg?height=500&width=500')] bg-repeat"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header - Always visible */}
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-4xl font-bold text-white"
          >
            استودیوی مجازی های آرشیتکت
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-gray-300"
          >
            فرآیند طراحی نوآورانه ما را تجربه کنید و ببینید چگونه مفاهیم را به واقعیت تبدیل می‌کنیم.
          </motion.p>
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {!showDetailView ? (
            // Wheel View - Interactive Circle
            <motion.div
              key="wheel"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Interactive Wheel - Static, no rotation */}
              <div className="relative h-[400px] w-[400px] mb-12 flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-yellow-500/30 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm"></div>
                
                {/* Logo - Center with magnetic effect */}
                <motion.div 
                  className="flex items-center justify-center transition-all duration-300 hover:saturate-0 z-10"
                  animate={{
                    x: hoveredStage ? (() => {
                      const stage = stages.find(s => s.id === hoveredStage)
                      if (!stage) return 0
                      const index = stages.indexOf(stage)
                      const angle = (index / stages.length) * 2 * Math.PI
                      return Math.cos(angle) * 20 // کشیدن 20px به سمت دکمه
                    })() : 0,
                    y: hoveredStage ? (() => {
                      const stage = stages.find(s => s.id === hoveredStage)
                      if (!stage) return 0
                      const index = stages.indexOf(stage)
                      const angle = (index / stages.length) * 2 * Math.PI
                      return Math.sin(angle) * 20 // کشیدن 20px به سمت دکمه
                    })() : 0
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Image 
                    src="/images/Hi-logo.png" 
                    alt="Hi Logo" 
                    width={80} 
                    height={40}
                    className="object-contain drop-shadow-lg transition-all duration-300"
                  />
                </motion.div>

                {/* Stage Buttons - Fixed positions, no movement on hover */}
                {stages.map((stage, index) => {
                  const angle = (index / stages.length) * 2 * Math.PI
                  const radius = 150
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius
                  const IconComponent = stage.icon

                  return (
                    <button
                      key={stage.id}
                      onClick={() => handleStageClick(stage.id)}
                      onMouseEnter={() => setHoveredStage(stage.id)}
                      onMouseLeave={() => setHoveredStage(null)}
                      className="absolute group cursor-pointer"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {/* Button Container - No scale animation */}
                      <div 
                        className={`relative h-20 w-20 rounded-full border-2 border-gray-700 bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:border-yellow-500 group-hover:shadow-lg`}
                        style={{
                          boxShadow: `0 0 20px ${stage.color}40`
                        }}
                      >
                        <IconComponent className="h-6 w-6 text-white group-hover:text-yellow-500 transition-colors duration-300" />
                      </div>
                      
                      {/* Label */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <span className="text-sm text-gray-300 group-hover:text-yellow-500 transition-colors duration-300">
                          {stage.label}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Instructions */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center text-gray-400 text-lg"
              >
                روی هر بخش کلیک کنید تا جزئیات آن را مشاهده کنید
              </motion.p>
            </motion.div>
          ) : (
            // Detail View - Slide animation from actual button position
            <motion.div
              key={`detail-${activeStage}`}
              initial={{ 
                opacity: 0,
                // Animation from button position: 
                // up (12 o'clock) = from top, right (3 o'clock) = from right, etc.
                x: slideDirection === "left" ? -800 : slideDirection === "right" ? 800 : 0,
                y: slideDirection === "up" ? -800 : slideDirection === "down" ? 800 : 0,
                scale: 0.9
              }}
              animate={{ 
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0,
                // Exit to opposite direction
                x: slideDirection === "left" ? 800 : slideDirection === "right" ? -800 : 0,
                y: slideDirection === "up" ? 800 : slideDirection === "down" ? -800 : 0,
                scale: 0.9
              }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 25,
                duration: 0.6
              }}
              className="max-w-6xl mx-auto"
            >
              {activeStage && (() => {
                const stage = stages.find(s => s.id === activeStage)!
                const content = stageContent[activeStage as keyof typeof stageContent]
                const IconComponent = stage.icon

                return (
                  <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${stage.bgGradient} border border-gray-800 backdrop-blur-sm`}>
                    {/* Back Button - Small and inside the container */}
                    <motion.button
                      onClick={handleBackToWheel}
                      className="absolute top-4 right-4 z-10 flex items-center gap-1 px-3 py-1.5 text-sm bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-colors duration-300 border border-gray-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <ChevronLeft className="h-3 w-3 rotate-180" />
                      <span>بازگشت</span>
                    </motion.button>

                    {/* Content Grid */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      {/* ...existing code... */}
                      {/* Text Content */}
                      <div className="space-y-8">
                        {/* Icon & Title */}
                        <div className="flex items-center gap-4">
                          <div 
                            className="p-4 rounded-2xl border-2"
                            style={{ 
                              borderColor: stage.color, 
                              backgroundColor: `${stage.color}20` 
                            }}
                          >
                            <IconComponent className="h-8 w-8" style={{ color: stage.color }} />
                          </div>
                          <div>
                            <h3 className="text-4xl font-bold text-white mb-2">
                              {content.title}
                            </h3>
                            <p className="text-xl" style={{ color: stage.color }}>
                              {content.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-lg text-gray-300 leading-relaxed">
                          {content.description}
                        </p>

                        {/* Features List */}
                        <div className="space-y-3">
                          {content.features.map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                              className="flex items-center gap-3"
                            >
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: stage.color }}
                              />
                              <span className="text-gray-300">{feature}</span>
                            </motion.div>
                          ))}
                        </div>

                        {/* Action Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="space-y-4"
                        >
                          {/* Default Contact Button */}
                          <Button 
                            onClick={() => {
                              if (typeof document !== 'undefined') {
                                const contactSection = document.getElementById('contact');
                                if (contactSection) {
                                  contactSection.scrollIntoView({ behavior: 'smooth' });
                                }
                              }
                            }}
                            className="px-8 py-4 text-lg font-medium text-black hover:scale-105 transition-transform duration-300"
                            style={{ backgroundColor: stage.color }}
                          >
                            تماس جهت مشاوره
                          </Button>

                          {/* Pricing Download Buttons for Design Section */}
                          {activeStage === "طراحی" && 'pricingFiles' in content && (
                            <div className="space-y-3">
                              <div className="text-sm text-gray-400 mb-3">دانلود تعرفه طراحی:</div>
                              {(content as {pricingFiles: {name: string, path: string}[]}).pricingFiles.map((file: {name: string, path: string}, index: number) => (
                                <motion.a
                                  key={index}
                                  href={file.path}
                                  download
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.8 + index * 0.1 }}
                                  className="flex items-center gap-3 px-4 py-3 bg-black/30 rounded-lg border border-gray-700 hover:border-yellow-500 transition-all duration-300 group"
                                >
                                  <svg className="h-5 w-5 text-gray-400 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="text-gray-300 group-hover:text-yellow-500 transition-colors">{file.name}</span>
                                </motion.a>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      </div>

                      {/* Visual Content */}
                      <div className="space-y-6">
                        {/* Main Image */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="relative aspect-video overflow-hidden rounded-2xl border border-gray-700"
                        >
                          <Image
                            src={content.image || "/placeholder.svg"}
                            alt={content.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-4 rounded-full bg-black/50 backdrop-blur-sm border border-white/20"
                            >
                              <svg 
                                className="h-12 w-12 text-white ml-1" 
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </motion.button>
                          </div>
                        </motion.div>

                        {/* Stats or Additional Info */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="grid grid-cols-2 gap-4"
                        >
                          {[
                            { label: "تضمین", value: "۱۰۰٪" },
                            { label: "پشتیبانی", value: "۲۴/۷" }
                          ].map((stat, index) => (
                            <div key={index} className="text-center p-4 bg-black/30 rounded-xl border border-gray-800">
                              <div className="text-2xl font-bold" style={{ color: stage.color }}>
                                {stat.value}
                              </div>
                              <div className="text-sm text-gray-400">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Chat Bubble */}
        <div className="fixed bottom-8 left-8 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-black shadow-lg"
          >
            <MessageCircle className="h-8 w-8" />
          </motion.button>
        </div>
      </div>
    </section>
  )
}