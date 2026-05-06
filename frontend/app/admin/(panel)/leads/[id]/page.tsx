"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getApiBaseUrl } from '../../../../../lib/api'
import { getAuthToken, clearAuthToken } from '../../../../../lib/auth'

type LeadStatus = 'new' | 'contacted' | 'closed'

type Lead = {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  status: LeadStatus
  source?: string
  createdAt: string
  propertyId?: string
}

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

export default function LeadDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const apiBase = getApiBaseUrl()

  async function fetchLead() {
    try {
      const token = getAuthToken()
      if (!token) {
        router.replace('/admin/login')
        return
      }

      setLoading(true)
      setError(null)
      const response = await axios.get<{ success: boolean; data: Lead[] }>(`${apiBase}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const found = response.data.data.find((l) => l._id === id) || null
      if (!found) {
        setError('Lead not found')
      }
      setLead(found)
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined
      if (status === 401 || status === 403) {
        clearAuthToken()
        router.replace('/admin/login')
        return
      }
      setError('Unable to load lead')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    void fetchLead()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleStatusChange(newStatus: LeadStatus) {
    if (!lead) return
    try {
      const token = getAuthToken()
      if (!token) {
        router.replace('/admin/login')
        return
      }
      setUpdating(true)
      await axios.patch(
        `${apiBase}/api/leads/${lead._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setLead({ ...lead, status: newStatus })
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined
      if (status === 401 || status === 403) {
        clearAuthToken()
        router.replace('/admin/login')
        return
      }
      setError('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete() {
    if (!lead) return
    if (!confirm('Delete this lead? This cannot be undone.')) return
    try {
      const token = getAuthToken()
      if (!token) {
        router.replace('/admin/login')
        return
      }
      setDeleting(true)
      await axios.delete(`${apiBase}/api/leads/${lead._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/admin/leads')
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined
      if (status === 401 || status === 403) {
        clearAuthToken()
        router.replace('/admin/login')
        return
      }
      setError('Failed to delete lead')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="text-white/60">Loading…</div>
  if (error) return <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
  if (!lead) return <div className="text-white/60">No lead found.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/leads" className="text-sm text-white/50 hover:underline">← Back to leads</Link>
          <h1 className="mt-2 text-3xl font-semibold text-white">{lead.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={lead.status} />
            <div className="text-sm text-white/50">{new Date(lead.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            aria-label="Lead status"
            title="Lead status"
            value={lead.status}
            onChange={(e) => void handleStatusChange(e.target.value as LeadStatus)}
            disabled={updating || deleting}
            className="rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-sm outline-none focus:border-gold/45"
          >
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="closed">closed</option>
          </select>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-300 disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Delete lead'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-2 rounded-2xl bg-white/[0.03] p-6">
          <h2 className="mb-2 text-sm font-semibold text-white/60">Message</h2>
          <div className="whitespace-pre-wrap text-white/85">{lead.message}</div>
        </div>

        <aside className="rounded-2xl bg-white/[0.03] p-6">
          <h3 className="mb-3 text-sm font-semibold text-white/60">Contact</h3>
          <div className="text-white/90">{lead.email}</div>
          <div className="text-white/70 mt-1">{lead.phone}</div>

          {lead.source ? (
            <div className="mt-4 text-sm text-white/60">Source: {lead.source}</div>
          ) : null}

          {lead.propertyId ? (
            <div className="mt-4 text-sm text-white/60">Property: {lead.propertyId}</div>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
