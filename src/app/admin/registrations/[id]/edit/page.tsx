'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Save,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '../../../components/admin-layout';

interface RegistrationBasic {
  id: string;
  full_name: string;
  email: string;
  status: string;
  admin_notes?: string;
}

export default function EditRegistration() {
  const params = useParams();
  const router = useRouter();
  const [registration, setRegistration] = useState<RegistrationBasic | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const statusOptions = [
    { 
      value: 'pending', 
      label: 'در انتظار بررسی',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: <Clock className="w-4 h-4" />
    },
    { 
      value: 'reviewed', 
      label: 'بررسی شده',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <Eye className="w-4 h-4" />
    },
    { 
      value: 'accepted', 
      label: 'پذیرفته شده',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: <CheckCircle className="w-4 h-4" />
    },
    { 
      value: 'rejected', 
      label: 'رد شده',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: <XCircle className="w-4 h-4" />
    },
    { 
      value: 'interview', 
      label: 'دعوت به مصاحبه',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: <AlertCircle className="w-4 h-4" />
    }
  ];

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await fetch(`/api/registration/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setRegistration(data.data);
          setStatus(data.data.status);
          setAdminNotes(data.data.admin_notes || '');
        } else {
          console.error('Error fetching registration:', data.message);
        }
      } catch (error) {
        console.error('Error fetching registration:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRegistration();
    }
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/registration/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          admin_notes: adminNotes,
          reviewed_by: 'current_admin_id' // You should get this from auth context
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('وضعیت با موفقیت به‌روزرسانی شد');
        router.push(`/admin/registrations/${params.id}`);
      } else {
        alert('خطا در به‌روزرسانی: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating registration:', error);
      alert('خطا در به‌روزرسانی وضعیت');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">فرم یافت نشد</p>
          <Link 
            href="/admin/registrations"
            className="mt-4 inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت به لیست
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="ویرایش وضعیت فرم">
      <div className="space-y-6">
        {/* Back Button */}
        <Link 
          href={`/admin/registrations/${params.id}`}
          className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به جزئیات
        </Link>
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ویرایش وضعیت فرم
          </h1>
          <p className="text-gray-600">
            {registration.full_name} - {registration.email}
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          <div className="space-y-8">
            {/* Status Selection */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-6">
                وضعیت فرم
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                {statusOptions.map((option) => (
                  <div key={option.value}>
                    <label className="block cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={status === option.value}
                        onChange={(e) => setStatus(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-lg border-2 transition-all ${
                        status === option.value
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            status === option.value 
                              ? 'bg-yellow-100 text-yellow-600' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {option.icon}
                          </div>
                          <div>
                            <div className={`font-medium ${
                              status === option.value ? 'text-yellow-900' : 'text-gray-900'
                            }`}>
                              {option.label}
                            </div>
                            {status === option.value && (
                              <div className="text-sm text-yellow-600 mt-1">
                                انتخاب شده
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Preview */}
            {status && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  پیش‌نمایش وضعیت
                </label>
                <div className="flex items-center gap-2">
                  {statusOptions.find(opt => opt.value === status)?.icon}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    statusOptions.find(opt => opt.value === status)?.color
                  }`}>
                    {statusOptions.find(opt => opt.value === status)?.label}
                  </span>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-3">
                یادداشت مدیر
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                rows={6}
                placeholder="یادداشت‌های خود را در مورد این متقاضی بنویسید..."
              />
              <p className="text-sm text-gray-500 mt-2">
                این یادداشت تنها برای مدیران قابل مشاهده است و به متقاضی نمایش داده نمی‌شود.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Link
                href={`/admin/registrations/${params.id}`}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                انصراف
              </Link>
              
              <button
                onClick={handleSave}
                disabled={saving || !status}
                className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    ذخیره تغییرات
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Status Descriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-medium text-blue-900 mb-4">
            راهنمای وضعیت‌ها
          </h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>در انتظار بررسی:</strong> فرم تازه دریافت شده و هنوز بررسی نشده است.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>بررسی شده:</strong> فرم مورد بررسی قرار گرفته اما تصمیم نهایی گرفته نشده است.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>پذیرفته شده:</strong> متقاضی برای همکاری پذیرفته شده است.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>رد شده:</strong> متقاضی برای همکاری مناسب تشخیص داده نشده است.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>دعوت به مصاحبه:</strong> متقاضی برای مصاحبه دعوت شده است.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}