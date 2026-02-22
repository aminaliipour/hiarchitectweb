import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { FormData } from '../types';

interface Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export default function EducationExperienceStep({ formData, onChange }: Props) {
  const addWorkExperience = () => {
    const newWork = {
      job_title: '',
      company: '',
      start_date: '',
      end_date: '',
      reason_for_leaving: ''
    };
    
    onChange('work_history', [...formData.work_history, newWork]);
  };

  const updateWorkExperience = (index: number, field: string, value: string) => {
    const updatedHistory = [...formData.work_history];
    updatedHistory[index] = { ...updatedHistory[index], [field]: value };
    onChange('work_history', updatedHistory);
  };

  const removeWorkExperience = (index: number) => {
    const updatedHistory = formData.work_history.filter((_, i) => i !== index);
    onChange('work_history', updatedHistory);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">تحصیلات و تجربه کاری</h2>
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
              onChange={(e) => onChange('education_level', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
              onChange={(e) => onChange('field_of_study', e.target.value)}
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
              onChange={(e) => onChange('university', e.target.value)}
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
              onChange={(e) => onChange('graduation_year', e.target.value)}
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
              onChange={(e) => onChange('gpa', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="18.50"
            />
          </div>
        </div>
      </div>

      {/* Work Experience Overview */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-white font-semibold text-lg mb-6">خلاصه تجربه کاری</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">سال‌های تجربه کاری</label>
            <select
              value={formData.work_experience_years}
              onChange={(e) => onChange('work_experience_years', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
              onChange={(e) => onChange('current_position', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="عنوان شغل فعلی (در صورت داشتن)"
            />
          </div>
        </div>
      </div>

      {/* Detailed Work History */}
      <div className="bg-white/5 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">تاریخچه شغلی تفصیلی</h3>
          <button
            onClick={addWorkExperience}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            افزودن تجربه کاری
          </button>
        </div>

        {formData.work_history.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>هنوز تجربه کاری اضافه نکرده‌اید</p>
            <p className="text-sm mt-2">روی دکمه "افزودن تجربه کاری" کلیک کنید</p>
          </div>
        ) : (
          <div className="space-y-6">
            {formData.work_history.map((work, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 p-4 rounded-lg border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">تجربه کاری #{index + 1}</h4>
                  <button
                    onClick={() => removeWorkExperience(index)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">عنوان شغل *</label>
                    <input
                      type="text"
                      value={work.job_title}
                      onChange={(e) => updateWorkExperience(index, 'job_title', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="نام پست سازمانی"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">نام شرکت *</label>
                    <input
                      type="text"
                      value={work.company}
                      onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="نام سازمان/شرکت"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">تاریخ شروع *</label>
                    <input
                      type="month"
                      value={work.start_date}
                      onChange={(e) => updateWorkExperience(index, 'start_date', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">تاریخ پایان</label>
                    <input
                      type="month"
                      value={work.end_date}
                      onChange={(e) => updateWorkExperience(index, 'end_date', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="در صورت ادامه کار خالی بگذارید"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">دلیل ترک کار</label>
                    <textarea
                      value={work.reason_for_leaving}
                      onChange={(e) => updateWorkExperience(index, 'reason_for_leaving', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                      placeholder="دلیل ترک این شغل را بنویسید"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
              onChange={(e) => onChange('preferred_position', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="عنوان شغل مورد نظر"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">انتظار حقوقی (تومان)</label>
            <input
              type="text"
              value={formData.salary_expectation}
              onChange={(e) => onChange('salary_expectation', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="مثال: 15000000"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">تاریخ آمادگی برای شروع کار</label>
            <input
              type="date"
              value={formData.availability_date}
              onChange={(e) => onChange('availability_date', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">ترجیح برنامه کاری</label>
            <select
              value={formData.work_schedule_preference}
              onChange={(e) => onChange('work_schedule_preference', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">انتخاب کنید</option>
              <option value="full-time">تمام وقت</option>
              <option value="part-time">نیمه وقت</option>
              <option value="flexible">انعطاف‌پذیر</option>
              <option value="remote">دورکاری</option>
              <option value="hybrid">ترکیبی</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}