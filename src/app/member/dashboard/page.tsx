'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, LogOut, Home, Settings, FileText } from 'lucide-react';
import Link from 'next/link';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  email: string;
  createdAt: string;
}

export default function MemberDashboard() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      const response = await fetch('/api/auth/member-profile', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMember(data.member);
      } else {
        // Redirect to login if not authenticated
        router.push('/login/member');
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      router.push('/login/member');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return null; // Will redirect in useEffect
  }

  const dashboardItems = [
    {
      title: 'فایل‌های من',
      description: 'مشاهده فایل‌های ارسال شده توسط ادمین',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-purple-600 to-purple-700',
      href: '/member/files',
      available: true
    },
    {
      title: 'ویرایش اطلاعات شخصی',
      description: 'ویرایش اطلاعات تماس و شخصی',
      icon: <Settings className="w-6 h-6" />,
      color: 'from-blue-600 to-blue-700',
      href: '#',
      available: false
    },
    {
      title: 'تغییر رمز عبور',
      description: 'تغییر کد ملی یا اطلاعات ورود',
      icon: <User className="w-6 h-6" />,
      color: 'from-green-600 to-green-700',
      href: '#',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              خوش آمدید، <span className="text-blue-400">{member.firstName} {member.lastName}</span>
            </h1>
            <p className="text-gray-400">
              {member.position && `${member.position} | `}پنل کاربری شما
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>خانه</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>خروج</span>
            </button>
          </div>
        </motion.div>

        {/* Member Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl mb-8"
        >
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {member.firstName} {member.lastName}
            </h2>
            {member.position && (
              <p className="text-blue-400 font-medium">{member.position}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                اطلاعات تماس
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm">📱</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">شماره تماس</p>
                    <p className="font-medium">{member.phone}</p>
                  </div>
                </div>
                {member.email && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📧</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">ایمیل</p>
                      <p className="font-medium">{member.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                اطلاعات حساب
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm">🆔</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">شناسه کاربری</p>
                    <p className="font-medium font-mono text-sm">{member.id.slice(0, 8)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm">📅</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">تاریخ عضویت</p>
                    <p className="font-medium">{new Date(member.createdAt).toLocaleDateString('fa-IR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm">✅</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">وضعیت حساب</p>
                    <p className="font-medium text-green-400">فعال</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center"
          >
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {Math.floor((Date.now() - new Date(member.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-xs text-gray-400">روز عضویت</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center"
          >
            <div className="text-2xl font-bold text-green-400 mb-1">✓</div>
            <div className="text-xs text-gray-400">حساب تایید شده</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center"
          >
            <div className="text-2xl font-bold text-purple-400 mb-1">0</div>
            <div className="text-xs text-gray-400">پروژه فعال</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center"
          >
            <div className="text-2xl font-bold text-orange-400 mb-1">0</div>
            <div className="text-xs text-gray-400">پیام جدید</div>
          </motion.div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
          {dashboardItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <div 
                onClick={() => {
                  if (item.available && item.href && item.href !== '#') {
                    router.push(item.href);
                  }
                }}
                className={`relative h-full bg-gradient-to-br ${item.color} rounded-2xl p-6 text-white shadow-2xl border border-white/10 ${
                item.available ? 'hover:shadow-blue-500/20 cursor-pointer' : 'opacity-60'
              } transition-all duration-300`}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  
                  <p className="text-white/80 text-sm flex-1">
                    {item.description}
                  </p>

                  {!item.available && (
                    <div className="mt-4 text-xs text-white/60 bg-white/10 rounded-lg px-3 py-2">
                      به زودی در دسترس
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              به پنل کاربری خود خوش آمدید!
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              در این پنل می‌توانید اطلاعات شخصی خود را مشاهده کنید. 
              امکانات بیشتری به زودی اضافه خواهد شد تا بتوانید پروژه‌ها و فعالیت‌های خود را مدیریت کنید.
            </p>
          </div>
        </motion.div>

        {/* Under Development Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm bg-white/5 rounded-full px-6 py-3 backdrop-blur-xl border border-white/10">
            <Settings className="w-4 h-4" />
            <span>پنل کاربری در حال توسعه است</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
