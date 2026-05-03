'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import { getAuthToken } from '../../../lib/auth'

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace('/admin/login')
      return
    }
    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-lux-darker text-sm text-white/45">
        Loading…
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-lux-darker">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="min-h-full px-4 py-8 md:px-10 md:py-10">{children}</div>
      </div>
    </div>
  )
}
