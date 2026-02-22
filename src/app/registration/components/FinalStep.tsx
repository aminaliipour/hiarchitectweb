import { motion } from 'framer-motion';
import { Upload, File, X } from 'lucide-react';
import { FormData } from '../types';

interface Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  files: {
    resume?: File;
    portfolio?: File;
    certificates?: File[];
  };
  setFiles: React.Dispatch<React.SetStateAction<{
    resume?: File;
    portfolio?: File;
    certificates?: File[];
  }>>;
}

export default function FinalStep({ formData, onChange, files, setFiles }: Props) {
  const handleFileUpload = (type: 'resume' | 'portfolio' | 'certificates', file: File | File[]) => {
    if (type === 'certificates' && Array.isArray(file)) {
      setFiles(prev => ({
        ...prev,
        certificates: [...(prev.certificates || []), ...file]
      }));
    } else if (!Array.isArray(file)) {
      setFiles(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const removeFile = (type: 'resume' | 'portfolio' | 'certificates', index?: number) => {
    if (type === 'certificates' && typeof index === 'number') {
      setFiles(prev => ({
        ...prev,
        certificates: prev.certificates?.filter((_, i) => i !== index)
      }));
    } else {
      setFiles(prev => ({
        ...prev,
        [type]: undefined
      }));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">تکمیل نهایی فرم</h2>
        <p className="text-gray-400">آپلود مدارک و تکمیل اطلاعات پایانی</p>
      </div>

      {/* Remaining Behavioral Questions */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-white font-semibold text-lg mb-6">سوالات تکمیلی</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-3">محیط کار قبلی شما چگونه بود؟</label>
              <div className="space-y-2">
                {['حرفه‌ای و رسمی', 'دوستانه و صمیمی', 'رقابتی و پرتنش', 'آرام و منعطف'].map((option) => (
                  <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                    <input
                      type="radio"
                      name="previous_work_environment"
                      value={option}
                      checked={formData.previous_work_environment === option}
                      onChange={(e) => onChange('previous_work_environment', e.target.value)}
                      className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
                    />
                    <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-3">همکار مشکل دارد، کمک می‌کنید؟</label>
              <div className="space-y-2">
                {['حتماً کمک می‌کنم', 'بستگی به موقعیت دارد', 'اگر وقت داشته باشم', 'ترجیح می‌دهم نکنم'].map((option) => (
                  <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                    <input
                      type="radio"
                      name="colleague_problem_help"
                      value={option}
                      checked={formData.colleague_problem_help === option}
                      onChange={(e) => onChange('colleague_problem_help', e.target.value)}
                      className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
                    />
                    <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-3">همکار کارتان را زیر نظر دارد؟</label>
              <div className="space-y-2">
                {['مسئله‌ای نیست', 'کمی ناراحت می‌شوم', 'با او صحبت می‌کنم', 'به مسئول اطلاع می‌دهم'].map((option) => (
                  <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                    <input
                      type="radio"
                      name="colleague_oversight"
                      value={option}
                      checked={formData.colleague_oversight === option}
                      onChange={(e) => onChange('colleague_oversight', e.target.value)}
                      className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
                    />
                    <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-3">اضافه کاری درخواست شد؟</label>
              <div className="space-y-2">
                {['موافق هستم', 'اگر ضروری باشد', 'فقط با پاداش اضافی', 'ترجیح نمی‌دهم'].map((option) => (
                  <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                    <input
                      type="radio"
                      name="overtime_request_reaction"
                      value={option}
                      checked={formData.overtime_request_reaction === option}
                      onChange={(e) => onChange('overtime_request_reaction', e.target.value)}
                      className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
                    />
                    <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div>
              <label className="block text-white font-medium mb-3">پیشنهادتان رد شد، واکنشتان؟</label>
              <div className="grid grid-cols-2 gap-2">
                {['دلیل آن را می‌پرسم', 'پیشنهاد جدید می‌دهم', 'قبول می‌کنم و ادامه می‌دهم', 'کمی ناراحت می‌شوم اما ادامه می‌دهم'].map((option) => (
                  <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                    <input
                      type="radio"
                      name="rejection_reaction"
                      value={option}
                      checked={formData.rejection_reaction === option}
                      onChange={(e) => onChange('rejection_reaction', e.target.value)}
                      className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
                    />
                    <span className="text-white group-hover:text-yellow-400 transition-colors text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-white font-semibold text-lg mb-6">آپلود مدارک</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Resume Upload */}
          <div className="space-y-4">
            <label className="block text-white font-medium">رزومه (اختیاری)</label>
            <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('resume', file);
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
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-white">{files.resume.name}</span>
                </div>
                <button
                  onClick={() => removeFile('resume')}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Portfolio Upload */}
          <div className="space-y-4">
            <label className="block text-white font-medium">نمونه کار (اختیاری)</label>
            <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors">
              <input
                type="file"
                accept=".pdf,.zip,.rar"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('portfolio', file);
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
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-white">{files.portfolio.name}</span>
                </div>
                <button
                  onClick={() => removeFile('portfolio')}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Certificates Upload */}
          <div className="space-y-4">
            <label className="block text-white font-medium">مدارک (اختیاری)</label>
            <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) handleFileUpload('certificates', files);
                }}
                className="hidden"
                id="certificates-upload"
              />
              <label htmlFor="certificates-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">PDF, JPG, PNG</p>
                <p className="text-xs text-gray-500">چندین فایل</p>
              </label>
            </div>
            {files.certificates && files.certificates.length > 0 && (
              <div className="space-y-2">
                {files.certificates.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-white">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile('certificates', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
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
            <p><strong>تلفن:</strong> {formData.mobile || 'وارد نشده'}</p>
            <p><strong>تحصیلات:</strong> {formData.education_level || 'وارد نشده'}</p>
          </div>
          <div>
            <p><strong>تجربه کاری:</strong> {formData.work_experience_years || 'وارد نشده'}</p>
            <p><strong>مهارت‌ها:</strong> {formData.skills.length} مورد</p>
            <p><strong>زبان‌ها:</strong> {formData.languages.length} مورد</p>
            <p><strong>فایل‌های آپلود شده:</strong> {
              (files.resume ? 1 : 0) + 
              (files.portfolio ? 1 : 0) + 
              (files.certificates?.length || 0)
            } مورد</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-4">
        <p className="text-yellow-300 text-sm">
          ✓ لطفاً قبل از ارسال، اطلاعات را بررسی کنید
        </p>
        <p className="text-yellow-300 text-sm mt-1">
          ✓ پس از ارسال، فرم در اسرع وقت بررسی و با شما تماس گرفته خواهد شد
        </p>
      </div>
    </motion.div>
  );
}