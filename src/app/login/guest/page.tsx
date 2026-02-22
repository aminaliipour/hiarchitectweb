'use client';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Home, Construction } from 'lucide-react';
import Link from 'next/link';

export default function GuestLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>بازگشت</span>
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors group"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">ورود مهمان</h1>
          <p className="text-gray-400">
            برای کاربران جدید و مهمان‌ها
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center space-y-6">
              {/* Construction Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full">
                <Construction className="w-10 h-10 text-green-400" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white">
                در دست توسعه
              </h2>

              {/* Description */}
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  بخش ورود مهمان در حال توسعه است.
                </p>
                <p className="text-sm text-gray-400">
                  برای دسترسی زودتر به این بخش، می‌توانید با ما تماس بگیرید و درخواست عضویت دهید.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Link
                  href="/#contact"
                  className="w-full inline-flex items-center justify-center py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-500/30 transition-all"
                >
                  تماس با ما
                </Link>
                
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 focus:ring-4 focus:ring-white/30 transition-all"
                >
                  بازگشت به صفحه ورود
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>به زودی در دسترس خواهد بود</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
