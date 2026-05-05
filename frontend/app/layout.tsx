import './globals.css'
import React from 'react'
import { generateMetadata } from '../lib/seo'
{/* <meta name="google-site-verification" content="Nvb3V311UWYF8omXNC2eZysnuWFCZ3BgvgvVKX8Rlro" /> */}
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KirtiBuildWell | Luxury Real Estate in Lucknow",
  description: "Premium real estate developer in Lucknow...",
  verification: {
    google: "Nvb3V311UWYF8omXNC2eZysnuWFCZ3BgvgvVKX8Rlro",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Core Web Vitals optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0b0b0c" />
        
        {/* SEO meta tags */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Lucknow" />
        <meta name="geo.position" content="26.8467;80.9467" />
        <meta name="ICBM" content="26.8467,80.9467" />
        
        {/* Local SEO */}
        <meta name="business" content="KirtiBuildWell" />
        <meta name="category" content="Real Estate" />
        <meta name="service" content="Property Development" />
      </head>
      <body className="min-h-screen bg-lux-darker font-sans antialiased text-accent-white">{children}</body>
    </html>
  )
}
