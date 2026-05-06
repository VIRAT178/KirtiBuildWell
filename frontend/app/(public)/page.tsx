'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import PropertyCard from '../../components/PropertyCard'
import type { Property } from '../../data/properties'
import { getApiBaseUrl } from '../../lib/api'
import { generateRealEstateStructuredData, generateOrganizationStructuredData, generateLocalBusinessStructuredData } from '../../lib/seo'

type ProjectRecord = {
  _id: string
  title: string
  location: string
  price: number
  priceLabel?: string
  excerpt?: string
  description: string
  images: string[]
  amenities: string[]
}

function formatPriceLabel(priceCr: number) {
  if (!Number.isFinite(priceCr) || priceCr <= 0) return '₹0 Cr'
  return `₹${Number.isInteger(priceCr) ? priceCr : priceCr} Cr`
}

function mapProject(project: ProjectRecord) {
  const priceCr = Number(project.price) || 0
  return {
    id: project._id,
    title: project.title,
    location: project.location,
    price: project.priceLabel?.trim() || formatPriceLabel(priceCr),
    priceCr,
    images: project.images ?? [],
    excerpt: project.excerpt?.trim() || project.description.slice(0, 140),
    description: project.description,
    amenities: project.amenities ?? []
  }
}

const testimonials = [
  {
    quote: 'Their stack feels closer to a family office than a brokerage — precise, calm, and relentless on detail.',
    name: 'Aditi R.',
    role: 'Founder, Mumbai'
  },
  {
    quote: 'We closed a duplex off-market in ten days. The dashboard for my team’s pipeline is a welcome surprise.',
    name: 'Vikram S.',
    role: 'CFO, BKC'
  },
  {
    quote: 'Beautiful collateral, transparent diligence room, and a concierge team that actually picks up.',
    name: 'Neha K.',
    role: 'Designer, Alibaug'
  }
]

export default function HomePage() {
  const [projects, setProjects] = useState<Property[]>([])

  useEffect(() => {
    let active = true

    async function loadProjects() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/properties`, { cache: 'no-store' })
        if (!response.ok) throw new Error('Failed to load projects')
        const payload = (await response.json()) as { success?: boolean; data?: ProjectRecord[] }
        const nextProjects = Array.isArray(payload.data) ? payload.data.map(mapProject) : []
        if (active) {
          setProjects(nextProjects)
        }
      } catch {
        if (active) {
          setProjects([])
        }
      }
    }

    void loadProjects()

    return () => {
      active = false
    }
  }, [])

  const featured = projects.slice(0, 3)

  // Generate structured data for SEO
  const organizationData = generateOrganizationStructuredData()
  const localBusinessData = generateLocalBusinessStructuredData()
  
  // Generate structured data for featured properties
  const propertiesData = featured.map(property => 
    generateRealEstateStructuredData({
      name: property.title,
      description: property.description,
      price: property.price,
      address: property.location,
      image: property.images[0],
      url: `/projects/${property.id}`,
      propertyType: property.propertyType || 'Apartment',
      numberOfBedrooms: property.bedrooms || 3,
      area: property.area || '2000',
      availability: property.availability,
    })
  )
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
      {propertiesData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      
      {/* Hero */}
      <section className="relative -mt-[72px] min-h-[92vh] overflow-hidden pt-[72px]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 scale-105 animate-kenburns bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')] bg-cover bg-center"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-overlay"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          >
            <source
              src="https://cdn.coverr.co/videos/coverr-modern-living-room-in-a-luxury-apartment-4867/1080p.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-lux-darker" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.12),_transparent_55%)]" />
        </div>

        <div className="relative container mx-auto flex min-h-[calc(92vh-72px)] flex-col justify-center px-4 pb-24 pt-12 md:px-6 md:pb-32">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold uppercase tracking-[0.35em] text-gold/90"
          >
            Luxury real estate SaaS
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            Residences worth the{' '}
            <span className="gold-gradient-text">waitlist.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
          >
            Curated inventory, cinematic presentations, and a concierge-grade lead journey — built for developers and boutique brokerages.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/projects"
              className="rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 py-3.5 text-sm font-semibold text-black shadow-gold transition hover:shadow-gold-lg"
            >
              View projects
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-gold/40 hover:bg-white/10"
            >
              Book a walkthrough
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
          aria-hidden
        >
          <div className="flex h-12 w-7 justify-center rounded-full border border-white/20 pt-2">
            <motion.span
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="block h-2 w-1 rounded-full bg-gold/80"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold/90">Featured</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">Signature listings</h2>
            <p className="mt-3 max-w-lg text-sm text-white/55">Animated cards, glass overlays, and imagery that sells the narrative before the square footage.</p>
          </div>
          <Link href="/projects" className="text-sm font-semibold text-gold transition hover:text-gold-light">
            Browse all →
          </Link>
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {featured.map((p, i) => (
            <PropertyCard
              key={p.id}
              id={p.id}
              title={p.title}
              location={p.location}
              price={p.price}
              excerpt={p.excerpt}
              images={p.images}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-white/10 bg-black/25 py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-gold/90">Voices</p>
          <h2 className="mt-3 text-center font-display text-3xl font-semibold text-white md:text-4xl">Trusted by principals</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-panel flex h-full flex-col rounded-2xl p-6"
              >
                <blockquote className="flex-1 text-sm leading-relaxed text-white/75">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-5">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/45">{t.role}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/15 via-black/60 to-black px-8 py-14 text-center shadow-gold-lg md:px-16 md:py-16"
        >
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          <h2 className="relative font-display text-3xl font-semibold text-white md:text-4xl">Ready to elevate your pipeline?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm text-white/65 md:text-base">
            Deploy this experience white-labelled for your inventory — leads, analytics, and collateral in one motion.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-accent-gray">
              Talk to us
            </Link>
            <Link href="/projects" className="rounded-full border border-white/25 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/45">
              Explore inventory
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  )
}
