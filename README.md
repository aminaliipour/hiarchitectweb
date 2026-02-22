# HiArchitect - معماری و طراحی

سایت رسمی مجموعه معماری HiArchitect - ارائه خدمات طراحی معماری، طراحی داخلی و مشاوره ساختمان.

## 🏗️ درباره پروژه

HiArchitect یک پلتفرم جامع برای:
- 🏢 نمایش پروژه‌های معماری
- 👥 مدیریت اعضا و مشتریان
- 📝 سیستم ثبت‌نام و درخواست پروژه
- 🗺️ نمایش موقعیت پروژه‌ها روی نقشه
- 📊 تولید گزارش‌ها و آمار
- 🖼️ گالری تصاویر پروژه‌ها

## 🚀 تکنولوژی‌ها

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **Authentication:** JWT
- **File Upload:** Multer
- **Maps:** Leaflet
- **PDF Generation:** React-PDF
- **Deployment:** PM2, Nginx

## 🛠️ راه‌اندازی محلی

```bash
# کلون کردن پروژه
git clone https://github.com/aminaliipour/hiarchitectweb.git
cd hiarchitectweb

# نصب dependencies
npm install

# تنظیم متغیرهای محیط
cp .env.example .env.local
# ویرایش .env.local و تنظیم اطلاعات پایگاه داده

# اجرای پروژه در حالت development
npm run dev
```

برای دسترسی به پروژه: [http://localhost:3000](http://localhost:3000)

## 📦 اسکریپت‌های NPM

```bash
npm run dev      # اجرای development server
npm run build    # ساخت نسخه production
npm start        # اجرای نسخه production
npm run lint     # بررسی کد با ESLint
```

## 🚀 Deploy کردن

### روی VPS:

```bash
# کپی فایل‌ها روی سرور
git pull origin main

# اجرای اسکریپت deploy
chmod +x deploy-vps.sh
./deploy-vps.sh
```

### با PM2:

```bash
# شروع با PM2
pm2 start ecosystem.config.js --env production

# مونیتورینگ
pm2 logs hiarchitect
pm2 monit
```

## 🗂️ ساختار پروژه

```
src/
├── app/                 # Next.js App Router
│   ├── admin/          # پنل مدیریت
│   ├── api/            # API endpoints
│   ├── login/          # صفحات ورود
│   └── member/         # پنل اعضا
├── components/         # کامپوننت‌های React
├── lib/               # توابع کمکی
└── types/             # TypeScript types

public/                # فایل‌های استاتیک
database/              # اسکریپت‌های پایگاه داده
scripts/               # اسکریپت‌های کمکی
```

## 🔧 تنظیمات

### پایگاه داده:
- اجرای اسکریپت‌های موجود در فولدر `database/`
- تنظیم connection string در `.env.local`

### Authentication:
- تنظیم JWT_SECRET در متغیرهای محیط
- پیکربندی admin user اولیه

### File Uploads:
- تنظیم مسیر آپلود فایل‌ها
- پیکربندی محدودیت‌های اندازه فایل

## 🔍 مونیتورینگ و عیب‌یابی

```bash
# چک کردن وضعیت سرور
./check-production-status.sh

# عیب‌یابی مشکلات اتصال
./diagnose-connection-issue.sh

# فیکس مشکلات رایج
./fix-connection-refused.sh
```

## 📱 فیچرها

- ✅ طراحی Responsive
- ✅ پنل مدیریت کامل
- ✅ سیستم احراز هویت
- ✅ آپلود و مدیریت تصاویر
- ✅ نقشه‌های تعاملی
- ✅ تولید PDF
- ✅ سیستم ثبت‌نام
- ✅ آنالیتیکس
- ✅ پشتیبانی از زبان فارسی

## 🤝 مشارکت

برای مشارکت در پروژه:
1. Fork کنید
2. شاخه جدید ایجاد کنید (`git checkout -b feature/new-feature`)
3. تغییرات را commit کنید (`git commit -am 'Add new feature'`)
4. Push کنید (`git push origin feature/new-feature`)
5. Pull Request ایجاد کنید

## 📄 لایسنس

این پروژه تحت لایسنس MIT است.

## 📞 پشتیبانی

برای پشتیبانی و سوالات:
- 🌐 وبسایت: [hiarchitect.ir](https://hiarchitect.ir)
- 📧 ایمیل: info@hiarchitect.ir

---

ساخته شده با ❤️ توسط تیم HiArchitect
