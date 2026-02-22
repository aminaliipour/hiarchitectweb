import { motion } from 'framer-motion';
import { FormData as RegistrationFormData } from '../types';

interface Props {
  formData: RegistrationFormData;
  onChange: (field: keyof RegistrationFormData, value: any) => void;
}

export default function PersonalInfoStep({ formData, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
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
            onChange={(e) => onChange('full_name', e.target.value)}
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
            onChange={(e) => onChange('birth_date', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">کد ملی *</label>
          <input
            type="text"
            value={formData.national_id}
            onChange={(e) => onChange('national_id', e.target.value)}
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
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="021-12345678"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">تلفن همراه *</label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => onChange('mobile', e.target.value)}
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
            onChange={(e) => onChange('email', e.target.value)}
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
          onChange={(e) => onChange('address', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
          placeholder="آدرس کامل محل سکونت خود را وارد کنید"
          required
        />
      </div>
    </motion.div>
  );
}