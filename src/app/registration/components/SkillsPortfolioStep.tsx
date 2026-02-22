import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { FormData } from '../types';

interface Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  onArrayAdd: (field: keyof FormData, value: string) => void;
  onArrayRemove: (field: keyof FormData, index: number) => void;
}

export default function SkillsPortfolioStep({ formData, onChange, onArrayAdd, onArrayRemove }: Props) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, field: keyof FormData) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value;
      if (value.trim()) {
        onArrayAdd(field, value);
        e.currentTarget.value = '';
      }
    }
  };

  const skillsCategories = [
    'طراحی گرافیک',
    'توسعه وب',
    'برنامه‌نویسی',
    'مدیریت پروژه',
    'بازاریابی دیجیتال',
    'فروش',
    'خدمات مشتری',
    'حسابداری',
    'منابع انسانی',
    'مدیریت',
    'تحلیل داده',
    'طراحی UI/UX',
    'SEO',
    'شبکه‌های اجتماعی',
    'عکاسی',
    'تدوین ویدیو',
    'نگارش محتوا',
    'ترجمه'
  ];

  const softwareList = [
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Adobe After Effects',
    'Adobe Premiere Pro',
    'Figma',
    'Sketch',
    'AutoCAD',
    '3ds Max',
    'Microsoft Office',
    'Google Workspace',
    'WordPress',
    'HTML/CSS',
    'JavaScript',
    'Python',
    'PHP',
    'React',
    'Vue.js',
    'Node.js'
  ];

  const languagesList = [
    'فارسی',
    'انگلیسی',
    'عربی',
    'فرانسوی',
    'آلمانی',
    'اسپانیایی',
    'ترکی',
    'روسی',
    'چینی',
    'ژاپنی'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">مهارت‌ها و نمونه کار</h2>
        <p className="text-gray-400">مهارت‌ها، تخصص‌ها و نمونه کارهای خود را معرفی کنید</p>
      </div>

      {/* Skills Section */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-white font-semibold text-lg mb-6">مهارت‌ها و تخصص‌ها</h3>
        
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">مهارت‌های اصلی شما</label>
          <input
            type="text"
            onKeyPress={(e) => handleKeyPress(e, 'skills')}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="نام مهارت را تایپ کنید و Enter بزنید"
          />
          <p className="text-sm text-gray-400 mt-1">از لیست زیر هم می‌توانید انتخاب کنید</p>
        </div>

        {/* Skills Tags */}
        {formData.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => onArrayRemove('skills', index)}
                    className="w-4 h-4 flex items-center justify-center hover:bg-black/20 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Skills Selection */}
        <div className="mb-6">
          <p className="text-white font-medium mb-3">انتخاب سریع از مهارت‌های رایج:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {skillsCategories.map((skill) => (
              <button
                key={skill}
                onClick={() => onArrayAdd('skills', skill)}
                disabled={formData.skills.includes(skill)}
                className="px-3 py-2 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-right"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Software Proficiency */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-white font-semibold text-lg mb-6">مهارت نرم‌افزاری</h3>
        
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">نرم‌افزارهای مسلط</label>
          <input
            type="text"
            onKeyPress={(e) => handleKeyPress(e, 'software_proficiency')}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="نام نرم‌افزار را تایپ کنید و Enter بزنید"
          />
        </div>

        {formData.software_proficiency.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {formData.software_proficiency.map((software, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  {software}
                  <button
                    onClick={() => onArrayRemove('software_proficiency', index)}
                    className="w-4 h-4 flex items-center justify-center hover:bg-black/20 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {softwareList.map((software) => (
            <button
              key={software}
              onClick={() => onArrayAdd('software_proficiency', software)}
              disabled={formData.software_proficiency.includes(software)}
              className="px-3 py-2 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-right"
            >
              {software}
            </button>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-white font-semibold text-lg mb-6">زبان‌های مسلط</h3>
        
        <div className="mb-4">
          <label className="block text-white font-medium mb-2">زبان‌هایی که تسلط دارید</label>
          <input
            type="text"
            onKeyPress={(e) => handleKeyPress(e, 'languages')}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="نام زبان را تایپ کنید و Enter بزنید"
          />
        </div>

        {formData.languages.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((language, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  {language}
                  <button
                    onClick={() => onArrayRemove('languages', index)}
                    className="w-4 h-4 flex items-center justify-center hover:bg-black/20 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {languagesList.map((language) => (
            <button
              key={language}
              onClick={() => onArrayAdd('languages', language)}
              disabled={formData.languages.includes(language)}
              className="px-3 py-2 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-white font-semibold text-lg mb-6">نمونه کار و پورتفولیو</h3>
        
        <div className="space-y-6">
          <div>
            <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
              <input
                type="checkbox"
                checked={formData.has_portfolio}
                onChange={(e) => onChange('has_portfolio', e.target.checked)}
                className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 rounded focus:ring-yellow-500 focus:ring-2"
              />
              <span className="text-white font-medium">نمونه کار آنلاین دارم</span>
            </label>
          </div>

          {formData.has_portfolio && (
            <div>
              <label className="block text-white font-medium mb-2">آدرس پورتفولیو آنلاین</label>
              <input
                type="url"
                value={formData.portfolio_url}
                onChange={(e) => onChange('portfolio_url', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="https://portfolio-website.com"
              />
            </div>
          )}

          <div>
            <label className="block text-white font-medium mb-2">نوع پروژه‌هایی که انجام داده‌اید</label>
            <input
              type="text"
              onKeyPress={(e) => handleKeyPress(e, 'project_types')}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="نوع پروژه را تایپ کنید و Enter بزنید"
            />
            
            {formData.project_types.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {formData.project_types.map((type, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-purple-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {type}
                      <button
                        onClick={() => onArrayRemove('project_types', index)}
                        className="w-4 h-4 flex items-center justify-center hover:bg-black/20 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-6 rounded-lg border border-yellow-500/20">
        <h3 className="text-white font-semibold text-lg mb-4">خلاصه مهارت‌ها</h3>
        <div className="space-y-3 text-gray-300">
          <p><strong>تعداد مهارت‌های اصلی:</strong> {formData.skills.length}</p>
          <p><strong>تعداد نرم‌افزارهای مسلط:</strong> {formData.software_proficiency.length}</p>
          <p><strong>تعداد زبان‌های مسلط:</strong> {formData.languages.length}</p>
          <p><strong>نمونه کار آنلاین:</strong> {formData.has_portfolio ? '✓ دارد' : '✗ ندارد'}</p>
          <p><strong>تعداد انواع پروژه:</strong> {formData.project_types.length}</p>
        </div>
      </div>
    </motion.div>
  );
}