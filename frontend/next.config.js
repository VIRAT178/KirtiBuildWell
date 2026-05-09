/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const path = require('path')
const fs = require('fs')

module.exports = (phase) => {
  const nextConfig = {
    compress: true,
    poweredByHeader: false,
    eslint: {
      ignoreDuringBuilds: true,
    },
    images: {
      formats: ['image/avif', 'image/webp'],
      minimumCacheTTL: 60,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'cdn.coverr.co',
        },
        {
          protocol: 'https',
          hostname: 'www.google.com',
        },
      ],
    },
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ],
        },
      ]
    },
  }

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    const tempDistDir = path.resolve(__dirname, '../../../../../../temp/kbt-next')
    const relativeTempDistDir = path.relative(__dirname, tempDistDir)
    fs.mkdirSync(tempDistDir, { recursive: true })

    nextConfig.distDir = relativeTempDistDir
  }

  return nextConfig
}
