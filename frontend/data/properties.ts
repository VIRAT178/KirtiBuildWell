export type Property = {
  id: string
  title: string
  location: string
  price: string
  priceCr: number
  images: string[]
  excerpt: string
  description: string
  amenities: string[]
  bedrooms?: number
  area?: string
  bathrooms?: number
  propertyType?: 'Apartment' | 'Flat' | 'Villa' | 'Commercial'
  availability?: string
}

export const properties: Property[] = [
  {
    id: 'golden-vista',
    title: 'Golden Vista Residence',
    location: 'Bandra, Mumbai',
    price: '₹8.5 Cr',
    priceCr: 8.5,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
    ],
    excerpt: 'A premium 4BHK sky residence with panoramic sea views.',
    description:
      'Golden Vista pairs unobstructed Arabian Sea views with double-height living spaces, private terraces, and a dedicated concierge floor. Interiors feature imported stone, bespoke kitchens, and smart climate zoning throughout.',
    amenities: ['Sea-facing balconies', 'Smart home automation', 'Private lift lobby', 'Concierge', 'Infinity-edge pool', 'EV charging']
  },
  {
    id: 'emerald-hills',
    title: 'Emerald Hills Estate',
    location: 'Lonavala, Pune',
    price: '₹3.9 Cr',
    priceCr: 3.9,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'
    ],
    excerpt: 'Secluded luxury villas with private gardens and layered decks.',
    description:
      'Set within a gated hillside community, Emerald Hills offers villa plots with layered decks, temperature-controlled wine walls, and outdoor lounges framed by native woodland.',
    amenities: ['Private gardens', 'Wellness pavilion', 'Outdoor kitchen', 'Staff quarters', 'Rainwater harvesting', 'Club membership']
  },
  {
    id: 'obsidian-towers',
    title: 'Obsidian Towers',
    location: 'BKC, Mumbai',
    price: '₹12.2 Cr',
    priceCr: 12.2,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c0b?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80'
    ],
    excerpt: 'Sky duplex with private pool deck above the business district.',
    description:
      'Obsidian Towers anchors the skyline with a duplex layout, sculptural staircases, and a private pool deck designed for entertaining against the BKC skyline.',
    amenities: ['Private pool deck', 'Sky lounge', 'Wine cellar', 'Three-car parking', 'Biometric entry', 'Interior designer-ready shell']
  },
  {
    id: 'ivory-coast',
    title: 'Ivory Coast Villas',
    location: 'Alibaug',
    price: '₹6.4 Cr',
    priceCr: 6.4,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
      'https://images.unsplash.com/photo-1575519186147-03e68986bf08?w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80'
    ],
    excerpt: 'Coastal villas minutes from the jetty with resort-grade amenities.',
    description:
      'Ivory Coast is a boutique collection of coastal villas with shallow reflective pools, outdoor showers, and direct concierge access to marina transfers.',
    amenities: ['Beach proximity', 'Reflecting pools', 'Outdoor shower courts', 'Solar backup', 'Guest cottage option', 'Landscaped courtyards']
  }
]

export const locationFilters = ['All', 'Mumbai', 'Pune', 'Alibaug']
