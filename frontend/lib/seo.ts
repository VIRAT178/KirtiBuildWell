import { Metadata } from 'next'

// SEO Constants
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kirtibuildwell.com'
const CITY = 'Lucknow'
const COMPANY_NAME = 'KirtiBuildWell'
const COMPANY_DESCRIPTION = 'Premium real estate developer in Lucknow offering luxury flats, apartments, and residential projects with modern amenities and excellent connectivity.'

// SEO Keywords
const LOCAL_KEYWORDS = [
  `flats in ${CITY}`,
  `apartments in ${CITY}`,
  `real estate projects in ${CITY}`,
  `luxury apartments ${CITY}`,
  `residential projects ${CITY}`,
  `property in ${CITY}`,
  `homes for sale ${CITY}`,
  `${CITY} real estate`,
  `buy flats ${CITY}`,
  `premium apartments ${CITY}`
]

const SERVICE_KEYWORDS = [
  'real estate development',
  'luxury residential projects',
  'premium apartments',
  'modern amenities',
  'property investment',
  'home buying',
  'real estate consultancy',
  'property development'
]

// Generate dynamic metadata
export function generateMetadata(options: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
}): Metadata {
  const {
    title = COMPANY_NAME,
    description = COMPANY_DESCRIPTION,
    keywords = [],
    image = `${SITE_URL}/images/og-image.jpg`,
    url = SITE_URL,
    type = 'website'
  } = options

  const allKeywords = [...keywords, ...LOCAL_KEYWORDS, ...SERVICE_KEYWORDS].join(', ')

  return {
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: COMPANY_NAME }],
    creator: COMPANY_NAME,
    publisher: COMPANY_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: COMPANY_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@kirtibuildwell',
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
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },
  }
}

// Generate structured data for real estate
export function generateRealEstateStructuredData(project: {
  name: string
  description: string
  price?: string
  address: string
  image: string
  url: string
  propertyType: 'Apartment' | 'Flat' | 'Villa' | 'Commercial'
  numberOfBedrooms?: number
  numberOfBathrooms?: number
  area?: string
  availability?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.name,
    description: project.description,
    image: project.image,
    url: `${SITE_URL}${project.url}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: CITY,
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
      streetAddress: project.address,
    },
    numberOfBedrooms: project.numberOfBedrooms,
    numberOfBathrooms: project.numberOfBathrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: project.area,
      unitText: 'sq ft',
    },
    offers: project.price ? {
      '@type': 'Offer',
      price: project.price,
      priceCurrency: 'INR',
      availability: project.availability || 'InStock',
    } : undefined,
    propertyType: project.propertyType,
    datePosted: new Date().toISOString(),
    provider: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: CITY,
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'IN',
        streetAddress: 'Meera Complex, 12, Pahad Nagar Tekariya, Selhu Mau',
      },
      telephone: '+91-8881115002',
      email: 'info@kirtibuildwell.com',
    },
  }
}

// Generate organization structured data
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_NAME,
    description: COMPANY_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/images/og-image.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: CITY,
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
      streetAddress: 'Meera Complex, 12, Pahad Nagar Tekariya, Selhu Mau',
      postalCode: '226303',
    },
    telephone: '+91-8881115002',
    email: 'info@kirtibuildwell.com',
    sameAs: [
      'https://www.facebook.com/kirtibuildwell',
      'https://www.instagram.com/kirtibuildwell',
      'https://www.linkedin.com/company/kirtibuildwell',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-8881115002',
      contactType: 'sales',
      availableLanguage: ['English', 'Hindi'],
    },
  }
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{
  name: string
  url: string
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.url}`,
    })),
  }
}

// Generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{
  question: string
  answer: string
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Local SEO helpers
export function generateLocalBusinessStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY_NAME,
    description: COMPANY_DESCRIPTION,
    url: SITE_URL,
    telephone: '+91-8881115002',
    address: {
      '@type': 'PostalAddress',
      addressLocality: CITY,
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
      streetAddress: 'Meera Complex, 12, Pahad Nagar Tekariya, Selhu Mau',
      postalCode: '226303',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.8467,
      longitude: 80.9467,
    },
    openingHours: 'Mo-Sa 10:00-19:00',
    priceRange: '$$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
    currenciesAccepted: 'INR',
    servesCuisine: 'Real Estate',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  }
}

// Image optimization utilities
export function generateOptimizedImageProps(src: string, alt: string, priority: boolean = false) {
  return {
    src,
    alt,
    priority,
    fill: true,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    style: {
      objectFit: 'cover',
    },
  }
}

// Core Web Vitals optimization
export function generatePerformanceHints() {
  return {
    preload: [
      '/fonts/inter-var.woff2',
      '/fonts/playfair-display-var.woff2',
    ],
    dnsPrefetch: [
      'https://images.unsplash.com',
      'https://fonts.googleapis.com',
      'https://www.googletagmanager.com',
    ],
    preconnect: [
      'https://images.unsplash.com',
      'https://fonts.gstatic.com',
    ],
  }
}

export { SITE_URL, CITY, COMPANY_NAME, COMPANY_DESCRIPTION, LOCAL_KEYWORDS, SERVICE_KEYWORDS }
