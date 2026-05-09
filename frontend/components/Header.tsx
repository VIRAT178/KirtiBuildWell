import React from 'react'
import Link from 'next/link'
import { BrandMark } from './BrandMark'

export default function Header(){
  return (
    <header className="w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between p-4">
        <BrandMark href="/" layout="inline" size="sm" priority className="min-w-0 shrink" />
        <nav>
          <Link className="mr-4 text-sm text-white/70 transition hover:text-gold" href="/projects">Projects</Link>
          <Link className="mr-4 text-sm text-white/70 transition hover:text-gold" href="/contact">Contact</Link>
          <Link className="text-sm text-white/70 transition hover:text-gold" href="/admin/login">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
