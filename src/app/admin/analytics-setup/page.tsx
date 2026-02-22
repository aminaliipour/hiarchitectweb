'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin-layout';

interface TableInfo {
  name: string;
  exists: boolean;
  rowCount: number;
  columns: number;
  indexes: string[];
}

interface CheckResult {
  success: boolean;
  message: string;
  tables: TableInfo[];
  databaseConnected: boolean;
  missingTables: string[];
  canSetup: boolean;
  errors: string[];
}

export default function AnalyticsSetupPage() {
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    checkAnalyticsStatus();
  }, []);

  const checkAnalyticsStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics-check');
      const result = await response.json();
      setCheckResult(result);
      setLastCheck(new Date());
    } catch (error) {
      console.error('خطا در بررسی وضعیت آنالیتیک:', error);
      setCheckResult({
        success: false,
        message: 'خطا در اتصال به سرور',
        tables: [],
        databaseConnected: false,
        missingTables: [],
        canSetup: false,
        errors: ['خطا در اتصال به سرور']
      });
    } finally {
      setLoading(false);
    }
  };

  const setupAnalytics = async () => {
    try {
      setSetupLoading(true);
      const response = await fetch('/api/analytics-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('جداول آنالیتیک با موفقیت ایجاد شدند!');
        await checkAnalyticsStatus(); // بررسی مجدد وضعیت
      } else {
        alert(`خطا در ایجاد جداول: ${result.message}`);
      }
    } catch (error) {
      console.error('خطا در راه‌اندازی آنالیتیک:', error);
      alert('خطا در راه‌اندازی آنالیتیک');
    } finally {
      setSetupLoading(false);
    }
  };

  const getStatusColor = (exists: boolean) => {
    return exists ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (exists: boolean) => {
    return exists ? (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  if (loading && !checkResult) {
    return (
      <AdminLayout title="تنظیم و بررسی آنالیتیک">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بررسی وضعیت آنالیتیک...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="تنظیم و بررسی آنالیتیک">
      <div className="space-y-6">
        {/* هدر و کنترل‌ها */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">وضعیت سیستم آنالیتیک</h2>
              {lastCheck && (
                <p className="text-sm text-gray-500 mt-1">
                  آخرین بررسی: {lastCheck.toLocaleString('fa-IR')}
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={checkAnalyticsStatus}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                ) : (
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                بررسی مجدد
              </button>

              {checkResult && !checkResult.success && checkResult.canSetup && (
                <button
                  onClick={setupAnalytics}
                  disabled={setupLoading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {setupLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  ) : (
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                  راه‌اندازی آنالیتیک
                </button>
              )}
            </div>
          </div>

          {/* وضعیت کلی */}
          {checkResult && (
            <div className={`p-4 rounded-lg ${checkResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${checkResult.success ? 'text-green-600' : 'text-red-600'}`}>
                  {getStatusIcon(checkResult.success)}
                </div>
                <div className="mr-3">
                  <h3 className={`font-medium ${checkResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {checkResult.success ? 'سیستم آنالیتیک آماده است' : 'سیستم آنالیتیک نیاز به تنظیم دارد'}
                  </h3>
                  <p className={`text-sm ${checkResult.success ? 'text-green-600' : 'text-red-600'}`}>
                    {checkResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* وضعیت اتصال دیتابیس */}
        {checkResult && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">وضعیت اتصال دیتابیس</h3>
            
            <div className={`flex items-center p-4 rounded-lg ${checkResult.databaseConnected ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`p-2 rounded-full ${checkResult.databaseConnected ? 'text-green-600' : 'text-red-600'}`}>
                {getStatusIcon(checkResult.databaseConnected)}
              </div>
              <span className={`mr-3 font-medium ${checkResult.databaseConnected ? 'text-green-800' : 'text-red-800'}`}>
                {checkResult.databaseConnected ? 'اتصال به دیتابیس برقرار است' : 'خطا در اتصال به دیتابیس'}
              </span>
            </div>
          </div>
        )}

        {/* جزئیات جداول */}
        {checkResult && checkResult.tables.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">جزئیات جداول آنالیتیک</h3>
            
            <div className="grid gap-4">
              {checkResult.tables.map((table) => (
                <div key={table.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ml-3 ${getStatusColor(table.exists)}`}>
                        {getStatusIcon(table.exists)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{table.name}</h4>
                        <p className="text-sm text-gray-500">
                          {table.exists ? 'جدول موجود است' : 'جدول موجود نیست'}
                        </p>
                      </div>
                    </div>
                    
                    {table.exists && (
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {table.rowCount.toLocaleString()} رکورد
                        </p>
                        <p className="text-xs text-gray-500">
                          {table.columns} ستون، {table.indexes.length} ایندکس
                        </p>
                      </div>
                    )}
                  </div>

                  {table.exists && table.indexes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">ایندکس‌ها:</p>
                      <div className="flex flex-wrap gap-2">
                        {table.indexes.map((index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                            {index}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* خطاها */}
        {checkResult && checkResult.errors.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-red-800 mb-4">خطاها و هشدارها</h3>
            
            <div className="space-y-2">
              {checkResult.errors.map((error, index) => (
                <div key={index} className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* دستورالعمل راه‌اندازی */}
        {checkResult && !checkResult.success && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">دستورالعمل راه‌اندازی</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">گزینه ۱: استفاده از رابط وب</h4>
                <p className="text-sm text-blue-800 mb-3">
                  با کلیک روی دکمه "راه‌اندازی آنالیتیک" در بالا، جداول مورد نیاز ایجاد خواهند شد.
                </p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">گزینه ۲: استفاده از اسکریپت</h4>
                <p className="text-sm text-gray-600 mb-3">
                  در سرور، دستور زیر را اجرا کنید:
                </p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm">
                  node scripts/check-analytics-tables.js
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">گزینه ۳: API مستقیم</h4>
                <p className="text-sm text-yellow-800 mb-3">
                  برای ایجاد جداول از طریق API:
                </p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm">
                  curl -X POST {typeof window !== 'undefined' ? window.location.origin : ''}/api/analytics-check
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}