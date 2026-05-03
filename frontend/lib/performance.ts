// Core Web Vitals optimization utilities
export function optimizeImages() {
  return {
    // Image optimization settings
    quality: 75,
    format: 'webp',
    sizes: {
      small: '640px',
      medium: '1024px',
      large: '1920px'
    },
    // Lazy loading settings
    loading: 'lazy' as const,
    decoding: 'async' as const,
    // Priority loading for above-the-fold images
    priority: false,
    // Blur placeholder for better UX
    placeholder: 'blur' as const,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A',
  }
}

export function optimizeFonts() {
  return {
    // Font optimization settings
    display: 'swap' as const,
    preload: true,
    // Font subsets
    subsets: ['latin'],
    // Variable fonts for better performance
    variable: true,
    // Font loading strategies
    fallback: ['system-ui', 'sans-serif'],
  }
}

export function optimizeLoading() {
  return {
    // Resource hints
    preconnect: [
      'https://images.unsplash.com',
      'https://fonts.gstatic.com',
      'https://www.googletagmanager.com',
    ],
    dnsPrefetch: [
      'https://fonts.googleapis.com',
      'https://api.unsplash.com',
    ],
    preload: [
      '/fonts/inter-var.woff2',
      '/fonts/playfair-display-var.woff2',
      '/images/hero-bg.webp',
    ],
    // Critical CSS inlining
    criticalCSS: true,
    // Non-critical CSS loading
    deferCSS: true,
  }
}

export function optimizeSEO() {
  return {
    // Meta tags for performance
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
    themeColor: '#0b0b0c',
    // Preload critical resources
    preloadResources: [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { href: '/fonts/playfair-display-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
    ],
    // DNS prefetch for external resources
    dnsPrefetch: [
      'https://images.unsplash.com',
      'https://fonts.googleapis.com',
      'https://www.googletagmanager.com',
    ],
    // Preconnect for critical resources
    preconnect: [
      'https://images.unsplash.com',
      'https://fonts.gstatic.com',
    ],
  }
}

export function generateCriticalCSS() {
  return `
    /* Critical CSS for above-the-fold content */
    .hero-section {
      position: relative;
      min-height: 60vh;
      overflow: hidden;
    }
    
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.95));
    }
    
    .hero-content {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      padding: 2rem;
    }
    
    .lux-card {
      background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.12));
      border: 1px solid rgba(212,175,55,0.12);
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      border-radius: 12px;
    }
    
    .gold-gradient-text {
      background: linear-gradient(135deg, #d4af37 0%, #e5c158 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* Prevent layout shift */
    .aspect-ratio-container {
      aspect-ratio: 16/9;
      overflow: hidden;
    }
    
    /* Smooth animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `
}

export function optimizeBundleSize() {
  return {
    // Tree shaking
    unusedExports: true,
    // Code splitting
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    // Minification
    minimize: true,
    // Compression
    compression: true,
  }
}

export function generateServiceWorker() {
  return `
    // Service Worker for caching and offline support
    const CACHE_NAME = 'kirtibuildwell-v1';
    const urlsToCache = [
      '/',
      '/projects',
      '/about',
      '/contact',
      '/fonts/inter-var.woff2',
      '/fonts/playfair-display-var.woff2',
      '/images/hero-bg.webp',
    ];

    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => cache.addAll(urlsToCache))
      );
    });

    self.addEventListener('fetch', event => {
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            // Return cached version or fetch from network
            return response || fetch(event.request);
          })
      );
    });
  `
}

export function generateWebVitalsConfig() {
  return {
    // Core Web Vitals thresholds
    LCP: { target: 2500, poor: 4000 }, // Largest Contentful Paint
    FID: { target: 100, poor: 300 },  // First Input Delay
    CLS: { target: 0.1, poor: 0.25 }, // Cumulative Layout Shift
    TTFB: { target: 600, poor: 1000 }, // Time to First Byte
    
    // Optimization strategies
    strategies: {
      LCP: [
        'Optimize images',
        'Preload critical resources',
        'Eliminate render-blocking resources',
        'Use modern image formats',
      ],
      FID: [
        'Minimize main thread work',
        'Reduce JavaScript execution time',
        'Break up long tasks',
      ],
      CLS: [
        'Set dimensions on images and videos',
        'Reserve space for dynamic content',
        'Avoid inserting content above existing content',
      ],
      TTFB: [
        'Use CDN',
        'Optimize server response time',
        'Enable HTTP/2',
        'Implement caching',
      ],
    },
  }
}

export function generateImageOptimizationConfig() {
  return {
    // Next.js Image optimization
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    quality: 75,
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  }
}

export function generatePerformanceMonitoring() {
  return {
    // Web Vitals monitoring
    webVitals: {
      enabled: true,
      reportTo: '/api/analytics/web-vitals',
      thresholds: {
        LCP: 2500,
        FID: 100,
        CLS: 0.1,
        TTFB: 600,
      },
    },
    // Performance monitoring
    performance: {
      enabled: true,
      reportTo: '/api/analytics/performance',
    },
    // Error monitoring
    errors: {
      enabled: true,
      reportTo: '/api/analytics/errors',
    },
  }
}
