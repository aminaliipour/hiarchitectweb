"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          router.push('/admin');
        }
      } catch (error) {
        // Not logged in, stay on login page
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        throw new Error('خطای سرور - پاسخ نامعتبر');
      }

      if (!response.ok) {
        throw new Error(data.error || `خطای HTTP: ${response.status}`);
      }

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('خطا در اتصال به سرور. لطفا مطمئن شوید که سرور در حال اجرا است.');
      } else {
        setError(error instanceof Error ? error.message : 'خطای ناشناخته در ورود');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">پنل مدیریت</h1>
            <p className="text-gray-300">های آرشیتکت</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                ایمیل
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-200"
                placeholder="ایمیل خود را وارد کنید"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                رمز عبور
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-200"
                placeholder="رمز عبور خود را وارد کنید"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#D4AF37] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#B8941F] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال ورود...
                </div>
              ) : (
                'ورود'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-400 text-sm">
              © ۲۰۲۵ هایارکی. تمامی حقوق محفوظ است.
            </p>
            
            <div className="pt-4 border-t border-white/20">
              <p className="text-gray-400 text-sm mb-2">
                اولین بار که وارد می‌شوید؟
              </p>
              <a
                href="/setup"
                className="text-[#D4AF37] hover:text-[#B8941F] text-sm underline transition-colors"
              >
                راه‌اندازی اولیه سیستم
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
