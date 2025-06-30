"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react"

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)
  const [teamSlideIndex, setTeamSlideIndex] = useState(0)

  // Team images from journey folder
  const teamImages = [
    "/images/journey/3.png",
    "/images/journey/4.JPG", 
    "/images/journey/5.JPG",
    "/images/journey/6.JPG"
  ]

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  const milestones = [
    {
      year: "۱۳۹۵",
      title: "تأسیس در لاهیجان",
      description:
        "های آرشیتکت با چشم‌انداز ترکیب زیبایی‌شناسی سنتی لاهیجان با اصول طراحی مدرن تأسیس شد.",
      image: "/images/projects/kazheh/final/1.jpg",
      video: "/images/journey/1.mp4",
      hotspotPosition: { x: 70, y: 30 },
    },
    {
      year: "معرفی",
      title: "معرفی شرکت های آرشیتکت",
      description:
        "شرکت های آرشیتکت در قلب شهر لاهیجان فعالیت می‌کند. ما با تمرکز بر طراحی منحصر‌به‌فرد، تلاش می‌کنیم بهترین تجربه را برای مشتریان‌مان رقم بزنیم و فضاهایی خلق کنیم که زندگی در آن‌ها جریان داشته باشد. در های آرشیتکت، طراحی فراتر از ساختن یک فضاست. ما معتقدیم هر طراحی باید بازتابی از زیبایی، کارآمدی و آرامش باشد.",
      image: "/images/journey/2.jpg",
      video: "/placeholder.svg?height=600&width=800",
      hotspotPosition: { x: 30, y: 60 },
    },
    {
      year: "تیم",
      title: "معرفی تیم",
      description: "در شرکت معماری ما، ترکیب بی‌نظیری از ناظرین باتجربه، طراحان نوآور، مدیران توانمند و متخصصین آی‌تی حرفه‌ای کنار هم قرار گرفته‌اند تا هر پروژه را از ایده تا اجرا، با دیدی نو و تکنولوژی روز، به بهترین شکل ممکن به سرانجام برسانند.",
      image: "/images/projects/kazheh/final/1.jpg",
      video: "/placeholder.svg?height=600&width=800",
      hotspotPosition: { x: 80, y: 50 },
    },
    {
      year: "1404",
      title: "بیش از ۱۰۰ پروژه تکمیل‌شده",
      description: "به نقطه عطفی با تکمیل بیش از ۱۰۰ پروژه موفق در فضاهای مسکونی و تجاری رسیدیم.",
      image: "/images/journey/7.png",
      video: "/placeholder.svg?height=600&width=800",
      hotspotPosition: { x: 20, y: 40 },
    },
  ]

  return (
    <section id="timeline" ref={containerRef} className="relative bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-4xl font-bold text-white"
          >
            سفر ما
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-gray-300"
          >
            از ریشه‌هایمان در لاهیجان تا تبدیل شدن به نوآوری پیشرو در معماری، نقاط عطفی که داستان ما را شکل داده‌اند را کاوش کنید.
          </motion.p>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="h-full w-full bg-[url('/placeholder.svg?height=500&width=500')] bg-repeat opacity-20"></div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative mx-auto max-w-5xl">
          {/* Progress Line */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 transform bg-gray-800"></div>
          <motion.div
            className="absolute left-1/2 top-0 w-px -translate-x-1/2 transform bg-yellow-500"
            style={{ height: progressHeight }}
          ></motion.div>

          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative mb-24 flex flex-col items-center ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Year Marker */}
              <div className="absolute left-1/2 top-0 z-10 -mt-2 -translate-x-1/2 transform">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-xl font-bold text-black"
                >
                  {milestone.year}
                </motion.div>
              </div>

              {/* Content */}
              <div className="mt-20 w-full md:w-1/2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`overflow-hidden rounded-xl border border-gray-800 bg-black/60 p-6 backdrop-blur-sm ${
                    index % 2 === 0 ? "md:ml-8" : "md:mr-8"
                  }`}
                >
                  <h3 className="mb-2 text-2xl font-bold text-white">{milestone.title}</h3>
                  <p className="mb-4 text-gray-300">{milestone.description}</p>
                  <div className="relative h-60 w-full overflow-hidden rounded-lg">
                    {milestone.video && milestone.video.endsWith('.mp4') ? (
                      <video
                        src={milestone.video}
                        className="h-full w-full object-contain bg-black transition-transform duration-500 hover:scale-110"
                        controls
                        muted
                        loop
                      />
                    ) : milestone.year === "تیم" ? (
                      // Team slider for images 3-6
                      <div className="relative h-full w-full">
                        <Image
                          src={teamImages[teamSlideIndex]}
                          alt={`تیم عکس ${teamSlideIndex + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                        
                        {/* Slider controls */}
                        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setTeamSlideIndex(prev => prev > 0 ? prev - 1 : teamImages.length - 1)}
                            className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </button>
                          <button
                            onClick={() => setTeamSlideIndex(prev => prev < teamImages.length - 1 ? prev + 1 : 0)}
                            className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>
                        </div>
                        
                        {/* Slide indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {teamImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setTeamSlideIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === teamSlideIndex ? 'bg-yellow-500' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={milestone.image || "/placeholder.svg"}
                          alt={milestone.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                        
                        {/* Interactive Hotspot - only for images */}
                        <div
                          className="absolute cursor-pointer"
                          style={{
                            left: `${milestone.hotspotPosition.x}%`,
                            top: `${milestone.hotspotPosition.y}%`,
                          }}
                        >
                          {/* <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 2,
                            }}
                            onClick={() => setActiveHotspot(index)}
                            className="relative h-8 w-8 rounded-full bg-yellow-500/80 backdrop-blur-sm"
                          >
                            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-yellow-500"></div>
                          </motion.div> */}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button 
            className="bg-yellow-500 text-black hover:bg-yellow-400"
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            به سفر ما بپیوندید
          </Button>
        </div>
      </div>

      {/* Hotspot Modal */}
      <AnimatePresence>
        {activeHotspot !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative mx-4 max-w-4xl rounded-xl bg-gray-900 p-4 sm:p-6"
            >
              <button
                onClick={() => setActiveHotspot(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  {activeHotspot !== null && milestones[activeHotspot].video.endsWith('.mp4') ? (
                    <video
                      src={milestones[activeHotspot].video}
                      className="h-full w-full object-contain bg-black"
                      controls
                      autoPlay
                      muted
                      loop
                    />
                  ) : (
                    <>
                      <Image
                        src={activeHotspot !== null ? milestones[activeHotspot].video : "/placeholder.svg"}
                        alt="ویدئو پروژه"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-black"
                        >
                          <Play className="h-8 w-8" />
                        </motion.div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {activeHotspot !== null ? milestones[activeHotspot].title : ""}
                  </h3>
                  <p className="mb-4 text-gray-300">
                    {activeHotspot !== null ? milestones[activeHotspot].description : ""}
                  </p>
                  <p className="mb-6 text-gray-400">
                    این پروژه تعهد ما به ترکیب عناصر سنتی با اصول طراحی مدرن را به نمایش می‌گذارد. فرآیند بازسازی شامل برنامه‌ریزی دقیق و اجرا برای حفظ اهمیت فرهنگی و افزودن عملکرد معاصر بود.
                  </p>
                  <Button className="bg-yellow-500 text-black hover:bg-yellow-400">مشاهده مطالعه کامل پروژه</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// Helper component for AnimatePresence
import { AnimatePresence } from "framer-motion"