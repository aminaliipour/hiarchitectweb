'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
          return;
        }
      } catch (error) {
        console.error('خطا در بررسی احراز هویت:', error);
        router.push('/admin/login');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-gray-300 font-['Morabba']">در حال بررسی احراز هویت...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Admin Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <img 
                src="/images/Hi-logo.png" 
                alt="های آرشیتکت" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-[#D4AF37] font-['Morabba']">
                  پنل مدیریت
                </h1>
                <p className="text-sm text-gray-400">
                  شرکت معماری های آرشیتکت
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                router.push('/admin/login');
              }}
              className="flex items-center space-x-2 space-x-reverse text-gray-300 hover:text-[#D4AF37] transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 font-['Morabba']">
        {children}
      </main>
    </div>
  );
}
