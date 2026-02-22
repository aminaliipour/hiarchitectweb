"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Instagram, Phone, Mail, MapPin, MessageCircle, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dynamic import for map component to avoid SSR issues
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-900 rounded-xl flex items-center justify-center">
      <div className="text-yellow-500">در حال بارگذاری نقشه...</div>
    </div>
  )
})

export default function Contact() {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      projectType: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Use real email endpoint now that Gmail is configured
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          projectType: '',
          message: ''
        });
        // Reset form visibility after 3 seconds
        setTimeout(() => {
          setFormVisible(false);
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };;

  return (
    <section id="contact" className="relative bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-4xl font-bold text-white"
          >
            با ما در تماس باشید
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-gray-300"
          >
            آماده تغییر فضای خود هستید؟ با تیم ما ارتباط برقرار کنید تا درباره چشم‌اندازتان و چگونگی به واقعیت پیوستن آن صحبت کنیم.
          </motion.p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[500px] w-full rounded-xl overflow-hidden border border-gray-800"
          >
            <div className="relative h-full w-full">
              <MapComponent />
            </div>
          </motion.div>

          {/* Contact Form - Holographic Overlay */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 flex flex-wrap gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://instagram.com/hi.architect"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 px-4 py-2 text-sm font-medium text-white"
              >
                <Instagram className="h-5 w-5" />
                @hi.architect
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:+989111381772"
                className="flex items-center gap-2 rounded-full border border-gray-800 bg-black px-4 py-2 text-sm font-medium text-white hover:border-yellow-500/50"
              >
                <Phone className="h-5 w-5 text-yellow-500" />
                <span dir="ltr">+98 911 138 1772</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://t.me/HiArchitect_Admin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-gray-800 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <MessageCircle className="h-5 w-5" />
                تلگرام
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:pezhmanalavi0@gmail.com"
                className="flex items-center gap-2 rounded-full border border-gray-800 bg-black px-4 py-2 text-sm font-medium text-white hover:border-yellow-500/50"
              >
                <Mail className="h-5 w-5 text-yellow-500" />
                info@hiarchitect.com
              </motion.a>
            </div>

            <div className="relative">
              {!formVisible ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-black/60 p-8 text-center backdrop-blur-sm"
                >
                  <h3 className="mb-4 text-2xl font-bold text-white">آماده شروع پروژه خود هستید؟</h3>
                  <p className="mb-6 text-gray-300">
                    درباره چشم‌انداز خود به ما بگویید و بیایید با هم چیزی خارق‌العاده خلق کنیم.
                  </p>
                  <Button onClick={() => setFormVisible(true)} className="bg-yellow-500 text-black hover:bg-yellow-400">
                    با ما در تماس باشید
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-gray-800 bg-black/60 p-8 backdrop-blur-sm"
                  style={{
                    boxShadow: "0 0 30px rgba(255, 204, 0, 0.1)",
                  }}
                >
                  <h3 className="mb-6 text-2xl font-bold text-white">با ما تماس بگیرید</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitStatus === 'success' && (
                      <div className="p-4 bg-green-900/50 border border-green-500/50 rounded-lg">
                        <p className="text-green-400 text-center font-medium">
                          ✅ پیام شما با موفقیت ارسال شد! به زودی با شما تماس خواهیم گرفت.
                        </p>
                      </div>
                    )}
                    
                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-center font-medium">
                          ❌ خطا در ارسال پیام. لطفاً دوباره تلاش کنید.
                        </p>
                      </div>
                    )}
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          نام *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="نام شما"
                          required
                          disabled={isSubmitting}
                          className="border-gray-800 bg-black/50 text-white backdrop-blur-sm focus:border-yellow-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          ایمیل *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="ایمیل شما"
                          required
                          disabled={isSubmitting}
                          className="border-gray-800 bg-black/50 text-white backdrop-blur-sm focus:border-yellow-500/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-type" className="text-white">
                        نوع پروژه
                      </Label>
                      <Select value={formData.projectType} onValueChange={handleSelectChange} disabled={isSubmitting}>
                        <SelectTrigger className="border-gray-800 bg-black/50 text-white backdrop-blur-sm focus:border-yellow-500/50">
                          <SelectValue placeholder="نوع پروژه را انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-800 bg-black/90 text-white backdrop-blur-md">
                          <SelectItem value="residential">مسکونی</SelectItem>
                          <SelectItem value="commercial">تجاری</SelectItem>
                          <SelectItem value="renovation">بازسازی</SelectItem>
                          <SelectItem value="interior">طراحی داخلی</SelectItem>
                          <SelectItem value="other">سایر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">
                        پیام *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="درباره پروژه خود به ما بگویید"
                        required
                        disabled={isSubmitting}
                        className="min-h-[120px] border-gray-800 bg-black/50 text-white backdrop-blur-sm focus:border-yellow-500/50"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                      className="w-full bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          در حال ارسال...
                        </div>
                      ) : (
                        'ارسال پیام'
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}