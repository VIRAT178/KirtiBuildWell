import React from 'react'
import { notFound } from 'next/navigation'
import { properties as seedProperties } from '../../../../data/properties'
import ProjectGallery from '../../../../components/ProjectGallery'
import LeadForm from '../../../../components/LeadForm'
import { getApiBaseUrl } from '../../../../lib/api'

type ProjectRecord = {
  _id: string
  title: string
  location: string
  price: number
  priceLabel?: string
  excerpt?: string
  description: string
  images: string[]
  amenities: string[]
}

function formatPriceLabel(priceCr: number) {
  if (!Number.isFinite(priceCr) || priceCr <= 0) return '₹0 Cr'
  return `₹${Number.isInteger(priceCr) ? priceCr : priceCr} Cr`
}

function mapProject(project: ProjectRecord) {
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

async function loadProject(slug: string) {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/properties/${slug}`, { cache: 'no-store' })
    if (response.ok) {
      const payload = (await response.json()) as { success?: boolean; data?: ProjectRecord }
      if (payload.data) return mapProject(payload.data)
    }
  } catch {
    // Fall back to the static seed data below.
  }

  return seedProperties.find((project) => project.id === slug) ?? null
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const prop = await loadProject(params.slug)
  if (!prop) notFound()

  return (
    <article className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
        <div className="space-y-8">
          <ProjectGallery images={prop.images} title={prop.title} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold/90">{prop.location}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">{prop.title}</h1>
            <p className="mt-2 text-xl font-semibold text-gold">{prop.price}</p>
            <p className="mt-6 text-sm leading-relaxed text-white/65 md:text-base">{prop.description}</p>
          </div>
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold text-white">Amenities</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {prop.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="lg:sticky lg:top-28">
          <LeadForm
            propertyContext={prop.title}
            heading="Enquire"
            subheading="Private tours and diligence packs available on request."
          />
        </aside>
      </div>
    </article>
  )
}
