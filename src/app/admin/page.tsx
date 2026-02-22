'use client';

import { useEffect, useState } from 'react';
import AdminLayout from './components/admin-layout';

interface Stats {
  projects: number;
  categories: number;
  slides: number;
  publishedProjects: number;
  journeyMilestones: number;
  registrationForms: number;
  pendingRegistrations: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    categories: 0,
    slides: 0,
    publishedProjects: 0,
    journeyMilestones: 0,
    registrationForms: 0,
    pendingRegistrations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        // Load projects count
        const projectsRes = await fetch('/api/projects?limit=1');
        const projectsData = await projectsRes.json();

        // Load categories count
        const categoriesRes = await fetch('/api/projects/categories');
        const categoriesData = await categoriesRes.json();

        // Load slider images count
        const slidesRes = await fetch('/api/sliders');
        const slidesData = await slidesRes.json();

        setStats({
          projects: projectsData.pagination?.total || 0,
          categories: categoriesData.length || 0,
          slides: slidesData.sliders?.length || 0,
          publishedProjects: projectsData.pagination?.total || 0,
          journeyMilestones: 0, // Journey feature removed
          registrationForms: 0, // Not yet implemented for MongoDB
          pendingRegistrations: 0 // Not yet implemented for MongoDB
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'پروژه‌ها',
      value: stats.projects,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-3l3 3m0 0l-3 3m3-3H6" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    {
      title: 'دسته‌بندی‌ها',
      value: stats.categories,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    {
      title: 'سفر ما',
      value: stats.journeyMilestones,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-indigo-500'
    },
    {
      title: 'اسلایدرها',
      value: stats.slides,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-500'
    },
    {
      title: 'پروژه‌های منتشر شده',
      value: stats.publishedProjects,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-orange-500'
    }
  ];

  return (
    <AdminLayout title="داشبورد">
      <div className="space-y-6">
        {/* Welcome message */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            خوش آمدید!
          </h2>
          <p className="text-gray-600">
            به پنل مدیریت سایت هایارک خوش آمدید. از اینجا می‌توانید پروژه‌ها، دسته‌بندی‌ها و اسلایدرهای سایت را مدیریت کنید.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${card.color} text-white`}>
                    {card.icon}
                  </div>
                  <div className="mr-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {card.title}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? '...' : card.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            عملیات سریع
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/projects/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg ml-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">افزودن پروژه جدید</h4>
                <p className="text-sm text-gray-500">پروژه جدید اضافه کنید</p>
              </div>
            </a>

            <a
              href="/admin/sliders"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg ml-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">مدیریت اسلایدرها</h4>
                <p className="text-sm text-gray-500">مدیریت تصاویر اسلایدر</p>
              </div>
            </a>

            <a
              href="/admin/registrations"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
            >
              <div className="p-2 bg-orange-100 rounded-lg ml-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">مدیریت فرم‌های ثبت نام</h4>
                <p className="text-sm text-gray-500">بررسی و مدیریت درخواست‌ها</p>
              </div>
            </a>

            <a
              href="/admin/categories/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg ml-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">افزودن دسته‌بندی</h4>
                <p className="text-sm text-gray-500">دسته‌بندی جدید ایجاد کنید</p>
              </div>
            </a>
          </div>
        </div>


        {/* Info message about MongoDB */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            📘 اطلاعات دیتابیس
          </h3>
          <p className="text-blue-700 mb-2">
            سیستم با موفقیت به MongoDB منتقل شده است.
          </p>
          <div className="text-sm text-blue-600 space-y-1">
            <p>✅ همه route های اصلی به MongoDB تبدیل شدند</p>
            <p>✅ دیتابیس: MongoDB (Mongoose ODM)</p>
            <p>💡 برای ایجاد user admin به صفحه /setup بروید</p>
          </div>
        </div>


        {/* External Tools Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            ابزارهای جانبی
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="https://prs.hiarchitect.ir/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300 group"
            >
              <div className="p-3 bg-emerald-100 rounded-full ml-4 group-hover:bg-emerald-200 transition-colors">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                  سیستم پورسانت
                </h4>
                <p className="text-gray-500 text-sm mb-2">
                  مدیریت کامل پورسانت و امور مالی
                </p>
                <div className="flex items-center text-emerald-600 text-sm">
                  <span>باز کردن سیستم</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </a>

            {/* فضای خالی برای ابزارهای آینده */}
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm">ابزار جدید</p>
                <p className="text-xs">به زودی</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm">ابزار جدید</p>
                <p className="text-xs">به زودی</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout >
  );
}
