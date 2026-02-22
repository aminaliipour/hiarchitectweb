'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, Eye, Home } from 'lucide-react';
import Link from 'next/link';

interface MemberFile {
  id: string;
  file_name: string;
  original_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  description: string;
  created_at: string;
  is_manual?: boolean;
}

export default function MemberFilesPage() {
  const router = useRouter();
  const [files, setFiles] = useState<MemberFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMemberFiles();
  }, []);

  const fetchMemberFiles = async () => {
    try {
      const response = await fetch('/api/member/files', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      } else if (response.status === 401) {
        // Redirect to login if not authenticated
        router.push('/login/member');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'خطا در بارگذاری فایل‌ها');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
    if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) return '📊';
    if (fileType?.includes('powerpoint') || fileType?.includes('presentation')) return '📈';
    if (fileType?.includes('video')) return '🎥';
    if (fileType?.includes('audio')) return '🎵';
    if (fileType?.includes('zip') || fileType?.includes('rar')) return '📦';
    return '📁';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>در حال بارگذاری فایل‌ها...</p>
        </div>
      </div>
    );
  }

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
            <button
              onClick={() => router.push('/member/dashboard')}
              className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              بازگشت به داشبورد
            </button>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              <span className="text-blue-400">فایل‌های من</span>
              <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded ml-2">
                {files.length}
              </span>
              {files.filter(f => f.is_manual).length > 0 && (
                <span className="text-sm bg-green-600 text-white px-2 py-1 rounded ml-2">
                  {files.filter(f => f.is_manual).length} دستی
                </span>
              )}
            </h1>
            <p className="text-gray-400">
              فایل‌های ارسال شده توسط ادمین برای شما {files.filter(f => f.is_manual).length > 0 && '+ فایل‌های دستی'}
            </p>
          </div>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>خانه</span>
          </Link>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-900/50 text-red-400"
          >
            {message}
          </motion.div>
        )}

        {/* Files Grid */}
        {files.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center"
          >
            <FileText className="w-24 h-24 mx-auto mb-6 text-gray-400 opacity-50" />
            <h3 className="text-2xl font-semibold text-white mb-4">
              هنوز فایلی برای شما ارسال نشده
            </h3>
            <p className="text-gray-400 mb-6">
              زمانی که ادمین فایلی برای شما ارسال کند، اینجا نمایش داده خواهد شد.
            </p>
            <button
              onClick={() => router.push('/member/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              بازگشت به داشبورد
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Files Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                <span className="text-white font-medium">
                  {files.length} فایل برای شما موجود است
                  {files.filter(f => f.is_manual).length > 0 && (
                    <span className="text-green-400 mr-2">
                      ({files.filter(f => f.is_manual).length} فایل دستی)
                    </span>
                  )}
                </span>
              </div>
            </motion.div>

            {/* Files List */}
            <div className="grid gap-4">
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className={`bg-white/5 backdrop-blur-xl rounded-xl p-6 border transition-all group ${
                    file.is_manual 
                      ? 'border-green-500/30 bg-green-900/10 hover:border-green-500/50' 
                      : 'border-white/10 hover:border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* File Icon */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 ${
                        file.is_manual 
                          ? 'bg-gradient-to-br from-green-600 to-green-700' 
                          : 'bg-gradient-to-br from-blue-600 to-blue-700'
                      }`}>
                        {getFileIcon(file.file_type)}
                        {file.is_manual && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {file.original_name}
                          </h3>
                          {file.is_manual && (
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                              دستی
                            </span>
                          )}
                        </div>
                        
                        {file.description && (
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {file.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <span>📏</span>
                            <span>{formatFileSize(file.file_size)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>📅</span>
                            <span>{formatDate(file.created_at)}</span>
                          </div>
                          {file.file_type && (
                            <div className="flex items-center gap-1">
                              <span>🏷️</span>
                              <span>{file.file_type}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <a
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group"
                        title="مشاهده فایل"
                      >
                        <Eye className="w-5 h-5" />
                      </a>
                      
                      <a
                        href={file.file_url}
                        download={file.original_name}
                        className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="دانلود فایل"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm bg-white/5 rounded-full px-6 py-3 backdrop-blur-xl border border-white/10">
            <FileText className="w-4 h-4" />
            <span>برای دانلود یا مشاهده فایل، روی دکمه‌های مربوطه کلیک کنید</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
