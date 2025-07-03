import { SEO_CONSTANTS } from '../lib/seo-constants';

export function generateHomepageSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SEO_CONSTANTS.SITE_URL}/#organization`,
        "name": SEO_CONSTANTS.COMPANY_FULL_NAME,
        "alternateName": [
          SEO_CONSTANTS.COMPANY_NAME,
          "آرشیتکت لاهیجان",
          "معماری لاهیجان",
          "طراحی داخلی گیلان"
        ],
        "url": SEO_CONSTANTS.SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${SEO_CONSTANTS.SITE_URL}/images/Hi-logo.png`,
          "width": 400,
          "height": 200
        },
        "image": `${SEO_CONSTANTS.SITE_URL}/images/Hi-logo.png`,
        "description": SEO_CONSTANTS.DEFAULT_DESCRIPTION,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": SEO_CONSTANTS.CONTACT_INFO.ADDRESS.LOCALITY,
          "addressRegion": SEO_CONSTANTS.CONTACT_INFO.ADDRESS.REGION,
          "addressCountry": SEO_CONSTANTS.CONTACT_INFO.ADDRESS.COUNTRY
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": SEO_CONSTANTS.CONTACT_INFO.ADDRESS.COORDINATES.LATITUDE,
          "longitude": SEO_CONSTANTS.CONTACT_INFO.ADDRESS.COORDINATES.LONGITUDE
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": "Persian",
          "telephone": SEO_CONSTANTS.CONTACT_INFO.PHONE
        },
        "sameAs": [
          SEO_CONSTANTS.SOCIAL_MEDIA.INSTAGRAM,
          SEO_CONSTANTS.SOCIAL_MEDIA.TELEGRAM
        ],
        "foundingDate": SEO_CONSTANTS.BUSINESS_INFO.FOUNDING_DATE,
        "numberOfEmployees": SEO_CONSTANTS.BUSINESS_INFO.EMPLOYEES,
        "slogan": SEO_CONSTANTS.BUSINESS_INFO.SLOGAN,
        "knowsAbout": [
          ...SEO_CONSTANTS.KEYWORDS.PRIMARY,
          ...SEO_CONSTANTS.KEYWORDS.SERVICES,
          ...SEO_CONSTANTS.KEYWORDS.PROJECTS
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "خدمات معماری و طراحی",
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
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "طراحی داخلی",
                "description": "طراحی و دکوراسیون فضاهای داخلی مسکونی و تجاری"
              }
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": `${SEO_CONSTANTS.SITE_URL}/#website`,
        "url": SEO_CONSTANTS.SITE_URL,
        "name": SEO_CONSTANTS.SITE_NAME,
        "description": SEO_CONSTANTS.DEFAULT_DESCRIPTION,
        "publisher": {
          "@id": `${SEO_CONSTANTS.SITE_URL}/#organization`
        },
        "inLanguage": "fa-IR",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${SEO_CONSTANTS.SITE_URL}/?s={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SEO_CONSTANTS.SITE_URL}/#localbusiness`,
        "name": SEO_CONSTANTS.COMPANY_FULL_NAME,
        "image": `${SEO_CONSTANTS.SITE_URL}/images/Hi-logo.png`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": SEO_CONSTANTS.CONTACT_INFO.ADDRESS.LOCALITY,
          "addressRegion": SEO_CONSTANTS.CONTACT_INFO.ADDRESS.REGION,
          "addressCountry": SEO_CONSTANTS.CONTACT_INFO.ADDRESS.COUNTRY
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": SEO_CONSTANTS.CONTACT_INFO.ADDRESS.COORDINATES.LATITUDE,
          "longitude": SEO_CONSTANTS.CONTACT_INFO.ADDRESS.COORDINATES.LONGITUDE
        },
        "url": SEO_CONSTANTS.SITE_URL,
        "telephone": SEO_CONSTANTS.CONTACT_INFO.PHONE,
        "priceRange": SEO_CONSTANTS.BUSINESS_INFO.PRICE_RANGE,
        "openingHours": SEO_CONSTANTS.BUSINESS_INFO.OPENING_HOURS,
        "paymentAccepted": SEO_CONSTANTS.BUSINESS_INFO.PAYMENT_ACCEPTED,
        "currenciesAccepted": SEO_CONSTANTS.BUSINESS_INFO.CURRENCIES_ACCEPTED
      }
    ]
  };
}

export default function HomepageSchema() {
  const schema = generateHomepageSchema();
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}
