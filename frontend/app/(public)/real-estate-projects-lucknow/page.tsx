import { Metadata } from 'next'
import { generateMetadata, generateBreadcrumbStructuredData } from '../../../lib/seo'
import Link from 'next/link'

export const metadata = generateMetadata({
  title: 'Real Estate Projects in Lucknow | Premium Developments by KirtiBuildWell',
  description: 'Explore premium real estate projects in Lucknow by KirtiBuildWell. Luxury residential and commercial developments with world-class amenities and strategic locations.',
  keywords: ['real estate projects Lucknow', 'property development Lucknow', 'luxury projects Lucknow', 'real estate developer Lucknow'],
  url: '/real-estate-projects-lucknow'
})

export default function RealEstateProjectsLucknowPage() {
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Real Estate Projects in Lucknow', url: '/real-estate-projects-lucknow' }
  ])

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
                {/* Project Cards */}
                <div className="lux-card overflow-hidden group hover:shadow-gold transition-all duration-300">
                  <div className="relative h-48">
                    <img
                      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80"
                      alt="Luxury Apartments"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-white mb-2">Golden Vista Residence</h3>
                    <p className="text-gold text-sm mb-4">2-4 BHK Luxury Apartments</p>
                    <p className="text-white/60 text-sm mb-4">Gomti Nagar, Lucknow</p>
                    <p className="text-white/70 text-sm">Premium apartments with panoramic views and modern amenities.</p>
                  </div>
                </div>

                <div className="lux-card overflow-hidden group hover:shadow-gold transition-all duration-300">
                  <div className="relative h-48">
                    <img
                      src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80"
                      alt="Premium Flats"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-white mb-2">Emerald Heights</h3>
                    <p className="text-gold text-sm mb-4">3-5 BHK Premium Flats</p>
                    <p className="text-white/60 text-sm mb-4">Alambagh, Lucknow</p>
                    <p className="text-white/70 text-sm">Spacious flats with world-class amenities and excellent connectivity.</p>
                  </div>
                </div>

                <div className="lux-card overflow-hidden group hover:shadow-gold transition-all duration-300">
                  <div className="relative h-48">
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80"
                      alt="Residential Complex"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-white mb-2">Platinum Towers</h3>
                    <p className="text-gold text-sm mb-4">1-3 BHK Studio Apartments</p>
                    <p className="text-white/60 text-sm mb-4">Hazratganj, Lucknow</p>
                    <p className="text-white/70 text-sm">Modern studio apartments in the heart of the city.</p>
                  </div>
                </div>
              </div>

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
