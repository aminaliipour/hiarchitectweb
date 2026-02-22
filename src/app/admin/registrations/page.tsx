'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Download,
  FileText,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '../components/admin-layout';

interface RegistrationForm {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  preferred_position: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'interview';
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function RegistrationsManagement() {
  const [registrations, setRegistrations] = useState<RegistrationForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0 // Changed from totalPages to pages to match API
  });

  const statusOptions = [
    { value: '', label: 'همه وضعیت‌ها', color: 'gray' },
    { value: 'pending', label: 'در انتظار بررسی', color: 'yellow' },
    { value: 'reviewed', label: 'بررسی شده', color: 'blue' },
    { value: 'accepted', label: 'پذیرفته شده', color: 'green' },
    { value: 'rejected', label: 'رد شده', color: 'red' },
    { value: 'interview', label: 'مصاحبه', color: 'purple' }
  ];

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/registration?${params}`);
      const data = await response.json();

      if (response.ok && data.success !== false) {
        setRegistrations(data.data || data.registrations || []);
        setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
      } else {
        console.error('Error fetching registrations:', data.message || data.error || 'Unknown error');
        setRegistrations([]);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [pagination.page, statusFilter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchRegistrations();
      } else if (searchTerm === '') {
        fetchRegistrations();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewed': return <Eye className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'interview': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'interview': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.label || status;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این فرم را حذف کنید؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/registration/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchRegistrations();
        alert('فرم با موفقیت حذف شد');
      } else {
        alert('خطا در حذف فرم');
      }
    } catch (error) {
      console.error('خطا در حذف فرم:', error);
      alert('خطا در حذف فرم');
    }
  };

  const handleExportPDF = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/registrations/export?id=${id}`);
      
      if (!response.ok) {
        throw new Error('خطا در دانلود PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `registration-form-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('خطا در دانلود PDF:', error);
      alert('خطا در دانلود PDF');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <AdminLayout title="مدیریت فرم‌های ثبت نام">
      <div className="space-y-6">
        {/* Stats Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                مدیریت فرم‌های ثبت نام
              </h2>
              <p className="text-gray-600">
                مدیریت و بررسی درخواست‌های همکاری
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Users className="w-4 h-4" />
                  <span>کل فرم‌ها: {pagination.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="جستجو در نام، ایمیل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">هیچ فرمی یافت نشد</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-right px-6 py-4 text-sm font-medium text-gray-900">نام متقاضی</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-gray-900">ایمیل</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-gray-900">موبایل</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-gray-900">موقعیت مورد نظر</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-gray-900">وضعیت</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-gray-900">تاریخ ثبت</th>
                      <th className="text-center px-6 py-4 text-sm font-medium text-gray-900">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {registrations.map((registration, index) => (
                      <motion.tr
                        key={registration.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {registration.full_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {registration.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {registration.mobile}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {registration.preferred_position || 'مشخص نشده'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(registration.status)}`}>
                            {getStatusIcon(registration.status)}
                            {getStatusLabel(registration.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(registration.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/admin/registrations/${registration.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="مشاهده جزئیات"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleExportPDF(registration.id)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="دانلود PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/admin/registrations/${registration.id}/edit`}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="ویرایش وضعیت"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(registration.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      نمایش {((pagination.page - 1) * pagination.limit) + 1} تا {Math.min(pagination.page * pagination.limit, pagination.total)} از {pagination.total} مورد
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(pagination.page - 2, pagination.pages - 4)) + i;
                        if (pageNum > pagination.pages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm rounded-lg ${
                              pageNum === pagination.page
                                ? 'bg-yellow-500 text-white'
                                : 'border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}