'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0)
  const safe = images.length ? images : []
  const current = safe[index] ?? ''

  function prev() {
    setIndex((i) => (i === 0 ? safe.length - 1 : i - 1))
  }

  function next() {
    setIndex((i) => (i >= safe.length - 1 ? 0 : i + 1))
  }

  if (!safe.length) {
    return <div className="flex aspect-[16/10] items-center justify-center rounded-2xl border border-white/10 bg-lux-muted text-white/40">No images</div>
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-soft-lg">
      <div className="relative aspect-[16/10] bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={current}
            alt={`${title} — ${index + 1}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          {safe.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-gold' : 'w-2 bg-white/35 hover:bg-white/55'}`}
            />
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-lg text-white backdrop-blur-md transition hover:border-gold/50 hover:bg-black/70"
        aria-label="Previous image"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-lg text-white backdrop-blur-md transition hover:border-gold/50 hover:bg-black/70"
        aria-label="Next image"
      >
        ›
      </button>
    </div>
  )
}
