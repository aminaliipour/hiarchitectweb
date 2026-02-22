'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, CreditCard, Eye, EyeOff, Home, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function MemberLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    nationalCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { name, value } = e.target;
      
      // Format phone number
      if (name === 'phone') {
        // Remove non-digits
        const digits = value.replace(/\D/g, '');
        // Limit to 11 digits and format
        const formattedPhone = digits.slice(0, 11);
        setFormData(prev => ({ ...prev, [name]: formattedPhone }));
      }
      // Format national code
      else if (name === 'nationalCode') {
        // Remove non-digits and limit to 10
        const digits = value.replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, [name]: digits }));
      }
      else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      
      setMessage(''); // Clear message on input
    } catch (error) {
      console.error('Input change error:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('Form submitted');
    
    // Validation
    if (!formData.phone.trim()) {
      setMessage('شماره تماس الزامی است');
      return;
    }
    
    if (!formData.nationalCode.trim()) {
      setMessage('کد ملی الزامی است');
      return;
    }

    if (!/^09\d{9}$/.test(formData.phone)) {
      setMessage('شماره تماس باید با 09 شروع شده و 11 رقم باشد');
      return;
    }

    if (!/^\d{10}$/.test(formData.nationalCode)) {
      setMessage('کد ملی باید 10 رقم باشد');
      return;
    }

    setLoading(true);
    setMessage('');

    // Use Promise instead of async/await to avoid potential issues
    fetch('/api/auth/member-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: formData.phone,
        national_code: formData.nationalCode
      }),
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.error || 'خطا در ورود');
        });
      }
      return response.json();
    })
    .then(data => {
      setMessage('ورود موفقیت‌آمیز! در حال انتقال به پنل کاربری...');
      setTimeout(() => {
        router.push('/member/dashboard');
      }, 1500);
    })
    .catch(error => {
      console.error('Login error:', error);
      setMessage(error.message || 'خطا در ارتباط با سرور');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
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

          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <UserCheck className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">ورود اعضا</h1>
          <p className="text-gray-400">
            شماره تماس و کد ملی خود را وارد کنید
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg text-center ${
                message.includes('موفقیت') 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  شماره تماس
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="09123456789"
                    className="w-full pr-12 pl-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    maxLength={11}
                    required
                  />
                </div>
              </div>

              {/* National Code Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  کد ملی
                </label>
                <div className="relative">
                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="nationalCode"
                    value={formData.nationalCode}
                    onChange={handleInputChange}
                    placeholder="کد ملی 10 رقمی"
                    className="w-full pr-12 pl-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    maxLength={10}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال ورود...</span>
                  </>
                ) : (
                  <span>ورود</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>
                مشکل در ورود دارید؟{' '}
                <Link href="#contact" className="text-blue-400 hover:text-blue-300 transition-colors">
                  تماس با ما
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
