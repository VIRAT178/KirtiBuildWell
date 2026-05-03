'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export type PropertyCardProps = {
  id: string
  title: string
  location: string
  price: string
  excerpt?: string
  images?: string[]
  index?: number
}

export default function PropertyCard({ id, title, location, price, excerpt, images, index = 0 }: PropertyCardProps) {
  const img = images?.[0]

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group lux-card overflow-hidden"
    >
      <Link href={`/projects/${id}`} className="block">
        <div className="relative h-56 overflow-hidden md:h-64">
          {img ? (
            <motion.img
              src={img}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-lux-muted text-white/40">No image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-90" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="glass-panel rounded-xl p-4">
              <h3 className="font-display text-lg font-semibold text-white md:text-xl">{title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/75 md:text-sm">
                <span>{location}</span>
                <span className="text-white/35">·</span>
                <span className="font-semibold text-gold">{price}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {excerpt ? (
        <div className="border-t border-white/5 p-5">
          <p className="line-clamp-2 text-sm leading-relaxed text-white/60">{excerpt}</p>
          <Link
            href={`/projects/${id}`}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold transition hover:gap-2"
          >
            View details
            <span aria-hidden>→</span>
          </Link>
        </div>
      ) : null}
    </motion.article>
  )
}
