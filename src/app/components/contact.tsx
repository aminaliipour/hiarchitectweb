"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Instagram, Phone, Mail, MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Contact() {
  const [formVisible, setFormVisible] = useState(false)
  const [mapExpanded, setMapExpanded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  const handleMapClick = () => {
    setMapExpanded(!mapExpanded)
  }

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
          {/* نقشه سه‌بعدی تعاملی */}
          <motion.div
            className="relative overflow-hidden rounded-xl border border-gray-800"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              ref={mapRef}
              className="relative min-h-[500px] w-full cursor-pointer transition-all duration-500"
              onClick={handleMapClick}
            >
              <div className="absolute inset-0">
                {/* جای‌نگه‌دار نقشه سه‌بعدی با افکت پرسپکتیو */}
                <div className="h-full w-full bg-[url('/images/Lahijan.png')] bg-cover bg-center transition-transform duration-1000 hover:scale-210"></div>

                {/* روکش نقشه */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>

                {/* پین */}
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    duration: 1.5,
                  }}
                  className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
                >
                  <div className="flex flex-col items-center">
                    <MapPin className="h-10 w-10 text-yellow-500" />
                    <div className="mt-2 rounded-lg bg-black/70 px-3 py-1 text-sm text-white backdrop-blur-sm">
                    دفتر های آرشیتکت
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="absolute bottom-4 right-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black"
                >
                  مشاهده نقشه بزرگ‌تر
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* فرم تماس - روکش هولوگرافیک */}
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
                href="mailto:info@hiarchitect.com"
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
                  <form className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          نام
                        </Label>
                        <Input
                          id="name"
                          placeholder="نام شما"
                          className="border-gray-800 bg-black/50 text-white backdrop-blur-sm focus:border-yellow-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          ایمیل
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="ایمیل شما"
                          className="border-gray-800 bg-black/50 text-white backdrop-blur-sm focus:border-yellow-500/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-type" className="text-white">
                        نوع پروژه
                      </Label>
                      <Select>
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
                        پیام
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="درباره پروژه خود به ما بگویید"
                        className="min-h-[120px] border-gray-800 bg-black/50 text-white backdrop-blur-sm focus:border-yellow-500/50"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-yellow-500 text-black hover:bg-yellow-400">
                      ارسال پیام
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