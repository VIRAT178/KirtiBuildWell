import { Metadata } from 'next'
import { generateMetadata, generateRealEstateStructuredData, generateBreadcrumbStructuredData } from '../../../lib/seo'
import Link from 'next/link'

export const metadata = generateMetadata({
  title: 'Flats in Lucknow | Luxury Apartments by KirtiBuildWell',
  description: 'Discover premium flats and apartments in Lucknow by KirtiBuildWell. Modern amenities, excellent connectivity, and investment opportunities in prime locations.',
  keywords: ['flats in Lucknow', 'apartments in Lucknow', 'Lucknow flats', 'luxury flats Lucknow', 'buy flats Lucknow'],
  url: '/flats-in-lucknow'
})

export default function FlatsInLucknowPage() {
  // Generate structured data
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Flats in Lucknow', url: '/flats-in-lucknow' }
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
                backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-lux-darker" />
          </div>
          
          <div className="relative container mx-auto flex min-h-[60vh] flex-col justify-center px-4 py-24 md:px-6">
            <h1 className="font-display text-4xl font-semibold text-white md:text-6xl lg:text-7xl">
              Premium <span className="gold-gradient-text">Flats in Lucknow</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/80">
              Discover luxury flats and apartments in Lucknow with modern amenities, excellent connectivity, 
              and promising investment opportunities in prime locations.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 bg-lux-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-semibold text-white mb-8">
                Why Choose Our Flats in Lucknow?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-4">Prime Locations</h3>
                  <p className="text-white/70 leading-relaxed mb-6">
                    Our flats are strategically located in Lucknow's most sought-after neighborhoods, 
                    offering excellent connectivity to schools, hospitals, shopping centers, and business districts.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gold mb-4">Modern Amenities</h3>
                  <p className="text-white/70 leading-relaxed">
                    Experience luxury living with state-of-the-art amenities including swimming pools, 
                    fitness centers, landscaped gardens, and 24/7 security.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-4">Investment Potential</h3>
                  <p className="text-white/70 leading-relaxed mb-6">
                    Lucknow's real estate market is rapidly growing, making our flats an excellent investment 
                    opportunity with high appreciation potential.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gold mb-4">Quality Construction</h3>
                  <p className="text-white/70 leading-relaxed">
                    We use premium materials and modern construction techniques to ensure durability, 
                    comfort, and aesthetic appeal in every flat.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <Link
                  href="/projects"
                  className="inline-block bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 py-4 text-lg font-semibold text-black shadow-gold transition hover:shadow-gold-lg rounded-full"
                >
                  Explore Our Projects
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
