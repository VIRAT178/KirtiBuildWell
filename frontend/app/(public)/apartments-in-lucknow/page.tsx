import { Metadata } from 'next'
import { generateMetadata, generateRealEstateStructuredData, generateBreadcrumbStructuredData } from '../../../lib/seo'
import Link from 'next/link'

export const metadata = generateMetadata({
  title: 'Apartments in Lucknow | Premium Residential Projects by KirtiBuildWell',
  description: 'Find premium apartments in Lucknow with KirtiBuildWell. Luxury residential projects featuring modern amenities, strategic locations, and excellent investment returns.',
  keywords: ['apartments in Lucknow', 'luxury apartments Lucknow', 'residential projects Lucknow', 'buy apartments Lucknow'],
  url: '/apartments-in-lucknow'
})

export default function ApartmentsInLucknowPage() {
  // Generate structured data
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Apartments in Lucknow', url: '/apartments-in-lucknow' }
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
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-lux-darker" />
          </div>
          
          <div className="relative container mx-auto flex min-h-[60vh] flex-col justify-center px-4 py-24 md:px-6">
            <h1 className="font-display text-4xl font-semibold text-white md:text-6xl lg:text-7xl">
              Luxury <span className="gold-gradient-text">Apartments in Lucknow</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/80">
              Premium residential apartments in Lucknow offering world-class amenities, strategic locations, 
              and exceptional living experiences for modern families.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 bg-lux-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-semibold text-white mb-8">
                Our Premium Apartments in Lucknow
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="lux-card p-6">
                  <h3 className="text-xl font-semibold text-gold mb-4">2 BHK Apartments</h3>
                  <p className="text-white/70 leading-relaxed">
                    Perfect for small families and young professionals, our 2BHK apartments offer 
                    optimal space utilization and modern amenities.
                  </p>
                </div>
                
                <div className="lux-card p-6">
                  <h3 className="text-xl font-semibold text-gold mb-4">3 BHK Apartments</h3>
                  <p className="text-white/70 leading-relaxed">
                    Ideal for growing families, our 3BHK apartments provide spacious living areas 
                    and additional comfort with premium finishes.
                  </p>
                </div>
                
                <div className="lux-card p-6">
                  <h3 className="text-xl font-semibold text-gold mb-4">4 BHK Apartments</h3>
                  <p className="text-white/70 leading-relaxed">
                    Luxury living at its finest with our 4BHK apartments featuring expansive spaces, 
                    premium amenities, and exclusive privileges.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">Key Features</h3>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start">
                      <span className="text-gold mr-3">✓</span>
                      <span>Prime locations with excellent connectivity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">✓</span>
                      <span>Modern amenities and facilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">✓</span>
                      <span>High-quality construction materials</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">✓</span>
                      <span>24/7 security and maintenance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">✓</span>
                      <span>Ample parking and green spaces</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">Location Advantages</h3>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start">
                      <span className="text-gold mr-3">✓</span>
                      <span>Close to educational institutions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">✓</span>
                      <span>Near healthcare facilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">✓</span>
                      <span>Easy access to shopping centers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">✓</span>
                      <span>Well-connected to transport hubs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-3">✓</span>
                      <span>Proximity to business districts</span>
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
                  Schedule a Visit
                </Link>
                <Link
                  href="/projects"
                  className="inline-block border border-gold/40 bg-gold/10 px-8 py-4 text-lg font-semibold text-gold transition hover:bg-gold/20 rounded-full"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
