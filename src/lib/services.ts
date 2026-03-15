export interface Service {
  id: string
  slug: string
  name: string
  tagline: string
  category: 'WELLNESS' | 'FITNESS' | 'BUSINESS' | 'EVENTS'
  description: string
  basePrice: number
  duration: string
  image: string
  icon: string
  highlights: string[]
  services: string[]
  available: boolean
}

export interface Testimonial {
  name: string
  role: string
  text: string
  rating: number
  avatar: string
}

export interface Stat {
  value: string
  label: string
}

export const SERVICES: Service[] = [
  {
    id: '1',
    slug: 'salon-spa',
    name: 'Salon & Spa',
    tagline: 'Indulge in luxury beauty and wellness treatments',
    category: 'WELLNESS',
    description:
      'Our premium salon and spa offers a full range of beauty treatments from expert stylists and therapists. From rejuvenating facials to transformative hair styling, every visit is a sanctuary experience.',
    basePrice: 0,
    duration: '60 min',
    image: '/images/hero-spa.jpeg',
    icon: '✦',
    highlights: [
      'Expert stylists',
      'Premium products',
      'Relaxing atmosphere',
      'Personalised service',
    ],
    services: [
      'Hair Styling',
      'Facial Treatments',
      'Massage Therapy',
      'Nail Care',
      'Waxing',
      'Skin Care',
    ],
    available: true,
  },
  {
    id: '2',
    slug: 'barbershop',
    name: 'Barbershop',
    tagline: 'Classic grooming with a modern edge',
    category: 'WELLNESS',
    description:
      'Our master barbers deliver precision cuts and traditional grooming in a premium setting. Offering appointments and walk-in service for the discerning gentleman.',
    basePrice: 0,
    duration: '45 min',
    image: '/images/image-resizing-4.avif',
    icon: '✂',
    highlights: [
      'Master barbers',
      'Walk-in welcome',
      'Traditional techniques',
      'Modern styles',
    ],
    services: [
      'Haircut',
      'Beard Trim',
      'Hot Towel Shave',
      'Hair Wash',
      'Grooming Packages',
    ],
    available: true,
  },
  {
    id: '3',
    slug: 'gym',
    name: 'Fitness Centre',
    tagline: 'State-of-the-art equipment, expert trainers',
    category: 'FITNESS',
    description:
      'Train in our fully equipped modern gym with certified personal trainers, group classes, and a motivating environment that helps you achieve your fitness goals.',
    basePrice: 0,
    duration: 'Per session',
    image: '/images/image-resizing-5.avif',
    icon: '⊕',
    highlights: [
      'Modern equipment',
      'Certified trainers',
      'Group classes',
      'Memberships available',
    ],
    services: [
      'Day Pass',
      'Personal Training',
      'Group Fitness Classes',
      'Monthly Membership',
      '5-Session Pack',
    ],
    available: true,
  },
  {
    id: '4',
    slug: 'boardroom',
    name: 'Meeting Rooms',
    tagline: 'Professional spaces for impactful meetings',
    category: 'BUSINESS',
    description:
      'Fully equipped meeting and boardrooms with high-speed internet, AV systems, and catering options. Perfect for corporate meetings, presentations, and strategic sessions.',
    basePrice: 0,
    duration: 'Per hour',
    image: 'https://imagedelivery.net/K1DCBIh16uT0nsikD2vMaA/5ca5a320-c813-45c1-97df-16afea14bc00/public', 
    icon: '◈',
    highlights: [
      'High-speed WiFi',
      'AV equipment',
      'Catering available',
      'Flexible layouts',
    ],
    services: [
      'Hourly Booking',
      'Half-Day Package',
      'Full-Day Package',
      'Video Conferencing Setup',
      'Catering Add-on',
    ],
    available: true,
  },
  {
    id: '5',
    slug: 'ballroom',
    name: 'Ballroom',
    tagline: 'Grand events in an unforgettable setting',
    category: 'EVENTS',
    description:
      'Our magnificent ballroom accommodates up to 500 guests in elegance. Featuring stunning decor, professional lighting systems, and full event support for weddings, galas, and corporate events.',
    basePrice: 0,
    duration: 'Full day',
    image: 'https://imagedelivery.net/K1DCBIh16uT0nsikD2vMaA/4e93453c-c18f-40f7-1d44-47348a51c600/public',
    icon: '❋',
    highlights: [
      '500 guest capacity',
      'Professional lighting',
      'Decor packages',
      'Event planning support',
    ],
    services: [
      'Wedding Package',
      'Corporate Gala',
      'Birthday Celebration',
      'Decor Package',
      'Full Catering',
    ],
    available: true,
  },
  {
    id: '6',
    slug: 'banquet-hall',
    name: 'Banquet Hall',
    tagline: 'Elevated dining and intimate celebrations',
    category: 'EVENTS',
    description:
      'The perfect venue for intimate celebrations, corporate dinners, and social gatherings. Our banquet hall offers customised menus, impeccable service, and a warm sophisticated atmosphere.',
    basePrice: 0,
    duration: 'Full day',
    image: 'https://imagedelivery.net/K1DCBIh16uT0nsikD2vMaA/ba91ccad-a7a1-463e-25be-00131cc7d300/public',
    icon: '◎',
    highlights: [
      'Custom menus',
      'Up to 150 guests',
      'Bar service',
      'Themed setups',
    ],
    services: [
      'Dinner Package',
      'Cocktail Reception',
      'Brunch Package',
      'Custom Menu Design',
      'Bar Service',
    ],
    available: true,
  },
  {
    id: '7',
    slug: 'swimming-pool',
    name: 'Swimming Pool Training',
    tagline: 'Professional aquatic training for all levels',
    category: 'FITNESS',
    description:
      'Benefit from professional swimming instruction in our pristine pool. Certified instructors offer one-on-one coaching and group classes for beginners through competitive swimmers.',
    basePrice: 0,
    duration: 'Per session',
    image: '/images/image-resizing-10.avif',
    icon: '◇',
    highlights: [
      'Certified instructors',
      'All skill levels',
      'Lane assignments',
      'Group classes',
    ],
    services: [
      'Beginner Lessons',
      'Advanced Coaching',
      'Group Classes',
      'Competitive Training',
      '5-Session Pack',
    ],
    available: true,
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Amara K.',
    role: 'Regular Member',
    text: 'The spa at Ezra Annex is absolutely world-class. I leave feeling completely rejuvenated every single time. The staff are exceptional.',
    rating: 5,
    avatar: 'AK',
  },
  {
    name: 'David O.',
    role: 'Corporate Client',
    text: 'We hosted our annual strategy retreat in the boardroom. Impeccable facilities, reliable tech setup, and the catering was outstanding. Highly recommended.',
    rating: 5,
    avatar: 'DO',
  },
  {
    name: 'Priya M.',
    role: 'Wedding Client',
    text: 'Our wedding in the ballroom was magical. The team made every detail perfect. Our guests are still talking about the elegance of the venue months later.',
    rating: 5,
    avatar: 'PM',
  },
  {
    name: 'James W.',
    role: 'Fitness Member',
    text: 'Best gym in the area, without question. The trainers are genuinely invested in your progress, and the equipment is always in perfect condition.',
    rating: 5,
    avatar: 'JW',
  },
]

export const STATS: Stat[] = [
  { value: '5,000+', label: 'Happy Clients' },
  { value: '7', label: 'Premium Services' },
  { value: '15+', label: 'Expert Staff' },
  { value: '99%', label: 'Satisfaction Rate' },
]
