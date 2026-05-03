'use client'

import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BrandMark } from '../../../components/BrandMark'
import { setAuthToken } from '../../../lib/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post<{ token: string; user: { role: 'admin' | 'agent' } }>(`${apiBase}/api/auth/login`, {
        email,
        password
      })

      const { token, user } = response.data
      setAuthToken(token)

      if (user.role !== 'admin') {
        setError('Your account does not have admin access.')
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('Invalid credentials or server unavailable.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-lux-darker px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.12),_transparent_50%)]" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="glass-panel rounded-2xl p-8 md:p-10">
          <div className="flex justify-center">
            <BrandMark href="/" layout="stacked" size="lg" />
          </div>
          <p className="mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-gold/90">Admin</p>
          <h1 className="mt-2 text-center font-display text-2xl font-semibold text-white">Sign in</h1>
          <p className="mt-2 text-sm text-white/50">Dashboard access for approved operators.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-xs text-white/45">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/12 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-gold/45"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs text-white/45">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/12 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-gold/45"
              />
            </label>

            {error ? (
              <div className="rounded-lg border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-black transition hover:bg-gold-light disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Continue'}
            </button>
          </form>
        </div>
        <p className="mt-8 text-center text-xs text-white/35">
          <Link href="/" className="text-gold/80 hover:text-gold">
            ← Back to site
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
