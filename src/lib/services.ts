import { startingPriceForSlug } from '@/lib/service-pricing'

export interface StaffMember {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  rating: number
  reviewCount: number
  specialties: string[]
  /** Years in role — shown in booking flow */
  yearsExperience: number
}

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
  staff: StaffMember[]
}

export interface Testimonial {
  text: string
  rating: number
  role: string
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
    tagline: 'Treat yourself to a new look and feel your best',
    category: 'WELLNESS',
    description:
      'Our friendly stylists and therapists are here to help you relax. Whether you need a fresh haircut or a calming massage, we make sure you leave feeling refreshed and happy.',
    basePrice: startingPriceForSlug('salon-spa'),
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    icon: '✦',
    highlights: [
      'Friendly stylists',
      'Quality products',
      'Quiet atmosphere',
      'Personal care',
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
    staff: [
      {
        id: 's1',
        name: 'Grace Mwangi',
        role: 'Lead stylist & spa host',
        bio: 'Same face you will see on the operations floor — she shapes colour and calm the way she runs her column: on time, warm, exact.',
        avatar: 'https://i.pravatar.cc/150?img=47',
        rating: 4.9,
        reviewCount: 214,
        specialties: ['Hair Styling', 'Skin Care', 'Facial Treatments'],
        yearsExperience: 8,
      },
    ],
  },
  {
    id: '2',
    slug: 'barbershop',
    name: 'Barbershop',
    tagline: 'Classic haircuts for the modern look',
    category: 'WELLNESS',
    description:
      "Our barbers know how to get your look just right. Whether you're coming in for a quick trim or a traditional shave, we'll make sure you leave looking sharp.",
    basePrice: startingPriceForSlug('barbershop'),
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    icon: '✂',
    highlights: [
      'Experienced barbers',
      'Walk-ins welcome',
      'Traditional shaves',
      'New styles',
    ],
    services: [
      'Haircut',
      'Beard Trim',
      'Hot Towel Shave',
      'Hair Wash',
      'Grooming Packages',
    ],
    available: true,
    staff: [
      {
        id: 'b1',
        name: 'Tony Baraka',
        role: 'Master barber',
        bio: 'The name on our walk-in board — fades, tapers, and hot towels with zero drama. If the queue is long, he still does not rush the neckline.',
        avatar: 'https://i.pravatar.cc/150?img=12',
        rating: 5.0,
        reviewCount: 301,
        specialties: ['Haircut', 'Hot Towel Shave', 'Beard Trim'],
        yearsExperience: 10,
      },
    ],
  },
  {
    id: '3',
    slug: 'gym',
    name: 'Fitness Centre',
    tagline: 'The right equipment and people to help you stay active',
    category: 'FITNESS',
    description:
      'Everything you need for a great workout. We have a fully equipped gym, professional trainers, and group classes to help you reach your goals in a friendly environment.',
    basePrice: startingPriceForSlug('gym'),
    duration: 'Per session',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    icon: '⊕',
    highlights: [
      'Modern equipment',
      'Professional trainers',
      'Fun group classes',
      'Member perks',
    ],
    services: [
      'Day Pass',
      'Personal Training',
      'Group Fitness Classes',
      'Monthly Membership',
      '5-Session Pack',
    ],
    available: true,
    staff: [
      {
        id: 'g1',
        name: 'Mike Tanui',
        role: 'Fitness floor lead',
        bio: 'Trains like he is keeping score on form, not flash. Day passes and members get the same honest programming.',
        avatar: 'https://i.pravatar.cc/150?img=11',
        rating: 4.9,
        reviewCount: 256,
        specialties: ['Personal Training', 'Group Fitness Classes', 'Day Pass'],
        yearsExperience: 8,
      },
    ],
  },
  {
    id: '4',
    slug: 'boardroom',
    name: 'Meeting Rooms',
    tagline: 'Quiet, professional spaces for your team',
    category: 'BUSINESS',
    description:
      "Get some work done in our private meeting rooms. We have fast internet, ready-to-use screens, and coffee/catering so you can focus on what's important.",
    basePrice: startingPriceForSlug('boardroom'),
    duration: 'Per hour',
    image: 'https://imagedelivery.net/K1DCBIh16uT0nsikD2vMaA/5ca5a320-c813-45c1-97df-16afea14bc00/public',
    icon: '◈',
    highlights: [
      'Fast WiFi',
      'Large screens',
      'Coffee & Snacks',
      'Easy to book',
    ],
    services: [
      'Hourly Booking',
      'Half-Day Package',
      'Full-Day Package',
      'Video Conferencing Setup',
      'Catering Add-on',
    ],
    available: true,
    staff: [
      {
        id: 'br1',
        name: 'James Kariuki',
        role: 'Meetings & venue host',
        bio: 'The person who unlocks the boardroom — HDMI checked, coffee staged, catering on the clock. Your slot starts composed.',
        avatar: 'https://i.pravatar.cc/150?img=45',
        rating: 4.9,
        reviewCount: 87,
        specialties: ['Video Conferencing Setup', 'Catering Add-on', 'Half-Day Package'],
        yearsExperience: 7,
      },
    ],
  },
  {
    id: '5',
    slug: 'ballroom',
    name: 'Ballroom',
    tagline: 'A beautiful space for your big celebrations',
    category: 'EVENTS',
    description:
      'Host up to 500 guests in our large ballroom. It is the perfect spot for weddings and big parties, with plenty of space for dancing and support to help you plan it all.',
    basePrice: startingPriceForSlug('ballroom'),
    duration: 'Full day',
    image: 'https://imagedelivery.net/K1DCBIh16uT0nsikD2vMaA/4e93453c-c18f-40f7-1d44-47348a51c600/public',
    icon: '❋',
    highlights: [
      'Space for 500 people',
      'Great lighting',
      'Decor options',
      'Planning help',
    ],
    services: [
      'Wedding Package',
      'Corporate Gala',
      'Birthday Celebration',
      'Decor Package',
      'Full Catering',
    ],
    available: true,
    staff: [
      {
        id: 'bl1',
        name: 'Sarah Wanjiru',
        role: 'Ballroom & events lead',
        bio: 'Runs the big room the way a stage manager runs a show — vendors, lighting, and your timeline land without guests seeing the seams.',
        avatar: 'https://i.pravatar.cc/150?img=46',
        rating: 5.0,
        reviewCount: 143,
        specialties: ['Wedding Package', 'Corporate Gala'],
        yearsExperience: 12,
      },
      {
        id: 'bl2',
        name: 'Rose Adhiambo',
        role: 'Ballroom coordinator',
        bio: 'Load-in to last dance — she keeps security, catering, and the DJ in the same thread so you are not the project manager on your own night.',
        avatar: 'https://i.pravatar.cc/150?img=50',
        rating: 4.9,
        reviewCount: 112,
        specialties: ['Decor Package', 'Birthday Celebration'],
        yearsExperience: 9,
      },
    ],
  },
  {
    id: '6',
    slug: 'banquet-hall',
    name: 'Banquet Hall',
    tagline: 'The perfect spot for dinners and small parties',
    category: 'EVENTS',
    description:
      'Great for family gatherings or office dinners. Our banquet hall fits up to 150 people and comes with a friendly team and a menu that your guests will really enjoy.',
    basePrice: startingPriceForSlug('banquet-hall'),
    duration: 'Full day',
    image: 'https://imagedelivery.net/K1DCBIh16uT0nsikD2vMaA/ba91ccad-a7a1-463e-25be-00131cc7d300/public',
    icon: '◎',
    highlights: [
      'Custom menus',
      'Up to 150 guests',
      'Bar service',
      'Cozy atmosphere',
    ],
    services: [
      'Dinner Package',
      'Cocktail Reception',
      'Brunch Package',
      'Custom Menu Design',
      'Bar Service',
      'Full Catering',
    ],
    available: true,
    staff: [
      {
        id: 'bq1',
        name: 'Rose Adhiambo',
        role: 'Banquet lead',
        bio: 'Smaller rooms than the ballroom, same standard — speeches, service pacing, and a kitchen that hits the window while food still steams.',
        avatar: 'https://i.pravatar.cc/150?img=50',
        rating: 4.9,
        reviewCount: 167,
        specialties: ['Custom Menu Design', 'Full Catering'],
        yearsExperience: 14,
      },
      {
        id: 'bq2',
        name: 'Sarah Wanjiru',
        role: 'Hospitality partner',
        bio: 'When events spill across spaces, she is the handoff — bar, floor, and family tables stay aligned without you running interference.',
        avatar: 'https://i.pravatar.cc/150?img=46',
        rating: 4.8,
        reviewCount: 98,
        specialties: ['Dinner Package', 'Cocktail Reception'],
        yearsExperience: 12,
      },
    ],
  },
  {
    id: '7',
    slug: 'swimming-pool',
    name: 'Swimming Pool',
    tagline: 'Learn to swim with our friendly coaches',
    category: 'FITNESS',
    description:
      'Join us for swimming lessons in our clean, safe pool. We have classes for all ages and skill levels, so everyone can feel comfortable in the water.',
    basePrice: startingPriceForSlug('swimming-pool'),
    duration: 'Per session',
    image: '/images/image-resizing-10.avif',
    icon: '◇',
    highlights: [
      'Patient coaches',
      'All ages welcome',
      'Clean water',
      'Small groups',
    ],
    services: [
      'Beginner Lessons',
      'Advanced Coaching',
      'Group Classes',
      'Competitive Training',
      '5-Session Pack',
    ],
    available: true,
    staff: [
      {
        id: 'sw1',
        name: 'Coach Ali Hassan',
        role: 'Pool lead & swim coach',
        bio: 'Lanes, lessons, and nervous first kicks — he keeps standards high and the water friendly. Same coach the desk schedules for training blocks.',
        avatar: 'https://i.pravatar.cc/150?img=51',
        rating: 4.9,
        reviewCount: 221,
        specialties: ['Beginner Lessons', 'Advanced Coaching', 'Group Classes'],
        yearsExperience: 12,
      },
    ],
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    role: 'Regular Member',
    text: 'The spa here is one of the best I have ever visited. I always feel so relaxed and ready to take on the day after my visit. The staff really care about you.',
    rating: 5,
  },
  {
    role: 'Corporate Client',
    text: 'We had our team meeting here and everything was great. The tech worked, the food was good, and the room was exactly what we needed.',
    rating: 5,
  },
  {
    role: 'Wedding Client',
    text: "Our wedding was perfect. Every little detail was taken care of, and our guests couldn't stop talking about how much they loved the place.",
    rating: 5,
  },
  {
    role: 'Fitness Member',
    text: 'Best gym in the area. The trainers really know their stuff and they actually care about your progress. The equipment is always clean and ready to use.',
    rating: 5,
  },
  {
    role: 'Guest',
    text: 'Loved the experience. The people were friendly, and the spa was a nice extra treat. Will definitely be coming back.',
    rating: 5,
  },
]

export const STATS: Stat[] = [
  { value: '5,000+', label: 'Returning guests' },
  { value: '7', label: 'Experiences' },
  { value: '15+', label: 'Specialists' },
  { value: '100%', label: 'We show up' },
]
