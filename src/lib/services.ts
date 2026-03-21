export interface Service {
  id: string
  slug: string
  name: string
  tagline: string
  category: 'WELLNESS' | 'FITNESS' | 'BUSINESS' | 'EVENTS' | 'ACCOMMODATION'
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
    tagline: 'Treat yourself to a new look and feel your best',
    category: 'WELLNESS',
    description:
      'Our friendly stylists and therapists are here to help you relax. Whether you need a fresh haircut or a calming massage, we make sure you leave feeling refreshed and happy.',
    basePrice: 0,
    duration: '60 min',
    image: '/images/image-resizing-3.avif',
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
  },
  {
    id: '2',
    slug: 'barbershop',
    name: 'Barbershop',
    tagline: 'Classic haircuts for the modern look',
    category: 'WELLNESS',
    description:
      "Our barbers know how to get your look just right. Whether you're coming in for a quick trim or a traditional shave, we'll make sure you leave looking sharp.",
    basePrice: 0,
    duration: '45 min',
    image: '/images/image-resizing-4.avif',
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
  },
  {
    id: '3',
    slug: 'gym',
    name: 'Fitness Centre',
    tagline: 'The right equipment and people to help you stay active',
    category: 'FITNESS',
    description:
      'Everything you need for a great workout. We have a fully equipped gym, professional trainers, and group classes to help you reach your goals in a friendly environment.',
    basePrice: 0,
    duration: 'Per session',
    image: '/images/image-resizing-5.avif',
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
  },
  {
    id: '4',
    slug: 'boardroom',
    name: 'Meeting Rooms',
    tagline: 'Quiet, professional spaces for your team',
    category: 'BUSINESS',
    description:
      "Get some work done in our private meeting rooms. We have fast internet, ready-to-use screens, and coffee/catering so you can focus on what's important.",
    basePrice: 0,
    duration: 'Per hour',
    image: '/images/image-resizing-7.avif',
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
  },
  {
    id: '5',
    slug: 'ballroom',
    name: 'Ballroom',
    tagline: 'A beautiful space for your big celebrations',
    category: 'EVENTS',
    description:
      "Host up to 500 guests in our large ballroom. It's the perfect spot for weddings and big parties, with plenty of space for dancing and local support to help you plan it all.",
    basePrice: 0,
    duration: 'Full day',
    image: '/images/image-resizing-2.jpeg',
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
  },
  {
    id: '6',
    slug: 'banquet-hall',
    name: 'Banquet Hall',
    tagline: 'The perfect spot for dinners and small parties',
    category: 'EVENTS',
    description:
      'Great for family gatherings or office dinners. Our banquet hall fits up to 150 people and comes with a friendly team and a menu that your guests will really enjoy.',
    basePrice: 0,
    duration: 'Full day',
    image: '/images/image-resizing.jpeg',
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
  },
  {
    id: '7',
    slug: 'swimming-pool',
    name: 'Swimming Pool',
    tagline: 'Learn to swim with our friendly coaches',
    category: 'FITNESS',
    description:
      'Join us for swimming lessons in our clean, safe pool. We have classes for all ages and skill levels, so everyone can feel comfortable in the water.',
    basePrice: 0,
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
  },
  {
    id: '8',
    slug: 'rooms',
    name: 'Accommodation',
    tagline: 'Comfortable rooms for a good night’s rest',
    category: 'ACCOMMODATION',
    description:
      'Stay with us and feel right at home. Our rooms are clean, cozy, and have everything you need for a relaxing night or a longer stay here in Nairobi.',
    basePrice: 0,
    duration: 'Per night',
    image: '/images/image-resizing-9.avif',
    icon: '⬡',
    highlights: [
      'Comfy beds',
      'Private bathroom',
      'Room service',
      'Free WiFi',
    ],
    services: [
      'Standard Room',
      'Deluxe Room',
      'Suite',
      'Extended Stay Package',
    ],
    available: true,
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Amara K.',
    role: 'Regular Member',
    text: 'The spa here is one of the best I have ever visited. I always feel so relaxed and ready to take on the day after my visit. The staff really care about you.',
    rating: 5,
    avatar: 'AK',
  },
  {
    name: 'David O.',
    role: 'Corporate Client',
    text: 'We had our team meeting here and everything was great. The tech worked, the food was good, and the room was exactly what we needed.',
    rating: 5,
    avatar: 'DO',
  },
  {
    name: 'Priya M.',
    role: 'Wedding Client',
    text: "Our wedding was perfect. Every little detail was taken care of, and our guests couldn't stop talking about how much they loved the place.",
    rating: 5,
    avatar: 'PM',
  },
  {
    name: 'James W.',
    role: 'Fitness Member',
    text: 'Best gym in the area. The trainers really know their stuff and they actually care about your progress. The equipment is always clean and ready to use.',
    rating: 5,
    avatar: 'JW',
  },
  {
    name: 'Grace A.',
    role: 'Hotel Guest',
    text: 'Stayed for a week and loved it. The room was super clean, the people were friendly, and the spa was a nice extra treat.',
    rating: 5,
    avatar: 'GA',
  },
]

export const STATS: Stat[] = [
  { value: '5,000+', label: 'Local Members' },
  { value: '8', label: 'Ways to Relax' },
  { value: '15+', label: 'Friendly Staff' },
  { value: '100%', label: 'Local Favorite' },
]
