'use client'

import React from 'react'
import { motion } from 'framer-motion'

export type DashboardCardProps = {
  title: string
  value: string | number
  hint?: string
  accent?: 'default' | 'gold' | 'sky' | 'emerald'
  delay?: number
}

const accents = {
  default: 'from-white/10 to-white/5 border-white/10',
  gold: 'from-gold/20 to-gold/5 border-gold/25',
  sky: 'from-sky-500/15 to-sky-500/5 border-sky-500/25',
  emerald: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/25'
}

export default function DashboardCard({ title, value, hint, accent = 'default', delay = 0 }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-soft-lg ${accents[accent]}`}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/10 blur-2xl" />
      <p className="text-xs font-medium uppercase tracking-wider text-white/50">{title}</p>
      <p className="mt-3 font-display text-3xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-2 text-xs text-white/45">{hint}</p> : null}
    </motion.div>
  )
}
