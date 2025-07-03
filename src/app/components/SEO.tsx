import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string[];
  noindex?: boolean;
  structuredData?: object;
}

export default function SEO({
  title,
  description,
  canonical = 'https://hiarchitect.ir',
  ogImage = '/images/Hi-logo.png',
  ogType = 'website',
  keywords = [],
  noindex = false,
  structuredData
}: SEOProps) {
  const fullTitle = title.includes('های آرشیتکت') ? title : `${title} | های آرشیتکت`;
  
  const defaultKeywords = [
    'معماری لاهیجان',
    'طراحی معماری گیلان',
    'معمار لاهیجان',
    'طراحی داخلی',
    'های آرشیتکت',
    'Hi Architect'
  ];
  
  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://hiarchitect.ir${ogImage}`} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="شرکت معماری های آرشیتکت" />
      <meta property="og:locale" content="fa_IR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://hiarchitect.ir${ogImage}`} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="شرکت معماری های آرشیتکت" />
      <meta name="publisher" content="شرکت معماری های آرشیتکت" />
      <meta name="language" content="fa" />
      <meta name="geo.region" content="IR-GIL" />
      <meta name="geo.placename" content="لاهیجان" />
      <meta name="ICBM" content="37.2092, 50.0017" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  );
}
