import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "شرکت معماری های آرشیتکت | طراحی و اجرای پروژه‌های معماری",
    template: "%s | های آرشیتکت"
  },
  description: "شرکت معماری و طراحی های آرشیتکت - ارائه خدمات تخصصی طراحی معماری، طراحی داخلی، نظارت و اجرای پروژه‌های تجاری، مسکونی و ویلایی در لاهیجان و گیلان",
  keywords: [
    // کلمات کلیدی اصلی
    "معماری لاهیجان",
    "طراحی معماری گیلان",
    "معمار لاهیجان",
    "آرشیتکت لاهیجان",
    "های آرشیتکت",
    "Hi Architect",
    
    // خدمات طراحی
    "طراحی داخلی لاهیجان",
    "دکوراسیون داخلی گیلان",
    "طراحی منظر لاهیجان",
    "نقشه کشی ساختمان",
    "طراحی نما ساختمان",
    "طراحی پلان ساختمان",
    
    // انواع پروژه‌ها
    "طراحی ویلا لاهیجان",
    "طراحی ویلا گیلان",
    "طراحی مسکونی لاهیجان",
    "طراحی آپارتمان گیلان",
    "طراحی تجاری لاهیجان",
    "طراحی مغازه گیلان",
    "طراحی رستوران",
    "طراحی کافه",
    "طراحی دفتر کار",
    "طراحی کلینیک",
    "طراحی سالن زیبایی",
    
    // خدمات تخصصی
    "نظارت بر اجرا",
    "مشاوره معماری",
    "ارزیابی ساختمان",
    "بازسازی ساختمان",
    "تغییر کاربری",
    "اخذ پروانه ساختمانی",
    
    // مناطق خدمات‌رسانی
    "معماری رشت",
    "طراحی داخلی رشت",
    "معماری آستارا",
    "طراحی بندر انزلی",
    "معماری صومعه سرا",
    "طراحی فومن",
    "معماری آستانه اشرفیه",
    "طراحی رودسر",
    
    // سبک‌های معماری
    "معماری مدرن",
    "معماری کلاسیک",
    "معماری مینیمال",
    "معماری سنتی",
    "معماری پایدار",
    "معماری سبز",
    "معماری اقلیمی",
    
    // کلمات مرتبط
    "شرکت معماری گیلان",
    "بهترین معمار لاهیجان",
    "استودیو معماری",
    "طراح داخلی حرفه‌ای",
    "معماری لوکس",
    "طراحی خلاقانه",
    "اجرای دقیق",
    "کیفیت بالا"
  ],
  authors: [{ name: "شرکت معماری های آرشیتکت" }],
  creator: "شرکت معماری های آرشیتکت",
  publisher: "شرکت معماری های آرشیتکت",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hiarchitect.ir'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://hiarchitect.ir',
    siteName: 'شرکت معماری های آرشیتکت',
    title: 'شرکت معماری های آرشیتکت | طراحی و اجرای پروژه‌های معماری',
    description: 'شرکت معماری و طراحی های آرشیتکت - ارائه خدمات تخصصی طراحی معماری، طراحی داخلی، نظارت و اجرای پروژه‌های تجاری، مسکونی و ویلایی در لاهیجان و گیلان',
    images: [
      {
        url: '/images/Hi-logo.png',
        width: 1200,
        height: 630,
        alt: 'شرکت معماری های آرشیتکت - لوگو',
      },
      {
        url: '/images/Hi-logo-icon.png',
        width: 400,
        height: 400,
        alt: 'آیکون شرکت معماری های آرشیتکت',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شرکت معماری های آرشیتکت | طراحی و اجرای پروژه‌های معماری',
    description: 'شرکت معماری و طراحی های آرشیتکت - ارائه خدمات تخصصی طراحی معماری، طراحی داخلی، نظارت و اجرای پروژه‌های تجاری، مسکونی و ویلایی در لاهیجان و گیلان',
    images: ['/images/Hi-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // اینجا کد Google Search Console رو اضافه کن
    // google: 'your-google-verification-code',
  },
  icons: {
    icon: '/images/Hi-logo-icon.png',
    shortcut: '/images/Hi-logo-icon.png',
    apple: '/images/Hi-logo-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://hiarchitect.ir/#organization",
        "name": "شرکت معماری های آرشیتکت",
        "alternateName": ["Hi Architect", "آرشیتکت لاهیجان", "معماری لاهیجان", "طراحی داخلی گیلان"],
        "url": "https://hiarchitect.ir",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hiarchitect.ir/images/Hi-logo-icon.png",
          "width": 400,
          "height": 400
        },
        "image": "https://hiarchitect.ir/images/Hi-logo-icon.png",
        "description": "شرکت معماری و طراحی های آرشیتکت - ارائه خدمات تخصصی طراحی معماری، طراحی داخلی، نظارت و اجرای پروژه‌های تجاری، مسکونی و ویلایی در لاهیجان و گیلان",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "لاهیجان",
          "addressRegion": "گیلان",
          "addressCountry": "IR"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": "Persian"
        },
        "sameAs": [
          "https://instagram.com/hi.architect.ir",
          "https://t.me/hiarchitect"
        ],
        "foundingDate": "2020",
        "numberOfEmployees": "5-10",
        "slogan": "طراحی با کیفیت، اجرا با دقت"
      },
      {
        "@type": "WebSite",
        "@id": "https://hiarchitect.ir/#website",
        "url": "https://hiarchitect.ir",
        "name": "شرکت معماری های آرشیتکت",
        "description": "شرکت معماری و طراحی های آرشیتکت - ارائه خدمات تخصصی طراحی معماری، طراحی داخلی، نظارت و اجرای پروژه‌های تجاری، مسکونی و ویلایی در لاهیجان و گیلان",
        "publisher": {
          "@id": "https://hiarchitect.ir/#organization"
        },
        "inLanguage": "fa-IR",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://hiarchitect.ir/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://hiarchitect.ir/#service",
        "name": "خدمات معماری های آرشیتکت",
        "description": "ارائه خدمات تخصصی معماری شامل طراحی معماری، طراحی داخلی، نقشه کشی، نظارت بر اجرا و مشاوره معماری",
        "provider": {
          "@id": "https://hiarchitect.ir/#organization"
        },
        "serviceType": [
          "طراحی معماری",
          "طراحی داخلی", 
          "دکوراسیون داخلی",
          "نقشه کشی ساختمان",
          "نظارت بر اجرا",
          "مشاوره معماری",
          "طراحی منظر",
          "طراحی نما ساختمان",
          "طراحی ویلا",
          "طراحی مسکونی",
          "طراحی آپارتمان",
          "طراحی مجتمع مسکونی",
          "طراحی فضاهای تجاری",
          "طراحی مغازه",
          "طراحی رستوران",
          "طراحی کافه",
          "طراحی دفتر کار",
          "طراحی کلینیک",
          "طراحی سالن زیبایی",
          "بازسازی ساختمان",
          "تغییر کاربری",
          "اخذ پروانه ساختمانی",
          "ارزیابی ساختمان",
          "طراحی سه بعدی",
          "رندرینگ معماری",
          "طراحی روشنایی",
          "طراحی سیستم‌های مکانیکی"
        ],
        "areaServed": [
          "لاهیجان",
          "گیلان", 
          "رشت",
          "آستارا",
          "بندر انزلی",
          "صومعه سرا",
          "فومن",
          "آستانه اشرفیه",
          "رودسر",
          "تالش",
          "ماسال",
          "شفت",
          "رودبار",
          "سیاهکل",
          "املش",
          "لنگرود",
          "خمام",
          "منطقه آزاد انزلی",
          "شمال ایران"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "خدمات معماری",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "طراحی معماری مسکونی",
                "description": "طراحی کامل واحدهای مسکونی شامل پلان، نما و جزئیات اجرایی"
              }
            },
            {
              "@type": "Offer", 
              "itemOffered": {
                "@type": "Service",
                "name": "طراحی معماری تجاری",
                "description": "طراحی فضاهای تجاری، مغازه، رستوران و مراکز خرید"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service", 
                "name": "طراحی ویلا",
                "description": "طراحی ویلاهای مدرن با توجه به محیط و آب و هوای گیلان"
              }
            }
          ]
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://hiarchitect.ir/#localbusiness",
        "name": "شرکت معماری های آرشیتکت",
        "image": "https://hiarchitect.ir/images/Hi-logo-icon.png",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "لاهیجان",
          "addressRegion": "گیلان",
          "addressCountry": "IR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 37.2092,
          "longitude": 50.0017
        },
        "url": "https://hiarchitect.ir",
        "telephone": "+98-xxx-xxx-xxxx",
        "priceRange": "متوسط تا بالا",
        "openingHours": [
          "Mo-Th 08:00-17:00",
          "Sa 08:00-14:00"
        ],
        "paymentAccepted": "Cash, Check, Credit Card",
        "currenciesAccepted": "IRR"
      }
    ]
  };

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <meta name="google-site-verification" content="your-verification-code" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        
        {/* اطلاعات اضافی برای SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        <meta name="bingbot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        
        {/* اطلاعات کسب و کار */}
        <meta name="geo.region" content="IR-GIL" />
        <meta name="geo.placename" content="لاهیجان" />
        <meta name="geo.position" content="37.2092;50.0017" />
        <meta name="ICBM" content="37.2092, 50.0017" />
        
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon - ساده و مؤثر */}
        <link rel="icon" href="/images/Hi-logo-icon.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/images/Hi-logo-icon.png" type="image/png" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/images/Hi-logo-icon.png" />
        
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="های آرشیتکت" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
