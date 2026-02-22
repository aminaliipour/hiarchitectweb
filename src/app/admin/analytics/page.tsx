'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin-layout';
import { SimpleBarChart, SimplePieChart, SimpleLineChart } from '../../../components/simple-charts';
import { addCommas } from '../../../lib/number-utils';

interface AnalyticsData {
  // آمار کلی
  totalVisits: number;
  totalUniqueVisitors: number;
  totalPageViews: number;
  
  // آمار امروز
  todayVisits: number;
  todayUniqueVisitors: number;
  
  // آمار هفته گذشته
  weeklyVisits: number;
  weeklyUniqueVisitors: number;
  
  // پرترافیک‌ترین صفحات
  topPages: Array<{
    page_url: string;
    page_title: string;
    views: number;
    unique_visitors: number;
  }>;
  
  // پربازدیدترین پروژه‌ها
  topProjects: Array<{
    id: string;
    title: string;
    views: number;
    unique_visitors: number;
  }>;
  
  // آمار بازدید روزانه (7 روز گذشته)
  dailyStats: Array<{
    date: string;
    visits: number;
    unique_visitors: number;
  }>;
  
  // آمار کشورها
  countryStats: Array<{
    country: string;
    visits: number;
    percentage: number;
  }>;
  
  // آمار مرورگرها
  browserStats: Array<{
    browser: string;
    visits: number;
    percentage: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('7'); // آخرین 7 روز

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?days=${dateRange}`);
      
      const result = await response.json();
      
      // بررسی وجود خطا در پاسخ
      if (result._error) {
        if (result._error.canSetup) {
          setError(`${result._error.message}\n\nبرای راه‌اندازی سیستم آنالیتیک به صفحه تنظیمات آنالیتیک بروید.`);
        } else {
          setError(result._error.message);
        }
        setData(result); // حتی با خطا، داده‌های خالی را نمایش بده
      } else if (!response.ok) {
        throw new Error(`خطا در بارگذاری آمار (${response.status})`);
      } else {
        setData(result);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته در اتصال به سرور');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="آمار فعالیت سایت">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری آمار...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="آمار فعالیت سایت">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-red-800">خطا در بارگذاری آمار</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={loadAnalytics}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              تلاش مجدد
            </button>
            {error?.includes('راه‌اندازی') && (
              <a
                href="/admin/analytics-setup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                تنظیمات آنالیتیک
              </a>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout title="آمار فعالیت سایت">
        <div className="text-center py-12">
          <p className="text-gray-500">آماری یافت نشد</p>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'کل بازدیدها',
      value: addCommas(data.totalVisits),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'bg-blue-500',
      change: data.weeklyVisits > 0 ? '+' + ((data.weeklyVisits / Math.max(data.totalVisits - data.weeklyVisits, 1)) * 100).toFixed(1) + '%' : '0%'
    },
    {
      title: 'بازدیدکنندگان یکتا',
      value: addCommas(data.totalUniqueVisitors),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-green-500',
      change: data.weeklyUniqueVisitors > 0 ? '+' + ((data.weeklyUniqueVisitors / Math.max(data.totalUniqueVisitors - data.weeklyUniqueVisitors, 1)) * 100).toFixed(1) + '%' : '0%'
    },
    {
      title: 'بازدید امروز',
      value: addCommas(data.todayVisits),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-purple-500',
      change: data.todayUniqueVisitors > 0 ? addCommas(data.todayUniqueVisitors) + ' یکتا' : '0 یکتا'
    },
    {
      title: 'صفحات مشاهده شده',
      value: addCommas(data.totalPageViews),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-orange-500',
      change: data.totalVisits > 0 ? (data.totalPageViews / data.totalVisits).toFixed(1) + ' صفحه/بازدید' : '0'
    }
  ];

  return (
    <AdminLayout title="آمار فعالیت سایت">
      <div className="space-y-6">
        {/* کنترل‌های فیلتر */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">بازه زمانی</h3>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1">امروز</option>
              <option value="7">7 روز گذشته</option>
              <option value="30">30 روز گذشته</option>
              <option value="90">3 ماه گذشته</option>
            </select>
          </div>
        </div>

        {/* کارت‌های آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${card.color} text-white`}>
                    {card.icon}
                  </div>
                  <div className="mr-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm text-green-600">{card.change}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* نمودار آمار روزانه */}
        <SimpleLineChart 
          data={data.dailyStats} 
          title="آمار بازدید روزانه"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* پرترافیک‌ترین صفحات */}
          <SimpleBarChart 
            data={data.topPages.map(page => ({
              label: page.page_title || page.page_url.substring(0, 20),
              value: page.views
            }))}
            title="پرترافیک‌ترین صفحات"
          />

          {/* پرمحبوب‌ترین پروژه‌ها */}
          <SimpleBarChart 
            data={data.topProjects.map(project => ({
              label: project.title.substring(0, 15),
              value: project.views
            }))}
            title="پرمحبوب‌ترین پروژه‌ها"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* آمار کشورها */}
          <SimplePieChart 
            data={data.countryStats.map((country, index) => ({
              label: country.country,
              value: country.visits,
              color: `hsl(${(index * 45) + 200}, 70%, 50%)`
            }))}
            title="آمار کشورها"
          />

          {/* آمار مرورگرها */}
          <SimplePieChart 
            data={data.browserStats.map((browser, index) => ({
              label: browser.browser,
              value: browser.visits,
              color: `hsl(${(index * 60) + 100}, 70%, 50%)`
            }))}
            title="آمار مرورگرها"
          />
        </div>

        {/* دکمه تازه‌سازی */}
        <div className="text-center">
          <button
            onClick={loadAnalytics}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            تازه‌سازی آمار
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}