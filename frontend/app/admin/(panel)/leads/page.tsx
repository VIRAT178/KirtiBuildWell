'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  const apiBase = getApiBaseUrl()

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

  async function handleDeleteLead(id: string) {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      return
    }

    try {
      const token = getAuthToken()
      if (!token) {
        router.replace('/admin/login')
        return
      }

      setDeletingIds(prev => new Set(prev).add(id))
      await axios.delete(`${apiBase}/api/leads/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setLeads((prev) => prev.filter((item) => item._id !== id))
      setSelectedLeads((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    } catch (err) {
      const statusCode = axios.isAxiosError(err) ? err.response?.status : undefined
      if (statusCode === 401 || statusCode === 403) {
        clearAuthToken()
        router.replace('/admin/login')
        return
      }
      setError('Failed to delete lead')
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  async function handleDeleteMultiple() {
    const selectedIds = Array.from(selectedLeads)
    if (selectedIds.length === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} lead(s)? This action cannot be undone.`)) {
      return
    }

    try {
      const token = getAuthToken()
      if (!token) {
        router.replace('/admin/login')
        return
      }

      setDeletingIds(new Set(selectedIds))
      await axios.delete(`${apiBase}/api/leads/batch`, {
        data: { ids: selectedIds },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setLeads((prev) => prev.filter((item) => !selectedIds.includes(item._id)))
      setSelectedLeads(new Set())
    } catch (err) {
      const statusCode = axios.isAxiosError(err) ? err.response?.status : undefined
      if (statusCode === 401 || statusCode === 403) {
        clearAuthToken()
        router.replace('/admin/login')
        return
      }
      setError('Failed to delete leads')
    } finally {
      setDeletingIds(new Set())
    }
  }

  function handleSelectLead(id: string) {
    setSelectedLeads(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  function handleSelectAll() {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set())
    } else {
      setSelectedLeads(new Set(leads.map(lead => lead._id)))
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
        <div className="flex gap-3">
          {selectedLeads.size > 0 && (
            <button
              onClick={handleDeleteMultiple}
              disabled={deletingIds.size > 0}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300 outline-none focus:border-rose-500/45 disabled:opacity-50"
            >
              Delete {selectedLeads.size} {selectedLeads.size === 1 ? 'Lead' : 'Leads'}
            </button>
          )}
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
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wide text-white/50">
              <tr>
                <th className="px-5 py-4 font-medium">
                  <input
                    type="checkbox"
                    aria-label="Select all leads"
                    title="Select all leads"
                    checked={selectedLeads.size === leads.length && leads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-white/20 bg-black/40 text-gold focus:ring-gold/45"
                  />
                </th>
                <th className="px-5 py-4 font-medium">Lead</th>
                <th className="px-5 py-4 font-medium">Contact</th>
                <th className="px-5 py-4 font-medium">Message</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Created</th>
                <th className="px-5 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td className="px-5 py-10 text-white/50" colSpan={7}>
                    Loading…
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-white/50" colSpan={7}>
                    No leads for this filter.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        aria-label={`Select lead ${lead.name}`}
                        title={`Select lead ${lead.name}`}
                        checked={selectedLeads.has(lead._id)}
                        onChange={() => handleSelectLead(lead._id)}
                        className="rounded border-white/20 bg-black/40 text-gold focus:ring-gold/45"
                      />
                    </td>
                    <td className="px-5 py-4 font-medium text-white">
                      <Link href={`/admin/leads/${lead._id}`} className="text-gold hover:underline">
                        {lead.name}
                      </Link>
                    </td>
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
                      <div className="flex items-center justify-center gap-2">
                        <select
                          aria-label={`Update status for ${lead.name}`}
                          disabled={updatingId === lead._id || deletingIds.has(lead._id)}
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
                        <button
                          onClick={() => handleDeleteLead(lead._id)}
                          disabled={deletingIds.has(lead._id) || updatingId === lead._id}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1.5 text-xs text-rose-300 outline-none focus:border-rose-500/45 disabled:opacity-50 hover:bg-rose-500/20"
                        >
                          {deletingIds.has(lead._id) ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
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
