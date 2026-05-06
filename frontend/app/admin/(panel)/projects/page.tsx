'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import type { Property } from '../../../../data/properties'
import { clearAuthToken } from '../../../../lib/auth'
import { createProject as createProjectApi, deleteProject as deleteProjectApi, fetchProjects, updateProject as updateProjectApi, type ProjectApiItem } from '../../../../lib/api'

function formatPriceLabel(priceCr: number) {
  if (!Number.isFinite(priceCr) || priceCr <= 0) return '₹0 Cr'
  return `₹${Number.isInteger(priceCr) ? priceCr : priceCr} Cr`
}

function mapProject(project: ProjectApiItem): Property {
  const priceCr = Number(project.price) || 0
  return {
    id: project._id,
    title: project.title,
    location: project.location,
    price: project.priceLabel?.trim() || formatPriceLabel(priceCr),
    priceCr,
    images: project.images ?? [],
    excerpt: project.excerpt?.trim() || project.description.slice(0, 140),
    description: project.description,
    amenities: project.amenities ?? []
  }
}

export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Property[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Property>>({})
  const [uploadPreview, setUploadPreview] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true)
        setError(null)
        const items = await fetchProjects()
        setProjects(items.map(mapProject))
      } catch (err) {
        const status = axios.isAxiosError(err) ? err.response?.status : undefined
        if (status === 401 || status === 403) {
          clearAuthToken()
          router.replace('/admin/login')
          return
        }
        setError('Unable to load projects from the API.')
      } finally {
        setLoading(false)
      }
    }

    void loadProjects()
  }, [router])

  const openCreate = () => {
    setCreating(true)
    setEditingId(null)
    setUploadPreview([])
    setError(null)
    setForm({
      title: '',
      location: '',
      price: '₹5 Cr',
      priceCr: 5,
      images: [],
      excerpt: '',
      description: '',
      amenities: []
    })
  }

  const openEdit = (p: Property) => {
    setCreating(false)
    setEditingId(p.id)
    setUploadPreview([])
    setError(null)
    setForm({ ...p, amenities: [...p.amenities] })
  }

  const closeForm = () => {
    setEditingId(null)
    setCreating(false)
    setForm({})
    setUploadPreview([])
  }

  const saveProject = async () => {
    if (!form.title?.trim()) return
    if (!form.location?.trim()) {
      setError('Location is required.')
      return
    }
    if (!form.description?.trim() || form.description.trim().length < 20) {
      setError('Description must be at least 20 characters.')
      return
    }

    try {
      setSaving(true)
      setError(null)
      const payload = {
        title: form.title.trim(),
        location: form.location.trim(),
        price: Number(form.priceCr) || 0,
        priceLabel: form.price?.trim() ?? '',
        excerpt: form.excerpt?.trim() ?? '',
        description: form.description.trim(),
        images: [...(form.images ?? []), ...uploadPreview],
        amenities: form.amenities ?? []
      }

      if (creating) {
        const created = await createProjectApi(payload)
        setProjects((prev) => [mapProject(created), ...prev.filter((project) => project.id !== created._id)])
      } else if (editingId) {
        const updated = await updateProjectApi(editingId, payload)
        setProjects((prev) => prev.map((project) => (project.id === editingId ? mapProject(updated) : project)))
      }

      closeForm()
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined
      if (status === 401 || status === 403) {
        clearAuthToken()
        router.replace('/admin/login')
        return
      }
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.response?.data?.message || 'Failed to save project.'
        : 'Failed to save project.'
      setError(String(message))
    } finally {
      setSaving(false)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Remove this project from the admin list?')) return
    try {
      setDeletingId(id)
      setError(null)
      await deleteProjectApi(id)
      setProjects((prev) => prev.filter((project) => project.id !== id))
      if (editingId === id) closeForm()
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined
      if (status === 401 || status === 403) {
        clearAuthToken()
        router.replace('/admin/login')
        return
      }
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.response?.data?.message || 'Failed to delete project.'
        : 'Failed to delete project.'
      setError(String(message))
    } finally {
      setDeletingId(null)
    }
  }

  const onFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    const readers: Promise<string>[] = []
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      readers.push(
        new Promise((resolve, reject) => {
          const r = new FileReader()
          r.onload = () => resolve(String(r.result))
          r.onerror = reject
          r.readAsDataURL(file)
        })
      )
    })
    Promise.all(readers).then((urls) => setUploadPreview((prev) => [...prev, ...urls]))
    e.target.value = ''
  }, [])

  const addImageUrl = () => {
    const url = prompt('Image URL (https://…)')?.trim()
    if (!url) return
    setForm((f) => ({ ...f, images: [...(f.images ?? []), url] }))
  }

  const removeStoredImage = (idx: number) => {
    setForm((f) => ({
      ...f,
      images: (f.images ?? []).filter((_, i) => i !== idx)
    }))
  }

  const removePreview = (idx: number) => {
    setUploadPreview((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold/90">Inventory</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">Projects</h1>
          <p className="mt-2 text-sm text-white/50">
            Add, edit, or remove listings directly through the API.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-black transition hover:bg-gold-light"
        >
          New project
        </button>
      </header>

      {error ? (
        <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-10 text-center text-sm text-white/45">
          Loading projects...
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((p, i) => (
          <motion.article
            key={p.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass-panel overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[16/9] bg-lux-muted">
              {p.images?.[0] ? (
                <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-white/35">No cover image</div>
              )}
            </div>
            <div className="space-y-3 p-5">
              <h2 className="font-display text-lg font-semibold text-white">{p.title}</h2>
              <p className="text-xs text-white/45">
                {p.location} · <span className="text-gold">{p.price}</span>
              </p>
              <p className="line-clamp-2 text-sm text-white/55">{p.excerpt}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-gold/40"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void deleteProject(p.id)}
                  disabled={deletingId === p.id}
                  className="rounded-lg border border-rose-500/25 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-500/10 disabled:opacity-60"
                >
                  {deletingId === p.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {creating || editingId ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
            onClick={closeForm}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-lux-card p-6 shadow-glass-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-xl font-semibold text-white">{creating ? 'Create project' : 'Edit project'}</h3>
              <div className="mt-6 space-y-4">
                <label className="block text-xs uppercase tracking-wider text-white/40">
                  Title
                  <input
                    className="mt-1 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-gold/45"
                    value={form.title ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </label>
                <label className="block text-xs uppercase tracking-wider text-white/40">
                  Location
                  <input
                    className="mt-1 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-gold/45"
                    value={form.location ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs uppercase tracking-wider text-white/40">
                    Price label
                    <input
                      className="mt-1 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-gold/45"
                      placeholder="₹8.5 Cr"
                      value={form.price ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-wider text-white/40">
                    Price (Cr)
                    <input
                      type="number"
                      step={0.1}
                      className="mt-1 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-gold/45"
                      value={form.priceCr ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, priceCr: Number(e.target.value) }))}
                    />
                  </label>
                </div>
                <label className="block text-xs uppercase tracking-wider text-white/40">
                  Excerpt
                  <input
                    className="mt-1 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-gold/45"
                    value={form.excerpt ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  />
                </label>
                <label className="block text-xs uppercase tracking-wider text-white/40">
                  Description
                  <textarea
                    rows={4}
                    className="mt-1 w-full resize-none rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-gold/45"
                    value={form.description ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </label>
                <label className="block text-xs uppercase tracking-wider text-white/40">
                  Amenities (comma-separated)
                  <input
                    className="mt-1 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-gold/45"
                    value={(form.amenities ?? []).join(', ')}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        amenities: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      }))
                    }
                  />
                </label>

                <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold/90">Images</p>
                  <p className="mt-1 text-[11px] text-white/40">Upload files or paste URLs — previews embed as data URLs locally.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label className="cursor-pointer rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs text-white/70 transition hover:border-gold/40">
                      Upload
                      <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
                    </label>
                    <button type="button" onClick={addImageUrl} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70 hover:border-gold/40">
                      Add URL
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(form.images ?? []).map((src, idx) => (
                      <div key={`img-${idx}`} className="relative h-16 w-24 overflow-hidden rounded-lg border border-white/10">
                        <img src={src} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeStoredImage(idx)}
                          className="absolute right-1 top-1 rounded bg-black/70 px-1 text-[10px] text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {uploadPreview.map((src, idx) => (
                      <div key={`up-${idx}`} className="relative h-16 w-24 overflow-hidden rounded-lg border border-gold/30">
                        <img src={src} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePreview(idx)}
                          className="absolute right-1 top-1 rounded bg-black/70 px-1 text-[10px] text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => void saveProject()} className="flex-1 rounded-xl bg-gold py-3 text-sm font-semibold text-black disabled:opacity-60" disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" onClick={closeForm} className="rounded-xl border border-white/15 px-4 py-3 text-sm text-white/70">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
