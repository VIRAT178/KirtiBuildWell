'use client'

import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import DashboardCard from '../../../../components/DashboardCard'
import { getApiBaseUrl } from '../../../../lib/api'
import { clearAuthToken, getAuthToken } from '../../../../lib/auth'

type LeadStatus = 'new' | 'contacted' | 'closed'

type Lead = {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  status: LeadStatus
  source: 'website'
  createdAt: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiBase = getApiBaseUrl()

  useEffect(() => {
    async function load() {
      const token = getAuthToken()
      if (!token) {
        router.replace('/admin/login')
        return
      }
      try {
        setLoading(true)
        const res = await axios.get<{ success: boolean; data: Lead[] }>(`${apiBase}/api/leads`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setLeads(res.data.data || [])
      } catch (err) {
        const status = axios.isAxiosError(err) ? err.response?.status : undefined
        if (status === 401 || status === 403) {
          clearAuthToken()
          router.replace('/admin/login')
          return
        }
        setError('Could not load analytics.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [apiBase, router])

  const stats = useMemo(() => {
    const total = leads.length
    const closed = leads.filter((l) => l.status === 'closed').length
    const newLeads = leads.filter((l) => l.status === 'new').length
    const conversion = total ? Math.round((closed / total) * 1000) / 10 : 0
    const contacted = leads.filter((l) => l.status === 'contacted').length
    const max = Math.max(newLeads, contacted, closed, 1)
    const bar = (n: number) => Math.max(0, Math.min(100, Math.round((n / max) * 100)))
    return { total, closed, newLeads, contacted, conversion, barNew: bar(newLeads), barContacted: bar(contacted), barClosed: bar(closed) }
  }, [leads])

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold/90">Overview</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">Dashboard</h1>
        <p className="mt-2 max-w-xl text-sm text-white/50">Lead totals, conversion, and pipeline distribution.</p>
      </header>

      {error ? (
        <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total leads" value={loading ? '…' : stats.total} hint="All-time inbound" accent="default" delay={0} />
        <DashboardCard title="New" value={loading ? '…' : stats.newLeads} hint="Awaiting first touch" accent="sky" delay={0.05} />
        <DashboardCard title="Conversions" value={loading ? '…' : `${stats.conversion}%`} hint="Closed ÷ total" accent="emerald" delay={0.1} />
        <DashboardCard title="Closed wins" value={loading ? '…' : stats.closed} hint="Marked closed" accent="gold" delay={0.15} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-6 md:p-8"
        >
          <h2 className="font-display text-lg font-semibold text-white">Pipeline mix</h2>
          <p className="mt-1 text-xs text-white/45">Relative volume by status</p>
          <div className="mt-8 space-y-6">
            {[
              { label: 'New', pct: stats.barNew, color: 'bg-sky-400' },
              { label: 'Contacted', pct: stats.barContacted, color: 'bg-amber-400' },
              { label: 'Closed', pct: stats.barClosed, color: 'bg-emerald-400' }
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs text-white/55">
                  <span>{row.label}</span>
                  <span>{row.pct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.pct}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${row.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="glass-panel rounded-2xl p-6 md:p-8"
        >
          <h2 className="font-display text-lg font-semibold text-white">7-day pulse</h2>
          <p className="mt-1 text-xs text-white/45">Leads created in the last week</p>
          <div className="mt-8 flex h-44 gap-2 md:gap-3">
            {(() => {
              const labels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
              const now = Date.now()
              const dayMs = 86400000
              const buckets = Array.from({ length: 7 }).map((_, i) => {
                const dayStart = new Date(now - (6 - i) * dayMs)
                dayStart.setHours(0, 0, 0, 0)
                const dayEnd = new Date(dayStart.getTime() + dayMs)
                const count = leads.filter((l) => {
                  const t = new Date(l.createdAt).getTime()
                  return t >= dayStart.getTime() && t < dayEnd.getTime()
                }).length
                return count
              })
              const peak = Math.max(...buckets, 1)
              return buckets.map((c, i) => {
                const hPct = Math.max(12, Math.round((c / peak) * 100))
                const day = new Date(now - (6 - i) * dayMs)
                return (
                  <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
                    <div className="flex h-full w-full flex-col justify-end">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.55, delay: i * 0.05 }}
                        style={{ height: `${hPct}%`, transformOrigin: 'bottom' }}
                        className="w-full min-h-[6px] rounded-t-lg bg-gradient-to-t from-gold-dark to-gold"
                      />
                    </div>
                    <span className="text-[10px] text-white/35">{labels[day.getDay()]}</span>
                  </div>
                )
              })
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
