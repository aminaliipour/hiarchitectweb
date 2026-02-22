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
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import PersonalInfoStep from './components/PersonalInfoStep';
import BehavioralQuestionsStep from './components/BehavioralQuestionsStep';
import EducationExperienceStep from './components/EducationExperienceStep';
import OpenEndedQuestionsStep from './components/OpenEndedQuestionsStep';
import SkillsPortfolioStep from './components/SkillsPortfolioStep';
import FinalStep from './components/FinalStep';
import { FormData as RegistrationFormData } from './types';

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
              {/* Step Content will be rendered here */}
              {currentStep === 0 && <PersonalInfoStep formData={formData} onChange={handleInputChange} />}
              {currentStep === 1 && <BehavioralQuestionsStep formData={formData} onChange={handleInputChange} onToggle={toggleArrayItem} />}
              {currentStep === 2 && <EducationExperienceStep formData={formData} onChange={handleInputChange} />}
              {currentStep === 3 && <OpenEndedQuestionsStep formData={formData} onChange={handleInputChange} />}
              {currentStep === 4 && <SkillsPortfolioStep formData={formData} onChange={handleInputChange} onArrayAdd={handleArrayInput} onArrayRemove={removeFromArray} />}
              {currentStep === 5 && <FinalStep formData={formData} onChange={handleInputChange} files={files} setFiles={setFiles} />}
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