import { motion } from 'framer-motion';
import { FormData } from '../types';

interface Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  onToggle: (field: keyof FormData, value: string) => void;
}

export default function BehavioralQuestionsStep({ formData, onChange, onToggle }: Props) {
  const digitalInterestsOptions = [
    'شبکه‌های اجتماعی',
    'بازی‌های آنلاین',
    'یادگیری آنلاین',
    'خرید اینترنتی',
    'فیلم و سریال',
    'موسیقی',
    'کتاب الکترونیک'
  ];

  const attractiveTraitsOptions = [
    'صداقت',
    'مسئولیت‌پذیری',
    'خلاقیت',
    'کار تیمی',
    'رهبری',
    'انعطاف‌پذیری',
    'دقت',
    'انگیزه بالا'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">سوالات رفتاری</h2>
        <p className="text-gray-400">لطفاً به سوالات زیر با صداقت پاسخ دهید</p>
      </div>

      {/* Digital Interests */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-white font-medium mb-4">علاقمندی‌های دیجیتال شما شامل کدام‌یک از موارد زیر است؟ (چندتایی)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {digitalInterestsOptions.map((option) => (
            <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.digital_interests.includes(option)}
                onChange={() => onToggle('digital_interests', option)}
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
          {[
            'پس‌انداز می‌کنم',
            'به خانواده کمک می‌کنم',
            'خرید شخصی انجام می‌دهم',
            'سرمایه‌گذاری می‌کنم',
            'در آموزش سرمایه‌گذاری می‌کنم'
          ].map((option) => (
            <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
              <input
                type="radio"
                name="first_salary_plan"
                value={option}
                checked={formData.first_salary_plan === option}
                onChange={(e) => onChange('first_salary_plan', e.target.value)}
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
          {[
            'آنلاین و اینترنتی',
            'حضوری از فروشگاه‌ها',
            'از دوستان و آشنایان',
            'ترکیبی از همه روش‌ها'
          ].map((option) => (
            <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
              <input
                type="radio"
                name="shopping_preference"
                value={option}
                checked={formData.shopping_preference === option}
                onChange={(e) => onChange('shopping_preference', e.target.value)}
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
          {attractiveTraitsOptions.map((option) => (
            <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.attractive_traits.includes(option)}
                onChange={() => onToggle('attractive_traits', option)}
                disabled={formData.attractive_traits.length >= 3 && !formData.attractive_traits.includes(option)}
                className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 rounded focus:ring-yellow-500 focus:ring-2 disabled:opacity-50"
              />
              <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
            </label>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2">
          انتخاب شده: {formData.attractive_traits.length} از ۳
        </p>
      </div>

      {/* Mountain Path Choice */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-white font-medium mb-4">در مسیر کوهستانی، کدام مسیر را انتخاب می‌کنید؟</h3>
        <div className="space-y-3">
          {[
            'مسیر کوتاه و پرتنش',
            'مسیر طولانی و آرام',
            'مسیر متعادل',
            'مسیری که دیگران انتخاب کرده‌اند'
          ].map((option) => (
            <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
              <input
                type="radio"
                name="mountain_path_choice"
                value={option}
                checked={formData.mountain_path_choice === option}
                onChange={(e) => onChange('mountain_path_choice', e.target.value)}
                className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
              />
              <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Free Time Activity */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-white font-medium mb-4">در اوقات فراغت ترجیح می‌دهید چه کاری انجام دهید؟</h3>
        <div className="space-y-3">
          {[
            'مطالعه و یادگیری',
            'ورزش و فعالیت بدنی',
            'تماشای فیلم و سریال',
            'گذراندن وقت با خانواده و دوستان',
            'کارهای هنری و خلاقانه'
          ].map((option) => (
            <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
              <input
                type="radio"
                name="free_time_activity"
                value={option}
                checked={formData.free_time_activity === option}
                onChange={(e) => onChange('free_time_activity', e.target.value)}
                className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
              />
              <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Mistake Reaction */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-white font-medium mb-4">اگر در کار اشتباهی کردید، واکنش شما چیست؟</h3>
        <div className="space-y-3">
          {[
            'فوراً آن را اصلاح می‌کنم',
            'با مسئول مشورت می‌کنم',
            'از تجربه درس می‌گیرم',
            'کمک همکاران را می‌طلبم'
          ].map((option) => (
            <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
              <input
                type="radio"
                name="work_mistake_reaction"
                value={option}
                checked={formData.work_mistake_reaction === option}
                onChange={(e) => onChange('work_mistake_reaction', e.target.value)}
                className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
              />
              <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Quick Questions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-white font-medium mb-4">کدام سوپ را ترجیح می‌دهید؟</h3>
          <div className="space-y-2">
            {['سوپ داغ', 'سوپ معتدل', 'سوپ سرد', 'اهمیتی ندارد'].map((option) => (
              <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                <input
                  type="radio"
                  name="soup_preference"
                  value={option}
                  checked={formData.soup_preference === option}
                  onChange={(e) => onChange('soup_preference', e.target.value)}
                  className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
                />
                <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-white font-medium mb-4">محیط کاری شما معمولاً چگونه است؟</h3>
          <div className="space-y-2">
            {['مرتب و تمیز', 'کمی بی‌نظم', 'خیلی شلوغ', 'متغیر'].map((option) => (
              <label key={option} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                <input
                  type="radio"
                  name="workspace_cleanliness"
                  value={option}
                  checked={formData.workspace_cleanliness === option}
                  onChange={(e) => onChange('workspace_cleanliness', e.target.value)}
                  className="w-4 h-4 text-yellow-500 bg-transparent border-2 border-white/40 focus:ring-yellow-500 focus:ring-2"
                />
                <span className="text-white group-hover:text-yellow-400 transition-colors">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}