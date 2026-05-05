'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BrandMark } from './BrandMark'

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-black/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="container mx-auto px-4 py-14 md:px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <BrandMark href="/" layout="inline" size="lg" className="opacity-95" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
              Building Future, Creating Glory. Kirti Group delivers quality developments and reliable consultancy services through our specialized verticals.
            </p>
            <div className="mt-4 text-xs text-white/45">
              <p className="font-semibold text-gold/90 mb-2">Office Address</p>
              <p>Meera Complex, 12, Pahad Nagar Tekariya</p>
              <p>Lucknow, Selhu Mau, Uttar Pradesh 226303</p>
              <p className="mt-2">📧 info@kirtibuildwell.com</p>
              <p>📞 +91-8881115002</p>
            </div>
          </motion.div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/90">Explore</p>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li>
                <Link href="/projects" className="transition hover:text-gold">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-gold">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-gold">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/90">Legal</p>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li>
                <a href="#" className="transition hover:text-gold">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-gold">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/45 md:flex-row">
          <span>© {new Date().getFullYear()} Kirti BuildWell. All rights reserved.</span>
          <span className="text-white/35">Crafted for luxury real estate operators.</span>
        </div>
      </div>
    </footer>
  )
}
