"use client";

import { useState, useEffect } from 'react';

interface EnvCheck {
  postgres_url: boolean;
  database_url: boolean;
  jwt_secret: boolean;
  admin_email: boolean;
  admin_password: boolean;
}

export default function SetupPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [envCheck, setEnvCheck] = useState<EnvCheck | null>(null);

  useEffect(() => {
    // Load environment check on page load
    loadEnvCheck();
  }, []);

  const loadEnvCheck = async () => {
    try {
      const response = await fetch('/api/env-check');
      const data = await response.json();
      setEnvCheck(data);
    } catch (error) {
      console.error('Failed to load env check:', error);
    }
  };
  const checkDatabase = async () => {
    setIsChecking(true);
    setError('');
    setStatus('');

    try {
      const response = await fetch('/api/health');
      const data = await response.json();

      if (response.ok) {
        setStatus('✅ ' + data.message);
      } else {
        setError('❌ ' + data.message + ': ' + data.error);
      }
    } catch (error) {
      setError('❌ خطا در بررسی وضعیت دیتابیس: ' + (error as Error).message);
    } finally {
      setIsChecking(false);
    }
  };

  const initializeDatabase = async () => {
    setIsInitializing(true);
    setError('');
    setStatus('');

    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: 'init-database-2024' }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('✅ دیتابیس با موفقیت راه‌اندازی شد!\n\nاطلاعات ادمین:\nایمیل: ' + data.admin.email + '\nرمز عبور: ' + data.admin.password);
      } else {
        setError('❌ ' + data.error);
      }
    } catch (error) {
      setError('❌ خطا در راه‌اندازی دیتابیس: ' + (error as Error).message);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">راه‌اندازی سیستم</h1>
            <p className="text-gray-300">پنل مدیریت هایارکی</p>
          </div>

          <div className="space-y-6">
            {/* Database Status */}
            <div className="space-y-4">
              <h2 className="text-xl text-white font-semibold">بررسی وضعیت دیتابیس</h2>
              <button
                onClick={checkDatabase}
                disabled={isChecking}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isChecking ? 'در حال بررسی...' : 'بررسی اتصال دیتابیس'}
              </button>
            </div>

            {/* Initialize Database */}
            <div className="space-y-4">
              <h2 className="text-xl text-white font-semibold">راه‌اندازی دیتابیس</h2>
              <p className="text-gray-300 text-sm">
                این عملیات جداول دیتابیس را ایجاد کرده و کاربر ادمین اولیه را می‌سازد.
              </p>
              <button
                onClick={initializeDatabase}
                disabled={isInitializing}
                className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isInitializing ? 'در حال راه‌اندازی...' : 'راه‌اندازی دیتابیس'}
              </button>
            </div>

            {/* Status Messages */}
            {status && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <pre className="text-green-200 text-sm whitespace-pre-wrap">{status}</pre>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 space-y-3">
                <p className="text-red-200 text-sm">{error}</p>

                {/* Troubleshooting help */}
                <div className="border-t border-red-500/30 pt-3">
                  <p className="text-red-300 text-xs font-semibold mb-2">راهنمای عیب‌یابی:</p>
                  <ul className="text-red-200 text-xs space-y-1 list-disc list-inside">
                    <li>مطمئن شوید که فایل .env.local در root پروژه وجود دارد</li>
                    <li>بررسی کنید که MONGODB_URI در .env.local تنظیم شده باشد</li>
                    <li>مطمئن شوید که MongoDB در دسترس است و connection string صحیح باشد</li>
                    <li>سرور Next.js را restart کنید: Ctrl+C و سپس npm run dev</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Environment Check */}
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
              <h3 className="text-blue-200 font-semibold mb-2">بررسی متغیرهای محیطی:</h3>
              <div className="text-blue-200 text-sm space-y-1">
                <p>MONGODB_URI: {process.env.MONGODB_URI ? '✅ تنظیم شده' : '❌ تنظیم نشده'}</p>
                <p>JWT_SECRET: {process.env.JWT_SECRET ? '✅ تنظیم شده' : '❌ تنظیم نشده'}</p>
                <p>Database: MongoDB (migrated from PostgreSQL)</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="border-t border-white/20 pt-6 text-center">
              <p className="text-gray-400 text-sm mb-4">
                پس از راه‌اندازی موفقیت‌آمیز دیتابیس، می‌توانید به پنل ادمین بروید.
              </p>
              <a
                href="/admin/login"
                className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-all duration-200"
              >
                رفتن به صفحه ورود
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
