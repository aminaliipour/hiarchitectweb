"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Instagram, Phone, MessageCircle } from "lucide-react"

export default function Footer() {
  const [followerCount, setFollowerCount] = useState(25000)
  const [projectCount, setProjectCount] = useState(100)
  const [isMounted, setIsMounted] = useState(false)
  const [currentYear, setCurrentYear] = useState(2024) // Static fallback for SSR

  useEffect(() => {
    setIsMounted(true)
    setCurrentYear(new Date().getFullYear()) // Set actual year only on client
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    // Simulate real-time counter updates
    const followerInterval = setInterval(() => {
      setFollowerCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 5000)

    const projectInterval = setInterval(() => {
      setProjectCount((prev) => prev + (Math.random() > 0.7 ? 1 : 0))
    }, 10000)

    return () => {
      clearInterval(followerInterval)
      clearInterval(projectInterval)
    }
  }, [isMounted])

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <footer className="bg-gray-950 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* لوگو و اطلاعات */}
          <div className="flex flex-col">
            <div className="mb-6">
              <Image src="/images/Hi.png" alt="لوگوی های آرشیتکت" width={160} height={80} />
            </div>
            <p className="mb-6 text-gray-400">
              استودیوی برتر معماری لاهیجان، ترکیب میراث محلی با طراحی مدرن و نوآورانه.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="tel:+989111381772"
                className="text-gray-400 transition-colors hover:text-yellow-500"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <Phone className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://instagram.com/hi.architect"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-yellow-500"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://t.me/HiArchitect_Admin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-yellow-500"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <MessageCircle className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* آمار و دستاوردها */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">دستاوردها</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-800 bg-black/60 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">دنبال‌کنندگان اینستاگرام</span>
                  <motion.span
                    key={followerCount}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-xl font-bold text-yellow-500"
                  >
                    {formatNumber(followerCount)}
                  </motion.span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-gray-800 bg-black/60 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">پروژه‌های تکمیل‌شده</span>
                  <motion.span
                    key={projectCount}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-xl font-bold text-yellow-500"
                  >
                    {formatNumber(projectCount)}+
                  </motion.span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-gray-800 bg-black/60 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">سال تجربه</span>
                  <span className="text-xl font-bold text-yellow-500">
                    ۸+
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "80%" }}
                    transition={{ duration: 1, delay: 0.9 }}
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* لینک‌های سریع */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">لینک‌های سریع</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#hero" className="text-gray-400 transition-colors hover:text-yellow-500">
                  خانه
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="text-gray-400 transition-colors hover:text-yellow-500">
                  نمونه‌کارها
                </Link>
              </li>
              <li>
                <Link href="#design-studio" className="text-gray-400 transition-colors hover:text-yellow-500">
                  خدمات
                </Link>
              </li>
              <li>
                <Link href="#timeline" className="text-gray-400 transition-colors hover:text-yellow-500">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 transition-colors hover:text-yellow-500">
                  تماس
                </Link>
              </li>
            </ul>
          </div>

          {/* خدمات ما */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">خدمات ما</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer">
                  طراحی معماری
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer">
                  طراحی داخلی
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer">
                  نظارت بر اجرا
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer">
                  مشاوره ساخت
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer">
                  بازسازی ویلا
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* کپی‌رایت */}
        <div className="flex flex-col items-center justify-center gap-4 border-t border-gray-800 pt-8">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © {currentYear} های آرشیتکت. تمامی حقوق محفوظ است.
            </p>
            <p className="mt-2 text-sm">
              <motion.span
                className="text-yellow-500 font-semibold"
                animate={{
                  textShadow: [
                    "0 0 5px rgba(255,204,0,0)",
                    "0 0 15px rgba(255,204,0,0.5)",
                    "0 0 5px rgba(255,204,0,0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                امین علیپور
              </motion.span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              aminaliipour@gmail.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}