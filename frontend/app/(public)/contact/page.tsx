'use client'

import React from 'react'
import { motion } from 'framer-motion'
import LeadForm from '../../../components/LeadForm'

const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3576.123456789!2d80.912345678!3d26.8467123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e5f5f5f5f5f5%3A0x5f5f5f5f5f5f5f5!2sMeera%20Complex%2C%20Pahad%20Nagar%20Tekariya%2C%20Lucknow!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'

export default function ContactPage() {
  return (
    <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/90">Contact</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white md:text-5xl">Concierge desk</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/55">
            For inquiries, property visits, or consultations — leave a note and we&apos;ll coordinate from our Lucknow office.
          </p>
          <dl className="mt-10 space-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/40">Office</dt>
              <dd className="mt-1 text-white/80">Meera Complex, 12, Pahad Nagar Tekariya, Lucknow</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/40">Address</dt>
              <dd className="mt-1 text-white/80">Selhu Mau, Uttar Pradesh 226303</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/40">Hours</dt>
              <dd className="mt-1 text-white/80">Mon–Sat · 10:00 — 19:00 IST</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/40">Contact</dt>
              <dd className="mt-1 text-white/80">📧 info@kirtibuildwell.com | 📞 +91-XXXXXXXXXX</dd>
            </div>
          </dl>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 shadow-soft-lg">
            <iframe
              title="Kirti BuildWell map"
              src={MAP_EMBED}
              className="aspect-[4/3] h-[min(420px,50vh)] w-full grayscale-[30%] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </motion.div>

        <LeadForm
          heading="Write to us"
          subheading="Include preferred viewing windows and any NDAs we should route."
          className="self-start"
        />
      </div>
    </section>
  )
}
