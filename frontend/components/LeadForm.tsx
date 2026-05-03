'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

export type LeadFormProps = {
  /** When set, appended to the message so CRM sees property context (slug IDs are not Mongo ObjectIds). */
  propertyContext?: string
  heading?: string
  subheading?: string
  className?: string
}

export default function LeadForm({
  propertyContext,
  heading = 'Start a conversation',
  subheading = 'Share your brief — our team responds within one business day.',
  className = ''
}: LeadFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg(null)
    
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 second timeout
    
    try {
      const messageBody =
        propertyContext != null && propertyContext.length > 0
          ? `[Property: ${propertyContext}]\n\n${form.message.trim()}`
          : form.message.trim()

      await axios.post(`${apiBase}/api/leads`, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: messageBody
      }, {
        signal: controller.signal,
        timeout: 45000 // 45 second timeout
      })
      
      clearTimeout(timeoutId)
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      clearTimeout(timeoutId)
      setStatus('error')
      
      if (err.name === 'CanceledError' || err.code === 'ECONNABORTED') {
        setErrorMsg('Request timed out. Please try again or call us directly.')
      } else if (axios.isAxiosError(err) && err.response?.data?.error) {
        setErrorMsg(String(err.response.data.error))
      } else {
        setErrorMsg('Something went wrong. Please try again or call us directly.')
      }
    }
  }

  const fields = (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/45">Name</span>
          <input
            name="name"
            required
            minLength={2}
            value={form.name}
            onChange={onChange}
            placeholder="Full name"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-gold/30 transition placeholder:text-white/25 focus:border-gold/40 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/45">Email</span>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={onChange}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-gold/30 transition placeholder:text-white/25 focus:border-gold/40 focus:ring-2"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/45">Phone</span>
        <input
          name="phone"
          required
          minLength={7}
          value={form.phone}
          onChange={onChange}
          placeholder="+91 …"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-gold/30 transition placeholder:text-white/25 focus:border-gold/40 focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/45">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={4}
          value={form.message}
          onChange={onChange}
          placeholder="Tell us about timeline, budget band, and must-have amenities."
          className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-gold/30 transition placeholder:text-white/25 focus:border-gold/40 focus:ring-2"
        />
      </label>
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel rounded-2xl p-6 md:p-8 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/90">{heading}</p>
      <p className="mt-2 text-sm text-white/55">{subheading}</p>

      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-6 text-center text-sm text-emerald-200"
        >
          Thank you — your enquiry is logged. A advisor will reach out shortly.
        </motion.div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          {fields}
          {errorMsg ? (
            <div className="rounded-lg border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{errorMsg}</div>
          ) : null}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light py-3.5 text-sm font-semibold text-black shadow-gold transition hover:shadow-gold-lg disabled:opacity-60"
          >
            {status === 'loading' ? 'Sending…' : 'Submit enquiry'}
          </button>
        </form>
      )}
    </motion.div>
  )
}
