'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    position: '',
    national_code: '',
    phone: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setMessage(''); // Clear message when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation - only required fields
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.national_code.trim()) {
      setMessage('نام، نام خانوادگی و کد ملی الزامی است');
      return;
    }

    if (!/^\d{10}$/.test(formData.national_code)) {
      setMessage('کد ملی باید 10 رقم باشد');
      return;
    }

    // Validate phone only if provided
    if (formData.phone.trim() && !/^09\d{9}$/.test(formData.phone)) {
      setMessage('شماره تماس باید با 09 شروع شده و 11 رقم باشد');
      return;
    }

    // Validate email only if provided
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setMessage('فرمت ایمیل صحیح نیست');
        return;
      }
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          position: '',
          national_code: '',
          phone: '',
          email: ''
        });
        
        // Redirect to members list after 2 seconds
        setTimeout(() => {
          router.push('/admin/members');
        }, 2000);
      } else {
        setMessage(data.error || 'خطا در افزودن عضو');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      setMessage('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            بازگشت
          </button>
          <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">افزودن عضو جدید</h1>
          <p className="text-gray-400">اطلاعات عضو جدید را وارد کنید</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('موفقیت') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-900 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نام *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  placeholder="نام را وارد کنید"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نام خانوادگی *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  placeholder="نام خانوادگی را وارد کنید"
                  required
                />
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                سمت
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                placeholder="سمت را وارد کنید (اختیاری)"
              />
            </div>

            {/* National Code */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                کد ملی *
              </label>
              <input
                type="text"
                name="national_code"
                value={formData.national_code}
                onChange={handleInputChange}
                maxLength={10}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                placeholder="کد ملی 10 رقمی"
                required
              />
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  شماره تماس
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength={11}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  placeholder="09123456789 (اختیاری)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ایمیل
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  placeholder="example@hiarchitect.ir (اختیاری)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    افزودن عضو
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
