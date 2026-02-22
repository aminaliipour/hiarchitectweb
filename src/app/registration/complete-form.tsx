'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Brain, 
  Briefcase, 
  FileText, 
  Settings,
  ArrowRight,
  ArrowLeft,
  Home,
  Upload,
  Save,
  CheckCircle,
  MessageCircle,
  Plus,
  X,
  File
} from 'lucide-react';
import Link from 'next/link';

interface FormData {
  // Personal Information
  full_name: string;
  birth_date: string;
  national_id: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  
  // Behavioral Questions
  digital_interests: string[];
  first_salary_plan: string;
  shopping_preference: string;
  attractive_traits: string[];
  mountain_path_choice: string;
  free_time_activity: string;
  work_mistake_reaction: string;
  soup_preference: string;
  workspace_cleanliness: string;
  previous_work_environment: string;
  colleague_problem_help: string;
  colleague_oversight: string;
  overtime_request_reaction: string;
  rejection_reaction: string;
  
  // Educational Information
  education_level: string;
  field_of_study: string;
  university: string;
  graduation_year: string;
  gpa: string;
  
  // Work Experience
  work_experience_years: string;
  current_position: string;
  work_history: Array<{
    job_title: string;
    company: string;
    start_date: string;
    end_date: string;
    reason_for_leaving: string;
  }>;
  
  // Extended Questions
  why_join_company: string;
  criticism_opinion: string;
  teamwork_budget: string;
  improvement_suggestion: string;
  group_criticism: string;
  group_management: string;
  employment_reason: string;
  goals_and_plans: string;
  customer_service: string;
  salary_choice: string;
  company_research: string;
  skill_opinion: string;
  career_goal: string;
  
  // Personal Reflection
  worst_work_day: string;
  best_work_day: string;
  biggest_work_challenge: string;
  what_motivates: string;
  personal_strengths: string;
  
  // Skills & Experience
  skills: string[];
  software_proficiency: string[];
  languages: string[];
  has_portfolio: boolean;
  portfolio_url: string;
  project_types: string[];
  
  // Career Preferences
  preferred_position: string;
  salary_expectation: string;
  availability_date: string;
  work_schedule_preference: string;
  
  // Additional Information
  cover_letter: string;
  additional_notes: string;
}

const initialFormData: FormData = {
  full_name: '',
  birth_date: '',
  national_id: '',
  phone: '',
  mobile: '',
  email: '',
  address: '',
  digital_interests: [],
  first_salary_plan: '',
  shopping_preference: '',
  attractive_traits: [],
  mountain_path_choice: '',
  free_time_activity: '',
  work_mistake_reaction: '',
  soup_preference: '',
  workspace_cleanliness: '',
  previous_work_environment: '',
  colleague_problem_help: '',
  colleague_oversight: '',
  overtime_request_reaction: '',
  rejection_reaction: '',
  education_level: '',
  field_of_study: '',
  university: '',
  graduation_year: '',
  gpa: '',
  work_experience_years: '',
  current_position: '',
  work_history: [],
  why_join_company: '',
  criticism_opinion: '',
  teamwork_budget: '',
  improvement_suggestion: '',
  group_criticism: '',
  group_management: '',
  employment_reason: '',
  goals_and_plans: '',
  customer_service: '',
  salary_choice: '',
  company_research: '',
  skill_opinion: '',
  career_goal: '',
  worst_work_day: '',
  best_work_day: '',
  biggest_work_challenge: '',
  what_motivates: '',
  personal_strengths: '',
  skills: [],
  software_proficiency: [],
  languages: [],
  has_portfolio: false,
  portfolio_url: '',
  project_types: [],
  preferred_position: '',
  salary_expectation: '',
  availability_date: '',
  work_schedule_preference: '',
  cover_letter: '',
  additional_notes: ''
};

export default function ExtendedRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState<{
    resume?: File;
    portfolio?: File;
    certificates?: File[];
  }>({});

  const steps = [
    {
      title: 'اطلاعات شخصی',
      icon: <User className="w-5 h-5" />,
      description: 'مشخصات و اطلاعات تماس'
    },
    {
      title: 'سوالات رفتاری',
      icon: <Brain className="w-5 h-5" />,
      description: 'سوالات چندگزینه‌ای شخصیت‌شناسی'
    },
    {
      title: 'تحصیلات و تجربه',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'سوابق تحصیلی و کاری'
    },
    {
      title: 'سوالات تشریحی',
      icon: <MessageCircle className="w-5 h-5" />,
      description: 'سوالات باز و تفصیلی'
    },
    {
      title: 'مهارت‌ها و فایل‌ها',
      icon: <FileText className="w-5 h-5" />,
      description: 'مهارت‌ها، نمونه کار و مدارک'
    },
    {
      title: 'تکمیل فرم',
      icon: <Settings className="w-5 h-5" />,
      description: 'ترجیحات نهایی و ارسال'
    }
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInput = (field: keyof FormData, value: string) => {
    if (value.trim()) {
      const currentArray = formData[field] as string[];
      if (!currentArray.includes(value.trim())) {
        handleInputChange(field, [...currentArray, value.trim()]);
      }
    }
  };

  const removeFromArray = (field: keyof FormData, index: number) => {
    const currentArray = formData[field] as string[];
    handleInputChange(field, currentArray.filter((_, i) => i !== index));
  };

  const toggleArrayItem = (field: keyof FormData, value: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(value)) {
      handleInputChange(field, currentArray.filter(item => item !== value));
    } else {
      handleInputChange(field, [...currentArray, value]);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSubmit = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formDataToSubmit.append(key, JSON.stringify(value));
        } else if (typeof value === 'object' && value !== null) {
          formDataToSubmit.append(key, JSON.stringify(value));
        } else {
          formDataToSubmit.append(key, value?.toString() || '');
        }
      });

      // Add files
      if (files.resume) {
        formDataToSubmit.append('resume_file', files.resume);
      }
      if (files.portfolio) {
        formDataToSubmit.append('portfolio_file', files.portfolio);
      }
      if (files.certificates) {
        files.certificates.forEach((file, index) => {
          formDataToSubmit.append(`certificate_${index}`, file);
        });
      }

      const response = await fetch('/api/registration', {
        method: 'POST',
        body: formDataToSubmit
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'خطای نامشخص' }));
        throw new Error(errorData.message || 'خطا در ارسال فرم');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`خطا در ارسال فرم: ${error instanceof Error ? error.message : 'خطای نامشخص'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white max-w-md"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">فرم با موفقیت ارسال شد!</h2>
          <p className="text-gray-400 mb-8">
            فرم ثبت نام شما دریافت شد و در اسرع وقت بررسی خواهد شد.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <Home className="w-4 h-4" />
            بازگشت به خانه
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>بازگشت به ورود</span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            فرم درخواست <span className="text-yellow-500">همکاری</span>
          </h1>
          <p className="text-gray-400">
            لطفاً تمامی سوالات را با دقت و صداقت پاسخ دهید
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {index < currentStep ? '✓' : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-1 mx-2 ${
                    index < currentStep ? 'bg-yellow-500' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-yellow-500 font-medium text-lg">{steps[currentStep].title}</span>
            <p className="text-gray-400 text-sm mt-1">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 0: Personal Info */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">اطلاعات شخصی</h2>
                    <p className="text-gray-400">مشخصات و اطلاعات تماس خود را وارد کنید</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">نام و نام خانوادگی *</label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="نام کامل خود را وارد کنید"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">تاریخ تولد *</label>
                      <input
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => handleInputChange('birth_date', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">کد ملی *</label>
                      <input
                        type="text"
                        value={formData.national_id}
                        onChange={(e) => handleInputChange('national_id', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="کد ملی ۱۰ رقمی"
                        maxLength={10}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">تلفن ثابت</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="021-12345678"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">تلفن همراه *</label>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="09123456789"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">ایمیل *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">آدرس کامل *</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                      placeholder="آدرس کامل محل سکونت خود را وارد کنید"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 1: Behavioral Questions */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">سوالات رفتاری</h2>
                    <p className="text-gray-400">لطفاً به سوالات زیر با صداقت پاسخ دهید</p>
                  </div>

                  {/* Digital Interests */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-medium mb-4">علاقمندی‌های دیجیتال شما شامل کدام‌یک از موارد زیر است؟ (چندتایی)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['شبکه‌های اجتماعی', 'بازی‌های آنلاین', 'یادگیری آنلاین', 'خرید اینترنتی', 'فیلم و سریال', 'موسیقی', 'کتاب الکترونیک'].map((option) => (
                        <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.digital_interests.includes(option)}
                            onChange={() => toggleArrayItem('digital_interests', option)}
                            className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 rounded focus:ring-yellow-500 focus:ring-2"
                          />
                          <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* First Salary Plan */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-medium mb-4">با اولین حقوق خود چه کاری انجام خواهید داد؟</h3>
                    <div className="space-y-3">
                      {['پس‌انداز می‌کنم', 'به خانواده کمک می‌کنم', 'خرید شخصی انجام می‌دهم', 'سرمایه‌گذاری می‌کنم', 'در آموزش سرمایه‌گذاری می‌کنم'].map((option) => (
                        <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                          <input
                            type="radio"
                            name="first_salary_plan"
                            value={option}
                            checked={formData.first_salary_plan === option}
                            onChange={(e) => handleInputChange('first_salary_plan', e.target.value)}
                            className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
                          />
                          <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Shopping Preference */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-medium mb-4">ترجیح می‌دهید خریدهایتان را چگونه انجام دهید؟</h3>
                    <div className="space-y-3">
                      {['آنلاین و اینترنتی', 'حضوری از فروشگاه‌ها', 'از دوستان و آشنایان', 'ترکیبی از همه روش‌ها'].map((option) => (
                        <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                          <input
                            type="radio"
                            name="shopping_preference"
                            value={option}
                            checked={formData.shopping_preference === option}
                            onChange={(e) => handleInputChange('shopping_preference', e.target.value)}
                            className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
                          />
                          <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Attractive Traits */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-medium mb-4">جذاب‌ترین ویژگی‌های شخصیتی خود را انتخاب کنید (حداکثر ۳ مورد)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['صداقت', 'مسئولیت‌پذیری', 'خلاقیت', 'کار تیمی', 'رهبری', 'انعطاف‌پذیری', 'دقت', 'انگیزه بالا'].map((option) => (
                        <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.attractive_traits.includes(option)}
                            onChange={() => toggleArrayItem('attractive_traits', option)}
                            disabled={formData.attractive_traits.length >= 3 && !formData.attractive_traits.includes(option)}
                            className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 rounded focus:ring-yellow-500 focus:ring-2 disabled:opacity-50"
                          />
                          <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm mt-2">انتخاب شده: {formData.attractive_traits.length} از ۳</p>
                  </div>

                  {/* Additional Quick Questions */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-lg">
                      <h3 className="text-white font-medium mb-4">در مسیر کوهستانی، کدام مسیر را انتخاب می‌کنید؟</h3>
                      <div className="space-y-2">
                        {['مسیر کوتاه و پرتنش', 'مسیر طولانی و آرام', 'مسیر متعادل', 'مسیری که دیگران انتخاب کرده‌اند'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                            <input
                              type="radio"
                              name="mountain_path_choice"
                              value={option}
                              checked={formData.mountain_path_choice === option}
                              onChange={(e) => handleInputChange('mountain_path_choice', e.target.value)}
                              className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
                            />
                            <span className="text-white group-hover:text-yellow-400 transition-colors text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-lg">
                      <h3 className="text-white font-medium mb-4">در اوقات فراغت چه کاری انجام می‌دهید؟</h3>
                      <div className="space-y-2">
                        {['مطالعه و یادگیری', 'ورزش و فعالیت بدنی', 'تماشای فیلم و سریال', 'گذراندن وقت با خانواده', 'کارهای هنری و خلاقانه'].map((option) => (
                          <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                            <input
                              type="radio"
                              name="free_time_activity"
                              value={option}
                              checked={formData.free_time_activity === option}
                              onChange={(e) => handleInputChange('free_time_activity', e.target.value)}
                              className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
                            />
                            <span className="text-white group-hover:text-yellow-400 transition-colors text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Education & Experience */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">تحصیلات و تجربه</h2>
                    <p className="text-gray-400">سوابق تحصیلی و تجربه کاری خود را وارد کنید</p>
                  </div>

                  {/* Educational Information */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-semibold text-lg mb-6">اطلاعات تحصیلی</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-2">مقطع تحصیلی *</label>
                        <select
                          value={formData.education_level}
                          onChange={(e) => handleInputChange('education_level', e.target.value)}
                          className="w-full px-4 py-3 /10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          required
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="diploma">دیپلم</option>
                          <option value="associate">فوق دیپلم</option>
                          <option value="bachelor">کارشناسی</option>
                          <option value="master">کارشناسی ارشد</option>
                          <option value="doctorate">دکتری</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">رشته تحصیلی *</label>
                        <input
                          type="text"
                          value={formData.field_of_study}
                          onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="نام رشته تحصیلی"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">نام دانشگاه/مؤسسه *</label>
                        <input
                          type="text"
                          value={formData.university}
                          onChange={(e) => handleInputChange('university', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="نام دانشگاه یا مؤسسه آموزشی"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">سال فارغ‌التحصیلی *</label>
                        <input
                          type="text"
                          value={formData.graduation_year}
                          onChange={(e) => handleInputChange('graduation_year', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="1400"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white font-medium mb-2">معدل</label>
                        <input
                          type="text"
                          value={formData.gpa}
                          onChange={(e) => handleInputChange('gpa', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="18.50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-semibold text-lg mb-6">تجربه کاری</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-2">سال‌های تجربه کاری</label>
                        <select
                          value={formData.work_experience_years}
                          onChange={(e) => handleInputChange('work_experience_years', e.target.value)}
                          className="w-full px-4 py-3                           pm2 restart hiarchitectweb/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="0">بدون تجربه</option>
                          <option value="1">کمتر از ۱ سال</option>
                          <option value="2">۱-۲ سال</option>
                          <option value="3">۲-۵ سال</option>
                          <option value="5">۵-۱۰ سال</option>
                          <option value="10">بیش از ۱۰ سال</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">موقعیت شغلی فعلی</label>
                        <input
                          type="text"
                          value={formData.current_position}
                          onChange={(e) => handleInputChange('current_position', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="عنوان شغل فعلی (در صورت داشتن)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Open Ended Questions */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">سوالات تشریحی</h2>
                    <p className="text-gray-400">لطفاً به سوالات زیر با جزئیات پاسخ دهید</p>
                  </div>

                  {[
                    { key: 'why_join_company', question: 'چرا می‌خواهید به شرکت ما بپیوندید؟' },
                    { key: 'employment_reason', question: 'دلیل اصلی شما برای جستجوی شغل جدید چیست؟' },
                    { key: 'goals_and_plans', question: 'اهداف و برنامه‌های آینده شما چیست؟' },
                    { key: 'what_motivates', question: 'چه چیزی شما را در کار انگیزه می‌دهد؟' },
                  ].map((item, index) => (
                    <div key={item.key} className="bg-white/5 p-6 rounded-lg border border-white/10">
                      <label className="block text-white font-medium mb-3">
                        <span className="text-yellow-500 font-bold">{index + 1}.</span> {item.question}
                      </label>
                      <textarea
                        value={formData[item.key as keyof FormData] as string}
                        onChange={(e) => handleInputChange(item.key as keyof FormData, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-y min-h-[120px]"
                        placeholder="پاسخ خود را با جزئیات بنویسید..."
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Step 4: Skills & Portfolio */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">مهارت‌ها و نمونه کار</h2>
                    <p className="text-gray-400">مهارت‌ها و تخصص‌های خود را معرفی کنید</p>
                  </div>

                  {/* Skills */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-semibold text-lg mb-6">مهارت‌های اصلی</h3>
                    <div className="mb-4">
                      <input
                        type="text"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value.trim()) {
                              handleArrayInput('skills', value);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="مهارت را تایپ کنید و Enter بزنید"
                      />
                    </div>
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                            <button
                              onClick={() => removeFromArray('skills', index)}
                              className="w-4 h-4 flex items-center justify-center hover:bg-black/20 rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Languages */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-semibold text-lg mb-6">زبان‌های مسلط</h3>
                    <div className="mb-4">
                      <input
                        type="text"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value.trim()) {
                              handleArrayInput('languages', value);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="زبان را تایپ کنید و Enter بزنید"
                      />
                    </div>
                    {formData.languages.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.languages.map((language, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm"
                          >
                            {language}
                            <button
                              onClick={() => removeFromArray('languages', index)}
                              className="w-4 h-4 flex items-center justify-center hover:bg-black/20 rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Portfolio */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-semibold text-lg mb-6">نمونه کار</h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.has_portfolio}
                          onChange={(e) => handleInputChange('has_portfolio', e.target.checked)}
                          className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 rounded focus:ring-yellow-500 focus:ring-2"
                        />
                        <span className="text-white font-medium">نمونه کار آنلاین دارم</span>
                      </label>
                      {formData.has_portfolio && (
                        <input
                          type="url"
                          value={formData.portfolio_url}
                          onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="آدرس وب‌سایت نمونه کار"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Final Step & File Upload */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">تکمیل نهایی</h2>
                    <p className="text-gray-400">آپلود مدارک و تکمیل اطلاعات پایانی</p>
                  </div>

                  {/* Career Preferences */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-semibold text-lg mb-6">ترجیحات شغلی</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-2">موقعیت مورد علاقه</label>
                        <input
                          type="text"
                          value={formData.preferred_position}
                          onChange={(e) => handleInputChange('preferred_position', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="عنوان شغل مورد نظر"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">انتظار حقوقی (تومان)</label>
                        <input
                          type="text"
                          value={formData.salary_expectation}
                          onChange={(e) => handleInputChange('salary_expectation', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="مثال: 15000000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-semibold text-lg mb-6">انگیزه نامه</h3>
                    <textarea
                      value={formData.cover_letter}
                      onChange={(e) => handleInputChange('cover_letter', e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                      placeholder="در اینجا دلایل علاقه‌مندی خود به این موقعیت شغلی را بنویسید..."
                    />
                  </div>

                  {/* File Upload */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-white font-semibold text-lg mb-6">آپلود مدارک</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-2">رزومه (اختیاری)</label>
                        <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFiles(prev => ({ ...prev, resume: file }));
                              }
                            }}
                            className="hidden"
                            id="resume-upload"
                          />
                          <label htmlFor="resume-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">PDF, DOC, DOCX</p>
                          </label>
                        </div>
                        {files.resume && (
                          <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg mt-2">
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-white">{files.resume.name}</span>
                            </div>
                            <button
                              onClick={() => setFiles(prev => ({ ...prev, resume: undefined }))}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">نمونه کار (اختیاری)</label>
                        <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors">
                          <input
                            type="file"
                            accept=".pdf,.zip,.rar"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFiles(prev => ({ ...prev, portfolio: file }));
                              }
                            }}
                            className="hidden"
                            id="portfolio-upload"
                          />
                          <label htmlFor="portfolio-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">PDF, ZIP, RAR</p>
                          </label>
                        </div>
                        {files.portfolio && (
                          <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg mt-2">
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-white">{files.portfolio.name}</span>
                            </div>
                            <button
                              onClick={() => setFiles(prev => ({ ...prev, portfolio: undefined }))}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Summary */}
                  <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-6 rounded-lg border border-yellow-500/20">
                    <h3 className="text-white font-semibold text-lg mb-4">خلاصه فرم</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                      <div>
                        <p><strong>نام:</strong> {formData.full_name || 'وارد نشده'}</p>
                        <p><strong>ایمیل:</strong> {formData.email || 'وارد نشده'}</p>
                        <p><strong>تحصیلات:</strong> {formData.education_level || 'وارد نشده'}</p>
                      </div>
                      <div>
                        <p><strong>تجربه کاری:</strong> {formData.work_experience_years || 'وارد نشده'}</p>
                        <p><strong>مهارت‌ها:</strong> {formData.skills.length} مورد</p>
                        <p><strong>فایل‌ها:</strong> {(files.resume ? 1 : 0) + (files.portfolio ? 1 : 0)} مورد</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              قبلی
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    ارسال فرم
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
              >
                بعدی
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}