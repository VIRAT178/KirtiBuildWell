import React from 'react'
import { Metadata } from 'next'
import { properties } from '../../../data/properties'
import ProjectsExplorer from '../../../components/ProjectsExplorer'
import { generateMetadata, generateRealEstateStructuredData, generateBreadcrumbStructuredData } from '../../../lib/seo'

export const metadata = generateMetadata({
  title: 'Projects | Luxury Real Estate Developments by KirtiBuildWell',
  description: 'Explore our portfolio of luxury real estate projects in Lucknow. Premium residential developments featuring modern amenities and strategic locations.',
  keywords: ['real estate projects', 'luxury developments', 'residential projects', 'property portfolio'],
  url: '/projects'
})

export default function ProjectsPage() {
  // Generate structured data for all properties
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' }
  ])

  const propertiesData = properties.map(property => 
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
          <ProjectsExplorer items={properties} />
        </div>
      </section>
    </>
  )
}
