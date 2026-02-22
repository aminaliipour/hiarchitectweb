"use client";
import React, { useEffect, useRef, useState, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Phone } from "lucide-react";
import type { Project, FormData as ContactFormData, Rotation, ProjectImage } from "../types";

// Custom ChevronDown component (SVG icon)
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
  >
    <path d="M19 9l-7 7-7-7" />
  </svg>
);

// Helper function to get random offset within range (now only used inside useEffect)
const getRandomOffset = (min: number, max: number): number => min + Math.random() * (max - min);

// Static positions for SSR (will be randomized in useEffect)
const getStaticPosition = (index: number) => ({
  x: `${25 + (index * 15) % 60}%`,
  y: `${20 + (index * 20) % 50}%`
});

// Define initial project data (positions will be randomized later)
const initialProjectsData: Project[] = [
  {
    id: 1,
    title: "طلافروشی آوین گلد",
    description: "تحول یک طلافروشی سنتی با طراحی معاصر، با استفاده از متریال مدرن و نورپردازی خلاقانه برای ایجاد فضایی لوکس و جذاب.",
    images: [
      { src: "/images/projects/تجاری/آوین گلد/2025_06_28_11_25_IMG_7151.JPG", badge: "نمای داخلی" },
      { src: "/images/projects/تجاری/آوین گلد/2025_06_28_11_25_IMG_7152.JPG", badge: "ویترین" },
      { src: "/images/projects/تجاری/آوین گلد/2025_06_28_11_25_IMG_7153.JPG", badge: "طراحی نهایی" },
      { src: "/images/slides/طلافروشی آوین.JPG", badge: "نمای کلی" },
    ],
    position: { x: "0%", y: "0%" }, // Placeholder, will be randomized
    details: "۲۰۲۴ • ۱۰۰ مترمربع • تجاری",
  },
  {
    id: 2,
    title: "ویلای گلپور",
    description: "طراحی ویلای مدرن با الهام از طبیعت، ایجاد فضایی آرام و زیبا با چشم‌انداز بی‌نظیر به طبیعت.",
    images: [
      { src: "/images/projects/ویلایی/ویلا گلپور/1.jpg", badge: "نمای بیرونی" },
      { src: "/images/projects/ویلایی/ویلا گلپور/2.jpg", badge: "فضای داخلی" },
      { src: "/images/projects/ویلایی/ویلا گلپور/3.jpg", badge: "اتاق پذیرایی" },
      { src: "/images/projects/ویلایی/ویلا گلپور/4.jpg", badge: "آشپزخانه" },
    ],
    position: { x: "0%", y: "0%" }, // Placeholder
    details: "۲۰۲۴ • ۳۰۰ مترمربع • ویلایی",
  },
  {
    id: 3,
    title: "بوتیک سیران",
    description: "طراحی داخلی بوتیک مدرن با فضای جذاب و کاربردی برای عرضه محصولات فشن و پوشاک.",
    images: [
      { src: "/images/slides/بوتیک سیران.jpg", badge: "نمای بوتیک" },
      { src: "/images/slides/سالن زیبایی ال بیوتی.jpg", badge: "فضای فروش" },
      { src: "/images/slides/کلینیک زیبایی سروش.jpeg", badge: "طراحی داخلی" },
    ],
    position: { x: "0%", y: "0%" }, // Placeholder
    details: "۲۰۲۴ • ۸۰ مترمربع • تجاری",
  },
  {
    id: 4,
    title: "پروژه‌های ویلایی",
    description: "مجموعه‌ای از پروژه‌های ویلایی با طراحی منحصر به فرد و هماهنگ با طبیعت اطراف.",
    images: [
      { src: "/images/slides/ویلا بازغی.JPG", badge: "ویلا بازغی" },
      { src: "/images/slides/ویلا سوستان.jpg", badge: "ویلا سوستان" },
      { src: "/images/slides/ویلای زمیدان.jpg", badge: "ویلای زمیدان" },
    ],
    position: { x: "0%", y: "0%" }, // Placeholder
    details: "۲۰۲۳-۲۰۲۴ • ویلایی",
  },
];


const Hero: React.FC = () => {
  // const [activeProject, setActiveProject] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({ name: "", email: "", phone: "", message: "" });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<Rotation>({ x: 0, y: 0 });

  const [dynamicProjects, setDynamicProjects] = useState<Project[]>([]);
  const [currentImages, setCurrentImages] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDynamicProjects(
      initialProjectsData.map((p) => ({
        ...p,
        position: {
          x: `${getRandomOffset(15, 85)}%`,
          y: `${getRandomOffset(15, 75)}%`,
        }
      }))
    );
    setCurrentImages(initialProjectsData.map(() => 0));
  }, []);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setRotation({
        x: ((mouseY - centerY) / centerY) * 8, // Reduced rotation sensitivity slightly
        y: ((mouseX - centerX) / centerX) * 8,
      });
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove);
      return () => canvas.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  useEffect(() => {
    if (dynamicProjects.length === 0) return; // Don't run interval if projects not loaded

    const interval = setInterval(() => {
      setCurrentImages((prevIndices) =>
        prevIndices.map((imgIndex, projectIndex) => {
          // Ensure projectIndex is valid for dynamicProjects
          if (projectIndex < dynamicProjects.length && dynamicProjects[projectIndex].images) {
            const projectImageCount = dynamicProjects[projectIndex].images.length;
            return projectImageCount > 0 ? (imgIndex + 1) % projectImageCount : 0;
          }
          return 0; // Default if project or images are not available
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [dynamicProjects]); 

  // const handleProjectClick = (projectId: number) => { // Use projectId to find index if needed or pass index directly
  //   const projectIndex = dynamicProjects.findIndex(p => p.id === projectId);
  //   if (projectIndex !== -1) {
  //     setActiveProject(activeProject === projectIndex ? null : projectIndex);
  //   }
  // };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("درخواست شما با موفقیت ارسال شد! به زودی با شما تماس خواهیم گرفت.");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setFormVisible(false);
    // setActiveProject(null); // Also close active project popup
  };

  const shapeVariants = {
    initial: { clipPath: "polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)" },
    morph1: { clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" },
    morph2: { clipPath: "polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)" },
  };

  const floatVariants = {
    float: (i: number) => {
      if (!isClient) {
        // Return static animation for SSR
        return {
          y: 0,
          opacity: 0.6,
          x: 0,
          transition: { duration: 0 }
        };
      }
      
      return {
        y: [0, getRandomOffset(0, 80), getRandomOffset(-250, 250), getRandomOffset(-350, 350), 0],
        opacity: [0.6, 1, 0.7, 0.9, 0.6],
        x: [0, getRandomOffset(-135, 135), getRandomOffset(-150, 150), getRandomOffset(-200, 200), 0],
        transition: {
          y: { duration: 8 + getRandomOffset(0, 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
          opacity: { duration: 8 + getRandomOffset(0, 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
          x: { duration: 9 + getRandomOffset(0, 5), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
        },
      };
    }
  };

  const depthVariants = {
    hidden: {
      opacity: 0,
      scale: 0.6,
      x: 0,
      y: isClient ? getRandomOffset(-1000, 100) : -500,
      rotate: isClient ? getRandomOffset(-50, 250) : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.6,
      x: isClient ? getRandomOffset(-70, 70) : 0,
      y: isClient ? getRandomOffset(-70, 70) : 0,
      rotate: isClient ? getRandomOffset(25, 250) : 0,
    },
  };
  
  const getCurrentProjectImage = (project: Project, projectIndex: number): ProjectImage | null => {
    if (!project || !project.images || project.images.length === 0 || currentImages[projectIndex] === undefined) {
      return null; // Return null or a default image object if data is not as expected
    }
    return project.images[currentImages[projectIndex]];
  };


  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      <div
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{
          perspective: "1500px",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.05),transparent)]"></div>
        {dynamicProjects.map((project, index) => {
          const currentImage = getCurrentProjectImage(project, index);
          if (!currentImage) return null; // Skip rendering if no image
          return (
            <motion.div
              key={project.id}
              className="absolute w-64 h-90 sm:w-72 sm:h-96 md:w-80 md:h-[26rem] origin-center" // Responsive size
              style={{
                left: isClient ? project.position.x : getStaticPosition(index).x,
                top: isClient ? project.position.y : getStaticPosition(index).y,
                transform: "translate(-50%, -50%)",
              }}
              custom={index} 
              animate="float"
              variants={{
                ...shapeVariants, 
                float: floatVariants.float(index), 
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${project.id}-${currentImage.src}`} // More unique key
                  variants={depthVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 1 }}
                  className="absolute inset-0 shadow-2xl" 
                >
                  <img
                    src={currentImage.src}
                    alt={`${project.title} - ${currentImage.badge}`}
                    className="h-full w-full object-cover rounded-xl"
                    style={{ maskImage: "linear-gradient(to top, transparent 15%, black 70%)" }} 
                  />
                  <motion.div
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/75 text-white text-xs rounded-full backdrop-blur-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }} 
                  >
                    {currentImage.badge}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-between py-8 sm:py-12 px-4 sm:px-6 text-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 sm:mb-6">
            <img
              src="/images/Hi-logo.png" 
              alt="لوگوی های آرشیتکت"
              width={180} 
              height={90} 
              className="mx-auto h-auto" 
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            های آرشیتکت
            <span className="block mt-2 sm:mt-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-yellow-300">
              ما<span className="mx-0.5 inline-block"></span>زندگی را با طراحی میسازیم
            </span>
          </h1>
        </div>


        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          <a
            href="#portfolio" 
            className="rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-base sm:text-lg font-medium text-white bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-black"
          >
           برای دیدن نمونه کار ها کلیک کنید
          </a>
          <a href="#portfolio" className="flex flex-col items-center text-white/80 hover:text-yellow-300 transition-colors">
            <span className="text-xs sm:text-sm mb-1 sm:mb-2">به پایین اسکرول کنید</span>
            <ChevronDownIcon className="h-5 w-5 sm:h-6 sm:w-6 animate-bounce" />
          </a>
        </div>
      </div>

      <AnimatePresence>
        {formVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4" 
            onClick={() => setFormVisible(false)} 
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0, transition: {duration: 0.25} }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="bg-gray-800 text-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()} 
            >
              <h2 id="form-title" className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-orange-300 text-center">درخواست مشاوره</h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label htmlFor="name-input" className="block text-sm font-medium text-gray-300 mb-1">
                    نام و نام خانوادگی <User className="inline h-4 w-4 ml-1 text-orange-300" />
                  </label>
                  <input
                    id="name-input" type="text" name="name" value={formData.name} onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 placeholder-gray-500"
                    placeholder="نام شما" required aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="email-input" className="block text-sm font-medium text-gray-300 mb-1">
                    ایمیل <Mail className="inline h-4 w-4 ml-1 text-orange-300" />
                  </label>
                  <input
                    id="email-input" type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 placeholder-gray-500"
                    placeholder="example@email.com" required aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="phone-input" className="block text-sm font-medium text-gray-300 mb-1">
                    تلفن <Phone className="inline h-4 w-4 ml-1 text-orange-300" />
                  </label>
                  <input
                    id="phone-input" type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 placeholder-gray-500"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹" required aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="message-input" className="block text-sm font-medium text-gray-300 mb-1">پیام (اختیاری)</label>
                  <textarea
                    id="message-input" name="message" value={formData.message} onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 h-24 resize-none custom-scrollbar placeholder-gray-500"
                    placeholder="توضیحات پروژه یا درخواست شما..."
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center pt-2 space-y-3 sm:space-y-0 sm:space-x-3 rtl:sm:space-x-reverse">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-orange-400 text-black rounded-full hover:bg-orange-500 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    ارسال درخواست
                  </button>
                  <button
                    type="button" onClick={() => setFormVisible(false)}
                    className="w-full sm:w-auto px-6 py-2.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        .animate-ping-slow {
          {/* Fix: Suppress TypeScript error due to CSS-in-JS misinterpretation */}
          {/* @ts-expect-error TypeScript misinterprets 'animation' property in styled-jsx as JS. */}
          animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping-slow {
          {/* Fix: Suppress TypeScript error due to CSS-in-JS misinterpretation */}
          {/* @ts-expect-error TypeScript misinterprets CSS keyframe selectors like '0%, 100%' as JS expressions. */}
          0%, 100% {
            {/* Fix: Suppress TypeScript error due to CSS-in-JS misinterpretation */}
            {/* @ts-expect-error TypeScript misinterprets 'transform' property and 'scale' function in styled-jsx as JS. */}
            transform: scale(1.2);
            opacity: 0;
          }
          50% {
            {/* Fix: Suppress TypeScript error due to CSS-in-JS misinterpretation */}
            {/* @ts-expect-error TypeScript misinterprets 'transform' property and 'scale' function in styled-jsx as JS. */}
            transform: scale(1.8); /* Adjusted scale */
            opacity: 0.5;
          }
        }
        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          {/* Fix: Suppress TypeScript error due to CSS-in-JS misinterpretation */}
          {/* @ts-expect-error TypeScript misinterprets 'width' property in styled-jsx as JS. */}
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          {/* Fix: Suppress TypeScript error due to CSS-in-JS misinterpretation */}
          {/* @ts-expect-error TypeScript misinterprets 'background' property and 'rgba' function in styled-jsx as JS. */}
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          {/* Fix: Suppress TypeScript error due to CSS-in-JS misinterpretation */}
          {/* @ts-expect-error TypeScript misinterprets 'background' property in styled-jsx as JS. */}
          background:rgb(251, 210, 60); /* orange-400 */
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          {/* Fix: Suppress TypeScript error due to CSS-in-JS misinterpretation */}
          {/* @ts-expect-error TypeScript misinterprets 'background' property in styled-jsx as JS. */}
          background:rgb(226, 197, 82); /* orange-500 */
        }
        /* Fallback for Firefox */
        .custom-scrollbar {
          {/* Fix: Suppress TypeScript error due to CSS-in-JS misinterpretation */}
          {/* @ts-expect-error TypeScript misinterprets hyphenated 'scrollbar-width' property in styled-jsx as JS. */}
          scrollbar-width: thin;
          scrollbar-color:rgb(219, 227, 56) rgba(255,255,255,0.1);
        }
      `}</style>
    </section>
  );
};

export default Hero;