'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PropertyCard from './PropertyCard'
import type { Property } from '../data/properties'
import { locationFilters } from '../data/properties'

export default function ProjectsExplorer({ items }: { items: Property[] }) {
  const [location, setLocation] = useState('All')
  const [maxCr, setMaxCr] = useState<number>(50)

  const maxAvailable = useMemo(() => Math.max(...items.map((p) => p.priceCr), 20), [items])

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const locOk =
        location === 'All' ||
        (location === 'Mumbai' && p.location.includes('Mumbai')) ||
        (location === 'Pune' && p.location.includes('Pune')) ||
        (location === 'Alibaug' && p.location.includes('Alibaug'))
      const priceOk = p.priceCr <= maxCr
      return locOk && priceOk
    })
  }, [items, location, maxCr])

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-5 md:p-6"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/90">Filters</p>
            <p className="mt-2 text-sm text-white/55">Refine the portfolio by geography and ceiling price.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="block text-sm text-white/65">
              <span className="mb-1.5 block text-xs uppercase tracking-wider text-white/40">Location</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full min-w-[180px] rounded-xl border border-white/12 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-gold/45 md:w-auto"
              >
                {locationFilters.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="block min-w-[220px] text-sm text-white/65">
              <span className="mb-1.5 flex justify-between text-xs uppercase tracking-wider text-white/40">
                <span>Max price</span>
                <span className="normal-case tracking-normal text-gold">≤ ₹{maxCr} Cr</span>
              </span>
              <input
                type="range"
                min={2}
                max={Math.ceil(maxAvailable)}
                step={0.5}
                value={Math.min(maxCr, maxAvailable)}
                onChange={(e) => setMaxCr(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </label>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-2">
        {filtered.map((p, i) => (
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

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-white/50">No projects match these filters — widen price or location.</p>
      ) : null}
    </div>
  )
}
