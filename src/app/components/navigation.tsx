"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Grid, Briefcase, Phone, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleSmoothScroll = (href: string) => {
    setIsOpen(false); // Close menu first
    
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    if (href.startsWith('#')) {
      const element = document.querySelector(href) as HTMLElement;
      if (element) {
        // Add a small delay to allow menu to close
        setTimeout(() => {
          const offsetTop = element.offsetTop - 80; // Account for header space
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }, 200);
      }
    }
  }

  const menuItems = [
    { name: "خانه", icon: <Home className="h-5 w-5" />, href: "#hero" },
    { name: "نمونه پروژه ها", icon: <Grid className="h-5 w-5" />, href: "#projects" },
    { name: "خدمات", icon: <Briefcase className="h-5 w-5" />, href: "#design-studio" },
    { name: "تماس", icon: <Phone className="h-5 w-5" />, href: "#contact" },
  ]

  return (
    <>
      {/* Logo in top left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0, duration: 0.8, ease: "easeOut" }}
        className="fixed top-8 left-8 z-[60]"
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/images/Hi-logo.png"
            alt="لوگوی های آرشیتکت"
            width={60}
            height={30}
            className="filter-none hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </motion.div>

      {/* Navigation Menu */}
      <div className="fixed right-8 top-8 z-50">
      <motion.button
        className={`flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md ${
          isOpen
            ? "bg-yellow-500 text-black"
            : scrollPosition > 100
              ? "bg-black/50 text-yellow-500 border border-yellow-500/30"
              : "bg-transparent text-yellow-500 border border-yellow-500/30"
        }`}
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <div className="h-6 w-6 rounded-full border-2 border-yellow-500" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute right-0 mt-4 flex flex-col gap-3"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => handleSmoothScroll(item.href)}
                  className="flex items-center gap-3 rounded-full border border-yellow-500/20 bg-black/70 px-4 py-2 text-white backdrop-blur-md transition-colors hover:bg-yellow-500 hover:text-black w-full"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </>
  )
}