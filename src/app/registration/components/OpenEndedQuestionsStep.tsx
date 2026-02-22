import { motion } from 'framer-motion';
import { FormData } from '../types';

interface Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export default function OpenEndedQuestionsStep({ formData, onChange }: Props) {
  const questions = [
    {
      key: 'why_join_company' as keyof FormData,
      question: 'چرا می‌خواهید به شرکت ما بپیوندید؟',
      placeholder: 'دلایل علاقه‌مندی خود به شرکت و این موقعیت شغلی را شرح دهید...'
    },
    {
      key: 'criticism_opinion' as keyof FormData,
      question: 'نظر شما درباره انتقاد چیست؟',
      placeholder: 'نحوه برخورد با انتقادات سازنده و غیرسازنده را توضیح دهید...'
    },
    {
      key: 'teamwork_budget' as keyof FormData,
      question: 'اگر مسئول بودجه پروژه تیمی باشید، چگونه عمل می‌کنید؟',
      placeholder: 'روش مدیریت بودجه و تصمیم‌گیری‌های مالی در پروژه‌های تیمی را شرح دهید...'
    },
    {
      key: 'improvement_suggestion' as keyof FormData,
      question: 'پیشنهادی برای بهبود فرآیندهای کاری دارید؟',
      placeholder: 'ایده‌ها و پیشنهادات خود برای بهبود روش‌های کار را بیان کنید...'
    },
    {
      key: 'group_criticism' as keyof FormData,
      question: 'چگونه با انتقاد از کار تیم برخورد می‌کنید؟',
      placeholder: 'نحوه مواجهه با انتقادات وارده به کار تیم و راه‌حل‌های پیشنهادی...'
    },
    {
      key: 'group_management' as keyof FormData,
      question: 'تجربه‌ای در مدیریت تیم دارید؟ چگونه؟',
      placeholder: 'تجربیات مدیریت تیم، روش‌های هدایت و انگیزه‌دهی به همکاران...'
    },
    {
      key: 'employment_reason' as keyof FormData,
      question: 'دلیل اصلی شما برای جستجوی شغل جدید چیست؟',
      placeholder: 'انگیزه‌ها و اهداف شما از تغییر شغل یا جستجوی شغل جدید...'
    },
    {
      key: 'goals_and_plans' as keyof FormData,
      question: 'اهداف و برنامه‌های آینده شما چیست؟',
      placeholder: 'اهداف کوتاه‌مدت و بلندمدت شغلی و شخصی خود را توضیح دهید...'
    },
    {
      key: 'customer_service' as keyof FormData,
      question: 'نظر شما درباره خدمات مشتری چیست؟',
      placeholder: 'اهمیت رضایت مشتری و روش‌های بهبود خدمات...'
    },
    {
      key: 'salary_choice' as keyof FormData,
      question: 'بین حقوق بالا و محیط کار مناسب کدام را انتخاب می‌کنید؟',
      placeholder: 'اولویت‌بندی شما بین جنبه‌های مختلف شغلی و توضیح انتخاب...'
    },
    {
      key: 'company_research' as keyof FormData,
      question: 'چه اطلاعاتی درباره شرکت ما جمع‌آوری کرده‌اید؟',
      placeholder: 'تحقیقات انجام شده درباره شرکت، محصولات، خدمات و فرهنگ سازمانی...'
    },
    {
      key: 'skill_opinion' as keyof FormData,
      question: 'مهم‌ترین مهارت برای موفقیت در کار چیست؟',
      placeholder: 'نظر شما درباره مهارت‌های ضروری و نحوه توسعه آنها...'
    },
    {
      key: 'career_goal' as keyof FormData,
      question: 'هدف نهایی شما در مسیر شغلی چیست؟',
      placeholder: 'چشم‌انداز و آرزوهای شغلی خود را در آینده توصیف کنید...'
    }
  ];

  const personalReflectionQuestions = [
    {
      key: 'worst_work_day' as keyof FormData,
      question: 'بدترین روز کاری زندگی‌تان را تعریف کنید',
      placeholder: 'شرح یک روز سخت کاری و نحوه مواجهه با آن...'
    },
    {
      key: 'best_work_day' as keyof FormData,
      question: 'بهترین روز کاری زندگی‌تان را تعریف کنید',
      placeholder: 'تجربه‌ای که احساس رضایت و موفقیت زیادی داشتید...'
    },
    {
      key: 'biggest_work_challenge' as keyof FormData,
      question: 'بزرگ‌ترین چالش کاری که با آن روبرو شدید چه بود؟',
      placeholder: 'چالش مهم کاری و راه‌حل‌هایی که برای آن پیدا کردید...'
    },
    {
      key: 'what_motivates' as keyof FormData,
      question: 'چه چیزی شما را در کار انگیزه می‌دهد؟',
      placeholder: 'عوامل انگیزه‌بخش در کار و زندگی شغلی...'
    },
    {
      key: 'personal_strengths' as keyof FormData,
      question: 'قوی‌ترین نقاط شخصیتی خود را بیان کنید',
      placeholder: 'نقاط قوت و ویژگی‌های مثبت که در کار به کارتان می‌آید...'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">سوالات تشریحی</h2>
        <p className="text-gray-400">لطفاً به سوالات زیر با جزئیات و صداقت پاسخ دهید</p>
      </div>

      {/* Main Open-Ended Questions */}
      <div className="space-y-6">
        {questions.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 p-6 rounded-lg border border-white/10"
          >
            <label className="block text-white font-medium mb-3">
              <span className="text-yellow-500 font-bold">{index + 1}.</span> {item.question}
            </label>
            <textarea
              value={formData[item.key] as string}
              onChange={(e) => onChange(item.key, e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-y min-h-[120px]"
              placeholder={item.placeholder}
            />
            <div className="mt-2 text-sm text-gray-400">
              تعداد کلمات: {(formData[item.key] as string).split(/\s+/).filter(word => word.length > 0).length}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Personal Reflection Section */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-6 rounded-lg border border-yellow-500/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          سوالات تأملی شخصی
        </h3>
        
        <div className="space-y-6">
          {personalReflectionQuestions.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (questions.length + index) * 0.1 }}
              className="bg-white/5 p-5 rounded-lg border border-white/10"
            >
              <label className="block text-white font-medium mb-3">
                <span className="text-yellow-400 font-bold">{questions.length + index + 1}.</span> {item.question}
              </label>
              <textarea
                value={formData[item.key] as string}
                onChange={(e) => onChange(item.key, e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-y min-h-[120px]"
                placeholder={item.placeholder}
              />
              <div className="mt-2 text-sm text-gray-400">
                تعداد کلمات: {(formData[item.key] as string).split(/\s+/).filter(word => word.length > 0).length}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white/5 p-6 rounded-lg">
        <h3 className="text-white font-semibold text-lg mb-6">اطلاعات تکمیلی</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">انگیزه نامه (Cover Letter)</label>
            <textarea
              value={formData.cover_letter}
              onChange={(e) => onChange('cover_letter', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-y"
              placeholder="در این بخش می‌توانید انگیزه‌ها، اهداف و دلایل علاقه‌مندی خود به این موقعیت شغلی را به صورت کامل بیان کنید..."
            />
            <div className="mt-2 text-sm text-gray-400">
              تعداد کلمات: {formData.cover_letter.split(/\s+/).filter(word => word.length > 0).length}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">نکات اضافی</label>
            <textarea
              value={formData.additional_notes}
              onChange={(e) => onChange('additional_notes', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-y"
              placeholder="هر گونه اطلاعات اضافی که فکر می‌کنید برای ارزیابی مفید باشد..."
            />
          </div>
        </div>
      </div>

      {/* Progress Info */}
      <div className="text-center text-gray-400">
        <p className="text-sm">
          پاسخ‌های تشریحی شما نشان‌دهنده شخصیت، نگرش و توانایی‌های شماست.
        </p>
        <p className="text-sm mt-1">
          لطفاً با دقت و صداقت پاسخ دهید.
        </p>
      </div>
    </motion.div>
  );
}