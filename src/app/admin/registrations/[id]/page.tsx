'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  User, 
  GraduationCap, 
  Briefcase, 
  FileText,
  Settings,
  Download,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Languages,
  Code,
  Bookmark,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Brain,
  Target,
  Users,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AdminLayout from '../../components/admin-layout';

interface RegistrationDetail {
  id: string;
  full_name: string;
  birth_date?: string;
  national_id?: string;
  phone?: string;
  mobile: string;
  email: string;
  address?: string;
  // Behavioral Assessment Fields
  digital_interests?: string[];
  first_salary_plan?: string;
  shopping_preference?: string;
  attractive_traits?: string[];
  mountain_path_choice?: string;
  free_time_activity?: string;
  work_mistake_reaction?: string;
  soup_preference?: string;
  workspace_cleanliness?: string;
  previous_work_environment?: string;
  colleague_problem_help?: string;
  colleague_oversight?: string;
  overtime_request_reaction?: string;
  rejection_reaction?: string;
  // Education Fields
  education_level?: string;
  field_of_study?: string;
  university?: string;
  graduation_year?: number;
  gpa?: number;
  // Work Experience Fields
  current_position?: string;
  work_experience_years?: number;
  work_history?: any;
  // Extended Work Philosophy Fields
  why_join_company?: string;
  criticism_opinion?: string;
  teamwork_budget?: string;
  improvement_suggestion?: string;
  group_criticism?: string;
  group_management?: string;
  employment_reason?: string;
  goals_and_plans?: string;
  customer_service?: string;
  salary_choice?: string;
  company_research?: string;
  skill_opinion?: string;
  career_goal?: string;
  worst_work_day?: string;
  best_work_day?: string;
  biggest_work_challenge?: string;
  what_motivates?: string;
  personal_strengths?: string;
  // Skills and Portfolio Fields
  skills?: string[];
  software_proficiency?: string[];
  languages?: string[];
  has_portfolio: boolean;
  portfolio_url?: string;
  project_types?: string[];
  // Career Preferences
  preferred_position?: string;
  salary_expectation?: string;
  availability_date?: string;
  work_schedule_preference?: string;
  // Additional Information
  cover_letter?: string;
  additional_notes?: string;
  // File Uploads
  resume_file?: string;
  portfolio_file?: string;
  certificate_files?: string[];
  // Status and Admin Fields
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'interview';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export default function RegistrationDetail() {
  const params = useParams();
  const [registration, setRegistration] = useState<RegistrationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await fetch(`/api/registration/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setRegistration(data.data);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'reviewed': return <Eye className="w-5 h-5" />;
      case 'accepted': return <CheckCircle className="w-5 h-5" />;
      case 'rejected': return <XCircle className="w-5 h-5" />;
      case 'interview': return <AlertCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
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
    const statusLabels = {
      pending: 'در انتظار بررسی',
      reviewed: 'بررسی شده',
      accepted: 'پذیرفته شده',
      rejected: 'رد شده',
      interview: 'مصاحبه'
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
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

  const formatDatetime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR') + ' ' + 
           new Date(dateString).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
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
    <AdminLayout title="جزئیات فرم ثبت نام">
      <div className="space-y-6">
        {/* Back Button */}
        <Link 
          href="/admin/registrations"
          className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به لیست
        </Link>
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {registration.full_name}
              </h1>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(registration.status)}`}>
                  {getStatusIcon(registration.status)}
                  {getStatusLabel(registration.status)}
                </span>
                <span className="text-gray-500 text-sm">
                  ثبت شده در {formatDatetime(registration.created_at)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExportPDF(registration.id)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                disabled={loading}
              >
                <Download className="w-4 h-4" />
                دانلود PDF
              </button>
              <Link
                href={`/admin/registrations/${registration.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
                ویرایش وضعیت
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">اطلاعات شخصی</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">نام و نام خانوادگی</label>
                    <p className="text-gray-900">{registration.full_name}</p>
                  </div>
                  {registration.birth_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">تاریخ تولد</label>
                      <p className="text-gray-900">{formatDate(registration.birth_date)}</p>
                    </div>
                  )}
                  {registration.national_id && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">کد ملی</label>
                      <p className="text-gray-900">{registration.national_id}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">تلفن همراه</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{registration.mobile}</p>
                    </div>
                  </div>
                  {registration.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">تلفن ثابت</label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900">{registration.phone}</p>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">ایمیل</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{registration.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {registration.address && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-500 block mb-1">آدرس</label>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <p className="text-gray-900">{registration.address}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Education */}
            {(registration.education_level || registration.field_of_study || registration.university) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-bold text-gray-900">تحصیلات</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {registration.education_level && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">مقطع تحصیلی</label>
                      <p className="text-gray-900">{registration.education_level}</p>
                    </div>
                  )}
                  {registration.field_of_study && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">رشته تحصیلی</label>
                      <p className="text-gray-900">{registration.field_of_study}</p>
                    </div>
                  )}
                  {registration.university && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">دانشگاه</label>
                      <p className="text-gray-900">{registration.university}</p>
                    </div>
                  )}
                  {registration.graduation_year && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">سال فارغ التحصیلی</label>
                      <p className="text-gray-900">{registration.graduation_year}</p>
                    </div>
                  )}
                </div>
                
                {registration.gpa && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-500 block mb-1">معدل</label>
                    <p className="text-gray-900">{registration.gpa}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Professional Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">تجربه کاری</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {registration.current_position && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">موقعیت شغلی فعلی</label>
                    <p className="text-gray-900">{registration.current_position}</p>
                  </div>
                )}
                {registration.work_experience_years !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">سابقه کار</label>
                    <p className="text-gray-900">{registration.work_experience_years} سال</p>
                  </div>
                )}
              </div>

              {/* Skills */}
              {registration.skills && registration.skills.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-3">مهارت‌ها</label>
                  <div className="flex flex-wrap gap-2">
                    {registration.skills.map((skill, index) => (
                      <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Software */}
              {registration.software_proficiency && registration.software_proficiency.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-3">نرم‌افزارهای تخصصی</label>
                  <div className="flex flex-wrap gap-2">
                    {registration.software_proficiency.map((software, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Code className="w-3 h-3" />
                        {software}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {registration.languages && registration.languages.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-3">زبان‌های خارجی</label>
                  <div className="flex flex-wrap gap-2">
                    {registration.languages.map((language, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Languages className="w-3 h-3" />
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Portfolio & Projects */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-yellow-500" />
                نمونه کارها و پروژه‌ها
              </h2>

              {/* Has Portfolio */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500 block mb-2">دارای نمونه کار</label>
                <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full ${
                  registration.has_portfolio ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {registration.has_portfolio ? '✓ دارد' : '✗ ندارد'}
                </span>
              </div>

              {/* Portfolio URL */}
              {registration.portfolio_url && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-500 block mb-2">آدرس نمونه کار</label>
                  <a href={registration.portfolio_url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 underline">
                    {registration.portfolio_url}
                  </a>
                </div>
              )}

              {/* Project Types */}
              {registration.project_types && registration.project_types.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-3">نوع پروژه‌های انجام شده</label>
                  <div className="flex flex-wrap gap-2">
                    {registration.project_types.map((type, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Behavioral Assessment */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                ارزیابی رفتاری
              </h2>

              {/* Digital Interests */}
              {registration.digital_interests && registration.digital_interests.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-3">علایق دیجیتال</label>
                  <div className="flex flex-wrap gap-2">
                    {registration.digital_interests.map((interest, index) => (
                      <span key={index} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attractive Traits */}
              {registration.attractive_traits && registration.attractive_traits.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-3">ویژگی‌های جذاب شخصیتی</label>
                  <div className="flex flex-wrap gap-2">
                    {registration.attractive_traits.map((trait, index) => (
                      <span key={index} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* First Salary Plan */}
              {registration.first_salary_plan && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">برنامه برای اولین حقوق</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.first_salary_plan}</p>
                </div>
              )}

              {/* Shopping Preference */}
              {registration.shopping_preference && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">ترجیح خرید</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.shopping_preference}</p>
                </div>
              )}

              {/* Free Time Activity */}
              {registration.free_time_activity && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">فعالیت اوقات فراغت</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.free_time_activity}</p>
                </div>
              )}

              {/* Mountain Path Choice */}
              {registration.mountain_path_choice && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">انتخاب مسیر کوهنوردی</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.mountain_path_choice}</p>
                </div>
              )}
            </motion.div>

            {/* Work Scenarios */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                سناریوهای کاری
              </h2>

              {/* Work Mistake Reaction */}
              {registration.work_mistake_reaction && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">واکنش به اشتباه در کار</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.work_mistake_reaction}</p>
                </div>
              )}

              {/* Soup Preference */}
              {registration.soup_preference && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">ترجیح سوپ</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.soup_preference}</p>
                </div>
              )}

              {/* Workspace Cleanliness */}
              {registration.workspace_cleanliness && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">نظم و نزافت محیط کار</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.workspace_cleanliness}</p>
                </div>
              )}

              {/* Previous Work Environment */}
              {registration.previous_work_environment && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">محیط کار قبلی</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.previous_work_environment}</p>
                </div>
              )}

              {/* Colleague Problem Help */}
              {registration.colleague_problem_help && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">کمک به همکار در مشکل</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.colleague_problem_help}</p>
                </div>
              )}

              {/* Colleague Oversight */}
              {registration.colleague_oversight && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">نظارت بر همکار</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.colleague_oversight}</p>
                </div>
              )}

              {/* Overtime Request Reaction */}
              {registration.overtime_request_reaction && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">واکنش به درخواست اضافه کاری</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.overtime_request_reaction}</p>
                </div>
              )}

              {/* Rejection Reaction */}
              {registration.rejection_reaction && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">واکنش به رد شدن</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.rejection_reaction}</p>
                </div>
              )}
            </motion.div>

            {/* Work Philosophy & Motivation */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                فلسفه کاری و انگیزه
              </h2>

              {/* Why Join Company */}
              {registration.why_join_company && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">دلیل پیوستن به شرکت</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.why_join_company}</p>
                </div>
              )}

              {/* Employment Reason */}
              {registration.employment_reason && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">دلیل استخدام</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.employment_reason}</p>
                </div>
              )}

              {/* Goals and Plans */}
              {registration.goals_and_plans && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">اهداف و برنامه‌ها</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.goals_and_plans}</p>
                </div>
              )}

              {/* Career Goal */}
              {registration.career_goal && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">هدف شغلی</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.career_goal}</p>
                </div>
              )}

              {/* What Motivates */}
              {registration.what_motivates && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">چه چیز انگیزه می‌دهد</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.what_motivates}</p>
                </div>
              )}

              {/* Personal Strengths */}
              {registration.personal_strengths && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">نقاط قوت شخصی</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.personal_strengths}</p>
                </div>
              )}
            </motion.div>

            {/* Work Experience & Performance */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                تجربه کاری و عملکرد
              </h2>

              {/* Best Work Day */}
              {registration.best_work_day && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">بهترین روز کاری</label>
                  <p className="text-gray-900 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">{registration.best_work_day}</p>
                </div>
              )}

              {/* Worst Work Day */}
              {registration.worst_work_day && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">بدترین روز کاری</label>
                  <p className="text-gray-900 bg-red-50 p-3 rounded-lg border-l-4 border-red-400">{registration.worst_work_day}</p>
                </div>
              )}

              {/* Biggest Work Challenge */}
              {registration.biggest_work_challenge && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">بزرگترین چالش کاری</label>
                  <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">{registration.biggest_work_challenge}</p>
                </div>
              )}

              {/* Customer Service */}
              {registration.customer_service && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">خدمات مشتری</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.customer_service}</p>
                </div>
              )}

              {/* Company Research */}
              {registration.company_research && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">تحقیق درباره شرکت</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.company_research}</p>
                </div>
              )}
            </motion.div>

            {/* Team & Management */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                کار تیمی و مدیریت
              </h2>

              {/* Criticism Opinion */}
              {registration.criticism_opinion && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">نظر در مورد انتقاد</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.criticism_opinion}</p>
                </div>
              )}

              {/* Teamwork Budget */}
              {registration.teamwork_budget && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">بودجه کار تیمی</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.teamwork_budget}</p>
                </div>
              )}

              {/* Improvement Suggestion */}
              {registration.improvement_suggestion && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">پیشنهاد بهبود</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.improvement_suggestion}</p>
                </div>
              )}

              {/* Group Criticism */}
              {registration.group_criticism && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">انتقاد گروهی</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.group_criticism}</p>
                </div>
              )}

              {/* Group Management */}
              {registration.group_management && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">مدیریت گروه</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.group_management}</p>
                </div>
              )}

              {/* Skill Opinion */}
              {registration.skill_opinion && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">نظر در مورد مهارت</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.skill_opinion}</p>
                </div>
              )}
            </motion.div>

            {/* Salary & Benefits */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                حقوق و مزایا
              </h2>

              {/* Salary Choice */}
              {registration.salary_choice && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-500 block mb-2">انتخاب حقوق</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{registration.salary_choice}</p>
                </div>
              )}
            </motion.div>
            {(registration.has_portfolio || registration.project_types?.length) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-bold text-gray-900">نمونه کار و پروژه‌ها</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">آیا نمونه کار دارد؟</label>
                    <p className="text-gray-900">{registration.has_portfolio ? 'بله' : 'خیر'}</p>
                  </div>
                  
                  {registration.portfolio_url && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">لینک نمونه کار</label>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a 
                          href={registration.portfolio_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          {registration.portfolio_url}
                        </a>
                      </div>
                    </div>
                  )}

                  {registration.project_types && registration.project_types.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-3">انواع پروژه‌ها</label>
                      <div className="flex flex-wrap gap-2">
                        {registration.project_types.map((type, index) => (
                          <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Career Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">ترجیحات شغلی</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {registration.preferred_position && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">موقعیت شغلی مورد نظر</label>
                    <p className="text-gray-900">{registration.preferred_position}</p>
                  </div>
                )}
                {registration.salary_expectation && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">انتظار حقوق</label>
                    <p className="text-gray-900">{registration.salary_expectation}</p>
                  </div>
                )}
                {registration.availability_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">تاریخ آمادگی</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{formatDate(registration.availability_date)}</p>
                    </div>
                  </div>
                )}
                {registration.work_schedule_preference && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">نوع همکاری</label>
                    <p className="text-gray-900">{
                      {
                        'full-time': 'تمام وقت',
                        'part-time': 'پاره وقت',
                        'remote': 'دورکاری',
                        'hybrid': 'ترکیبی'
                      }[registration.work_schedule_preference] || registration.work_schedule_preference
                    }</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Cover Letter & Notes */}
            {(registration.cover_letter || registration.additional_notes) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Bookmark className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-bold text-gray-900">اطلاعات تکمیلی</h2>
                </div>
                
                {registration.cover_letter && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-500 block mb-2">انگیزه نامه</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{registration.cover_letter}</p>
                    </div>
                  </div>
                )}

                {registration.additional_notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">توضیحات اضافی</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{registration.additional_notes}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Files */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">فایل‌های ضمیمه</h3>
              <div className="space-y-3">
                {registration.resume_file && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">رزومه</span>
                    </div>
                    <a
                      href={registration.resume_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                )}
                
                {registration.portfolio_file && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">نمونه کار</span>
                    </div>
                    <a
                      href={registration.portfolio_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {registration.certificate_files && registration.certificate_files.length > 0 &&
                  registration.certificate_files.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">گواهینامه {index + 1}</span>
                      </div>
                      <a
                        href={cert}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))
                }

                {!registration.resume_file && !registration.portfolio_file && 
                 (!registration.certificate_files || registration.certificate_files.length === 0) && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    هیچ فایلی ضمیمه نشده است
                  </p>
                )}
              </div>
            </motion.div>

            {/* Admin Notes */}
            {registration.admin_notes && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">یادداشت مدیر</h3>
                <div className="bg-yellow-50 p-4 rounded-lg border-r-4 border-yellow-400">
                  <p className="text-gray-900 whitespace-pre-wrap">{registration.admin_notes}</p>
                </div>
              </motion.div>
            )}

            {/* Status History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">سوابق</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">تاریخ ثبت</span>
                  <span className="text-gray-900">{formatDatetime(registration.created_at)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">آخرین تغییر</span>
                  <span className="text-gray-900">{formatDatetime(registration.updated_at)}</span>
                </div>
                {registration.reviewed_at && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">تاریخ بررسی</span>
                    <span className="text-gray-900">{formatDatetime(registration.reviewed_at)}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}