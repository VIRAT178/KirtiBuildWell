'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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

const statusOptions: LeadStatus[] = ['new', 'contacted', 'closed']

function StatusBadge({ status }: { status: LeadStatus }) {
  const classes = {
    new: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    contacted: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    closed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs capitalize ${classes[status]}`}>
      {status}
    </span>
  )
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState<'all' | LeadStatus>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

  async function fetchLeads() {
    try {
      const token = getAuthToken()
      if (!token) {
        router.replace('/admin/login')
        return
      }

      setLoading(true)
      setError(null)
      const query = filter === 'all' ? '' : `?status=${filter}`
      const response = await axios.get<{ success: boolean; data: Lead[] }>(`${apiBase}/api/leads${query}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setLeads(response.data.data || [])
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined
      if (status === 401 || status === 403) {
        clearAuthToken()
        router.replace('/admin/login')
        return
      }
      setError('Unable to load leads. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch when filter changes
  }, [filter])

  async function handleStatusChange(id: string, status: LeadStatus) {
    try {
      const token = getAuthToken()
      if (!token) {
        router.replace('/admin/login')
        return
      }

      setUpdatingId(id)
      await axios.patch(
        `${apiBase}/api/leads/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setLeads((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)))
    } catch (err) {
      const statusCode = axios.isAxiosError(err) ? err.response?.status : undefined
      if (statusCode === 401 || statusCode === 403) {
        clearAuthToken()
        router.replace('/admin/login')
        return
      }
      setError('Failed to update lead status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold/90">CRM</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">Leads</h1>
          <p className="mt-2 text-sm text-white/50">Filter by status and advance deals in one click.</p>
        </div>
        <label className="flex flex-col gap-1 text-sm text-white/55">
          <span className="text-xs uppercase tracking-wider text-white/40">Status</span>
          <select
            className="rounded-xl border border-white/12 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-gold/45"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | LeadStatus)}
          >
            <option value="all">All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </header>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wide text-white/50">
              <tr>
                <th className="px-5 py-4 font-medium">Lead</th>
                <th className="px-5 py-4 font-medium">Contact</th>
                <th className="px-5 py-4 font-medium">Message</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Created</th>
                <th className="px-5 py-4 font-medium">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td className="px-5 py-10 text-white/50" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-white/50" colSpan={6}>
                    No leads for this filter.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">{lead.name}</td>
                    <td className="px-5 py-4">
                      <div className="text-white/85">{lead.email}</div>
                      <div className="text-white/45">{lead.phone}</div>
                    </td>
                    <td className="max-w-[280px] truncate px-5 py-4 text-white/65" title={lead.message}>
                      {lead.message}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-5 py-4 text-white/50">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <select
                        aria-label={`Update status for ${lead.name}`}
                        disabled={updatingId === lead._id}
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value as LeadStatus)}
                        className="rounded-lg border border-white/12 bg-black/40 px-2 py-1.5 text-xs outline-none focus:border-gold/45 disabled:opacity-50"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {error ? <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
    </div>
  )
}
