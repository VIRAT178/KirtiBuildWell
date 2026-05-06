import React from 'react'
import { Metadata } from 'next'
import { properties as seedProperties } from '../../../data/properties'
import ProjectsExplorer from '../../../components/ProjectsExplorer'
import { generateMetadata, generateRealEstateStructuredData, generateBreadcrumbStructuredData } from '../../../lib/seo'
import { getApiBaseUrl } from '../../../lib/api'

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

async function loadProjects() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/properties`, { cache: 'no-store' })
    if (!response.ok) throw new Error('Failed to load projects')
    const payload = (await response.json()) as { success?: boolean; data?: ProjectRecord[] }
    const projects = Array.isArray(payload.data) ? payload.data.map(mapProject) : []
    return projects.length > 0 ? projects : seedProperties
  } catch {
    return seedProperties
  }
}

export const metadata = generateMetadata({
  title: 'Projects | Luxury Real Estate Developments by KirtiBuildWell',
  description: 'Explore our portfolio of luxury real estate projects in Lucknow. Premium residential developments featuring modern amenities and strategic locations.',
  keywords: ['real estate projects', 'luxury developments', 'residential projects', 'property portfolio'],
  url: '/projects'
})

export default async function ProjectsPage() {
  const projects = await loadProjects()

  // Generate structured data for all properties
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' }
  ])

  const propertiesData = projects.map(property => 
    generateRealEstateStructuredData({
      name: property.title,
      description: property.description,
      price: property.price,
      address: property.location,
      image: property.images[0],
      url: `/projects/${property.id}`,
      propertyType: property.propertyType || 'Apartment',
      numberOfBedrooms: property.bedrooms || 3,
      area: property.area || '2000',
      availability: property.availability,
    })
  )

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      {propertiesData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/90">Portfolio</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white md:text-5xl">Projects</h1>
          <p className="mt-4 text-base leading-relaxed text-white/55">
            Discover residences engineered for light, privacy, and long-term value — filtered live below.
          </p>
        </header>
        <div className="mt-14">
          <ProjectsExplorer items={projects} />
        </div>
      </section>
    </>
  )
}
