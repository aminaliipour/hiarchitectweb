'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserCheck, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const loginOptions = [
    {
      id: 'register',
      title: 'ثبت نام و تکمیل فرم',
      description: 'برای درخواست همکاری و عضویت در تیم',
      icon: <UserCheck className="w-8 h-8" />,
      href: '/registration',
      color: 'from-purple-600 to-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors mb-8 group"
          >
            <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>بازگشت به خانه</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            همکاری با <span className="text-yellow-500">های آرشیتکت</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            برای درخواست همکاری فرم را تکمیل کنید
          </p>
        </motion.div>

        {/* Login Options */}
        <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
          {loginOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={option.href}
                className="block h-full"
              >
                <div className={`h-full bg-gradient-to-br ${option.color} rounded-2xl p-6 text-white shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 border border-white/10 backdrop-blur-sm`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                      {option.icon}
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-bold">{option.title}</h2>
                      <p className="text-white/80 leading-relaxed text-sm">
                        {option.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">
                      <span>ادامه</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>برای اطلاعات بیشتر با ما تماس بگیرید</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
