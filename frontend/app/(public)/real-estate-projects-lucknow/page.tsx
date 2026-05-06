import { Metadata } from 'next'
import { generateMetadata, generateBreadcrumbStructuredData } from '../../../lib/seo'
import Link from 'next/link'
import { getApiBaseUrl } from '../../../lib/api'
import type { Property } from '../../../data/properties'

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

function mapProject(project: ProjectRecord): Property {
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
    return Array.isArray(payload.data) ? payload.data.map(mapProject) : []
  } catch {
    return []
  }
}

export const metadata = generateMetadata({
  title: 'Real Estate Projects in Lucknow | Premium Developments by KirtiBuildWell',
  description: 'Explore premium real estate projects in Lucknow by KirtiBuildWell. Luxury residential and commercial developments with world-class amenities and strategic locations.',
  keywords: ['real estate projects Lucknow', 'property development Lucknow', 'luxury projects Lucknow', 'real estate developer Lucknow'],
  url: '/real-estate-projects-lucknow'
})

export default async function RealEstateProjectsLucknowPage() {
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Real Estate Projects in Lucknow', url: '/real-estate-projects-lucknow' }
  ])
  const projects = await loadProjects()

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')] bg-cover bg-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-lux-darker" />
          </div>
          
          <div className="relative container mx-auto flex min-h-[60vh] flex-col justify-center px-4 py-24 md:px-6">
            <h1 className="font-display text-4xl font-semibold text-white md:text-6xl lg:text-7xl">
              Real Estate <span className="gold-gradient-text">Projects in Lucknow</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/80">
              Discover premium real estate developments in Lucknow by KirtiBuildWell. 
              Luxury residential and commercial projects designed for modern living.
            </p>
          </div>
        </section>

        {/* Projects Overview */}
        <section className="py-24 bg-lux-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-display text-3xl font-semibold text-white mb-8 text-center">
                Our Premium Projects
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {projects.map((project) => (
                  <div key={project.id} className="lux-card overflow-hidden group hover:shadow-gold transition-all duration-300">
                    <div className="relative h-48">
                      {project.images[0] ? (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-black/20 text-sm text-white/45">No image</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold text-white mb-2">{project.title}</h3>
                      <p className="text-gold text-sm mb-4">{project.price}</p>
                      <p className="text-white/60 text-sm mb-4">{project.location}</p>
                      <p className="text-white/70 text-sm">{project.excerpt || project.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {projects.length === 0 ? (
                <p className="mb-16 text-center text-sm text-white/55">No projects available right now.</p>
              ) : null}

              {/* Why Choose Our Projects */}
              <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">Why Choose Our Projects?</h3>
                  <ul className="space-y-4 text-white/70">
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span><strong>Strategic Locations:</strong> Prime locations with excellent connectivity to major landmarks</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span><strong>Quality Construction:</strong> Built with premium materials and modern techniques</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span><strong>Modern Amenities:</strong> World-class facilities for comfortable living</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span><strong>Investment Potential:</strong> High appreciation potential in growing Lucknow market</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span><strong>Trusted Developer:</strong> KirtiBuildWell's reputation for quality and reliability</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">Project Highlights</h3>
                  <ul className="space-y-4 text-white/70">
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span><strong>Gated Communities:</strong> Secure living with 24/7 security and surveillance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span><strong>Green Spaces:</strong> Landscaped gardens and recreational areas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span><strong>Parking Facilities:</strong> Ample parking for residents and visitors</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span><strong>Power Backup:</strong> 24/7 power and water supply</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">•</span>
                      <span><strong>Clubhouse:</strong> Modern clubhouse with gym, pool, and recreational facilities</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <Link
                  href="/contact"
                  className="inline-block bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 py-4 text-lg font-semibold text-black shadow-gold transition hover:shadow-gold-lg rounded-full mr-4"
                >
                  Get Project Details
                </Link>
                <Link
                  href="/projects"
                  className="inline-block border border-gold/40 bg-gold/10 px-8 py-4 text-lg font-semibold text-gold transition hover:bg-gold/20 rounded-full"
                >
                  View All Projects
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
