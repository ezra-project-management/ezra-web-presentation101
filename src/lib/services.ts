import { startingPriceForSlug } from '@/lib/service-prices'

export interface StaffMember {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  rating: number
  reviewCount: number
  specialties: string[]
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
      { id: 's1', name: 'Amina Wanjiru', role: 'Senior Stylist', bio: '8 years of experience in hair and skin care. Known for her gentle touch and creative cuts.', avatar: 'https://i.pravatar.cc/150?img=47', rating: 4.9, reviewCount: 214, specialties: ['Hair Styling', 'Skin Care'] },
      { id: 's2', name: 'Grace Otieno', role: 'Spa Therapist', bio: 'Certified massage therapist specialising in deep tissue and relaxation treatments.', avatar: 'https://i.pravatar.cc/150?img=48', rating: 4.8, reviewCount: 178, specialties: ['Massage Therapy', 'Facial Treatments'] },
      { id: 's3', name: 'Fatuma Hassan', role: 'Nail Technician', bio: 'Passionate about nail art and precision nail care. Every detail matters to her.', avatar: 'https://i.pravatar.cc/150?img=49', rating: 4.7, reviewCount: 132, specialties: ['Nail Care', 'Waxing'] },
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
      { id: 'b1', name: 'James Kamau', role: 'Master Barber', bio: '10 years behind the chair. Specialises in fades, tapers, and classic gentleman cuts.', avatar: 'https://i.pravatar.cc/150?img=12', rating: 5.0, reviewCount: 301, specialties: ['Haircut', 'Hot Towel Shave'] },
      { id: 'b2', name: 'Brian Mwangi', role: 'Barber', bio: 'Loves working with all hair types. Great with kids and first-timers.', avatar: 'https://i.pravatar.cc/150?img=15', rating: 4.8, reviewCount: 189, specialties: ['Beard Trim', 'Grooming Packages'] },
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
      { id: 'g1', name: 'Kevin Odhiambo', role: 'Head Trainer', bio: 'Certified personal trainer with a background in sports science. Pushes you just the right amount.', avatar: 'https://i.pravatar.cc/150?img=11', rating: 4.9, reviewCount: 256, specialties: ['Personal Training', 'Group Fitness Classes'] },
      { id: 'g2', name: 'Mercy Njeri', role: 'Fitness Coach', bio: 'Specialises in weight loss and body toning. Warm, encouraging, and results-driven.', avatar: 'https://i.pravatar.cc/150?img=44', rating: 4.8, reviewCount: 198, specialties: ['Personal Training', '5-Session Pack'] },
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
      { id: 'br1', name: 'Sandra Achieng', role: 'Events Coordinator', bio: 'Handles all room setups and ensures your meeting runs without a hitch.', avatar: 'https://i.pravatar.cc/150?img=45', rating: 4.9, reviewCount: 87, specialties: ['Video Conferencing Setup', 'Catering Add-on'] },
    ],
  },
  {
    id: '5',
    slug: 'ballroom',
    name: 'Ballroom',
    tagline: 'A beautiful space for your big celebrations',
    category: 'EVENTS',
    description:
      'Host up to 500 guests in our large ballroom. It is a beautiful setting for weddings and major celebrations, with room to dine and dance, and a team to help you plan the day.',
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
      { id: 'bl1', name: 'Patricia Wambua', role: 'Event Planner', bio: 'Has planned over 200 weddings and corporate galas. She makes the big day feel effortless.', avatar: 'https://i.pravatar.cc/150?img=46', rating: 5.0, reviewCount: 143, specialties: ['Wedding Package', 'Corporate Gala'] },
      { id: 'bl2', name: 'Daniel Kipchoge', role: 'Decor Specialist', bio: 'Transforms spaces into stunning experiences. Every setup is tailored to your vision.', avatar: 'https://i.pravatar.cc/150?img=13', rating: 4.9, reviewCount: 112, specialties: ['Decor Package', 'Birthday Celebration'] },
    ],
  },
  {
    id: '6',
    slug: 'banquet-hall',
    name: 'Banquet Hall',
    tagline: 'The perfect spot for dinners and private gatherings',
    category: 'EVENTS',
    description:
      'Ideal for family gatherings, office dinners, and receptions. Our banquet hall fits up to 150 people, with a thoughtful team and menus your guests will remember.',
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
      { id: 'bq1', name: 'Chef Moses Kariuki', role: 'Head Chef', bio: 'Trained in Nairobi and Johannesburg. Crafts menus that leave guests asking for seconds.', avatar: 'https://i.pravatar.cc/150?img=14', rating: 4.9, reviewCount: 167, specialties: ['Custom Menu Design', 'Full Catering'] },
      { id: 'bq2', name: 'Lydia Muthoni', role: 'Banquet Coordinator', bio: 'Ensures every dinner and reception runs smoothly from start to finish.', avatar: 'https://i.pravatar.cc/150?img=50', rating: 4.8, reviewCount: 98, specialties: ['Dinner Package', 'Cocktail Reception'] },
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
      { id: 'sw1', name: 'Coach Peter Ndung\'u', role: 'Head Swimming Coach', bio: 'Former national swimmer. Patient, encouraging, and great with children and beginners.', avatar: 'https://i.pravatar.cc/150?img=16', rating: 4.9, reviewCount: 221, specialties: ['Beginner Lessons', 'Group Classes'] },
      { id: 'sw2', name: 'Coach Stella Auma', role: 'Swimming Instructor', bio: 'Specialises in competitive training and advanced technique refinement.', avatar: 'https://i.pravatar.cc/150?img=51', rating: 4.8, reviewCount: 145, specialties: ['Advanced Coaching', 'Competitive Training'] },
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
