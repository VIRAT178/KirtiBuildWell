'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandMark } from './BrandMark'

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
]

export default function Navbar() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: solid ? 'rgba(5, 5, 6, 0.92)' : 'rgba(5, 5, 6, 0)',
          borderBottomColor: solid ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0)',
          backdropFilter: solid ? 'blur(16px)' : 'blur(0px)'
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 border-b border-transparent"
      >
        <nav className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
          <BrandMark href="/" layout="inline" size="md" priority className="min-w-0 shrink" />

          <div className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-white/75 transition-colors hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold shadow-soft transition hover:border-gold/70 hover:bg-gold/20"
            >
              Partner login
            </Link>
          </div>

          <button
            type="button"
            aria-label="Menu"
            className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-5 bg-white"
            />
            <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block h-0.5 w-5 bg-white" />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-5 bg-white"
            />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="glass-panel absolute right-0 top-0 flex h-full w-[min(320px,88vw)] flex-col gap-6 p-8 pt-24"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="-mt-4 mb-2">
                <BrandMark href="/" layout="stacked" size="md" onClick={() => setOpen(false)} />
              </div>
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={l.href}
                    className="block text-lg font-medium text-white/90"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/admin/login"
                className="mt-auto rounded-xl bg-gold px-4 py-3 text-center text-sm font-semibold text-black"
                onClick={() => setOpen(false)}
              >
                Partner login
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="h-[72px]" aria-hidden />
    </>
  )
}
