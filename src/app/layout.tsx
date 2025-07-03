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
    "معماری لاهیجان",
    "طراحی معماری گیلان", 
    "معمار لاهیجان",
    "طراحی داخلی لاهیجان",
    "پروژه های معماری",
    "طراحی ویلا",
    "طراحی مسکونی",
    "طراحی تجاری",
    "نقشه کشی ساختمان",
    "معماری مدرن",
    "های آرشیتکت",
    "Hi Architect"
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
        alt: 'شرکت معماری های آرشیتکت',
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
        "alternateName": "Hi Architect",
        "url": "https://hiarchitect.ir",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hiarchitect.ir/images/Hi-logo.png",
          "width": 400,
          "height": 200
        },
        "image": "https://hiarchitect.ir/images/Hi-logo.png",
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
          "نقشه کشی ساختمان",
          "نظارت بر اجرا",
          "مشاوره معماری",
          "طراحی منظر",
          "طراحی ویلا",
          "طراحی مجتمع مسکونی",
          "طراحی فضاهای تجاری"
        ],
        "areaServed": [
          "لاهیجان",
          "گیلان", 
          "رشت",
          "آستارا",
          "بندر انزلی",
          "صومعه سرا",
          "فومن"
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
        "image": "https://hiarchitect.ir/images/Hi-logo.png",
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
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="manifest" href="/manifest.json" />
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
