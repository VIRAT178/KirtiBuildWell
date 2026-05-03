'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BrandMark } from '../BrandMark'
import { clearAuthToken } from '../../lib/auth'

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/projects', label: 'Projects' }
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function logout() {
    clearAuthToken()
    router.replace('/admin/login')
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="border-b border-white/10 px-6 py-6">
        <BrandMark href="/" layout="stacked" stackedAlign="start" size="sm" />
        <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/40">Admin</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href}>
              <motion.span
                whileHover={{ x: 4 }}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active ? 'bg-gold/15 text-gold' : 'text-white/65 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </motion.span>
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-white/55 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-200"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
