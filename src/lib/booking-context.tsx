'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { computeCancellationDeadline } from '@/lib/booking-copy'
import { UPCOMING_BOOKINGS, PAST_BOOKINGS } from './dashboard-data'

// ── Per-service slot capacity (chairs / concurrent bookings allowed) ───
export const SERVICE_CAPACITY: Record<string, number> = {
  'salon-spa':      4,
  'barbershop':     4,
  'gym':            6,
  'boardroom':      2,
  'ballroom':       1,
  'banquet-hall':   1,
  'swimming-pool':  4,
  default:          4,
}

export function getServiceCapacity(slug: string): number {
  return SERVICE_CAPACITY[slug] ?? SERVICE_CAPACITY.default
}

/** Default specialist label when the guest did not pick someone — shown on confirmations & detail. */
export const DEFAULT_SPECIALIST_BY_SERVICE: Record<string, string> = {
  'salon-spa': 'Grace M.',
  barbershop: 'Tony B.',
  gym: 'Coach Mike T.',
  boardroom: 'James K.',
  ballroom: 'Sarah W.',
  'banquet-hall': 'Rose A.',
  'swimming-pool': 'Coach Ali',
}

const BOOKINGS_STORAGE_KEY = 'ezra-center-member-bookings-v1'

function mergeStoredWithSeed(seed: BookingRecord[], stored: BookingRecord[] | null): BookingRecord[] {
  if (!stored?.length) return seed
  const map = new Map(seed.map((b) => [b.id, b]))
  for (const b of stored) {
    if (b?.id) map.set(b.id, b)
  }
  return Array.from(map.values())
}

// ── Types ──────────────────────────────────────────────────────────────
export type BookingStatus = 'CONFIRMED' | 'PENDING_PAYMENT' | 'COMPLETED' | 'CANCELLED'

export interface BookingRecord {
  id: string
  reference: string
  service: string
  serviceSlug: string
  serviceCategory: string
  resource: string
  staff: string
  date: string
  time: string
  endTime: string
  duration: string
  guests: number
  status: BookingStatus
  amount: number
  paymentMethod: string | null
  mpesaRef: string | null
  image: string
  notes: string | null
  canReschedule: boolean
  canCancel: boolean
  cancellationDeadline: string | null
  rating: number | null
  review: string | null
  bookedFor: { name: string; phone: string } | null
  services: string[]
  smsReminder: boolean
}

export interface StaffBlock {
  id: string
  staffName: string
  date: string
  startTime: string
  endTime: string
  reason: string
}

// ── Kenyan Public Holidays 2026 ────────────────────────────────────────
export const PUBLIC_HOLIDAYS: { date: string; name: string }[] = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-04-03', name: 'Good Friday' },
  { date: '2026-04-06', name: 'Easter Monday' },
  { date: '2026-05-01', name: 'Labour Day' },
  { date: '2026-06-01', name: 'Madaraka Day' },
  { date: '2026-10-10', name: 'Huduma Day' },
  { date: '2026-10-20', name: 'Mashujaa Day' },
  { date: '2026-12-12', name: 'Jamhuri Day' },
  { date: '2026-12-25', name: 'Christmas Day' },
  { date: '2026-12-26', name: 'Boxing Day' },
]

// ── Closed Days ────────────────────────────────────────────────────────
export function isClosedDay(dateStr: string): string | null {
  const date = new Date(dateStr)
  if (date.getDay() === 0) return 'We are closed on Sundays'
  const holiday = PUBLIC_HOLIDAYS.find(h => h.date === dateStr)
  if (holiday) return `Closed for ${holiday.name}`
  return null
}

// ── Initial Staff Blocks ───────────────────────────────────────────────
const INITIAL_STAFF_BLOCKS: StaffBlock[] = [
  { id: 'sb-001', staffName: 'Grace M.', date: '2026-03-15', startTime: '12:00 PM', endTime: '1:00 PM', reason: 'Lunch Break' },
  { id: 'sb-002', staffName: 'Coach Mike T.', date: '2026-03-18', startTime: '12:00 PM', endTime: '1:00 PM', reason: 'Lunch Break' },
]

// ── Demo seed bookings for showcase (per-service, varied availability) ─
// Today is 2026-03-11. We'll seed March 12–20 with rich booking data.
type SeedBooking = {
  id: string; reference: string; service: string; serviceSlug: string
  date: string; time: string; status: BookingStatus
}

const SERVICE_IMAGES: Record<string, string> = {
  'salon-spa': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
  'barbershop': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
  'gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  'boardroom': 'https://imagedelivery.net/K1DCBIh16uT0nsikD2vMaA/5ca5a320-c813-45c1-97df-16afea14bc00/public',
  'ballroom': 'https://imagedelivery.net/K1DCBIh16uT0nsikD2vMaA/4e93453c-c18f-40f7-1d44-47348a51c600/public',
  'banquet-hall': 'https://imagedelivery.net/K1DCBIh16uT0nsikD2vMaA/ba91ccad-a7a1-463e-25be-00131cc7d300/public',
  'swimming-pool': '/images/image-resizing-10.avif',
}

function makeSeed(id: string, serviceSlug: string, serviceName: string, date: string, time: string): SeedBooking {
  return { id, reference: `EZR-DEMO${id}`, service: serviceName, serviceSlug, date, time, status: 'CONFIRMED' }
}

const DEMO_BOOKINGS: SeedBooking[] = [
  // ── Salon & Spa – March 12 (busy morning, quiet afternoon) ───────────
  makeSeed('d001', 'salon-spa', 'Salon & Spa', '2026-03-12', '9:00 AM'),
  makeSeed('d002', 'salon-spa', 'Salon & Spa', '2026-03-12', '9:00 AM'),
  makeSeed('d003', 'salon-spa', 'Salon & Spa', '2026-03-12', '9:00 AM'),
  makeSeed('d004', 'salon-spa', 'Salon & Spa', '2026-03-12', '9:00 AM'),  // FULL
  makeSeed('d005', 'salon-spa', 'Salon & Spa', '2026-03-12', '10:00 AM'),
  makeSeed('d006', 'salon-spa', 'Salon & Spa', '2026-03-12', '10:00 AM'),
  makeSeed('d007', 'salon-spa', 'Salon & Spa', '2026-03-12', '10:00 AM'), // 3/4
  makeSeed('d008', 'salon-spa', 'Salon & Spa', '2026-03-12', '11:00 AM'),
  makeSeed('d009', 'salon-spa', 'Salon & Spa', '2026-03-12', '11:00 AM'),
  makeSeed('d010', 'salon-spa', 'Salon & Spa', '2026-03-12', '11:00 AM'),
  makeSeed('d011', 'salon-spa', 'Salon & Spa', '2026-03-12', '11:00 AM'), // FULL
  makeSeed('d012', 'salon-spa', 'Salon & Spa', '2026-03-12', '12:00 PM'),
  makeSeed('d013', 'salon-spa', 'Salon & Spa', '2026-03-12', '12:00 PM'),
  makeSeed('d014', 'salon-spa', 'Salon & Spa', '2026-03-12', '12:00 PM'),
  makeSeed('d015', 'salon-spa', 'Salon & Spa', '2026-03-12', '12:00 PM'), // FULL

  // ── Salon & Spa – March 13 (moderate) ───────────────────────────────
  makeSeed('d020', 'salon-spa', 'Salon & Spa', '2026-03-13', '9:00 AM'),
  makeSeed('d021', 'salon-spa', 'Salon & Spa', '2026-03-13', '9:00 AM'),
  makeSeed('d022', 'salon-spa', 'Salon & Spa', '2026-03-13', '10:00 AM'),
  makeSeed('d023', 'salon-spa', 'Salon & Spa', '2026-03-13', '11:00 AM'),
  makeSeed('d024', 'salon-spa', 'Salon & Spa', '2026-03-13', '11:00 AM'),
  makeSeed('d025', 'salon-spa', 'Salon & Spa', '2026-03-13', '11:00 AM'),

  // ── Barbershop – March 12 (moderately busy) ──────────────────────────
  makeSeed('d030', 'barbershop', 'Barbershop', '2026-03-12', '8:00 AM'),
  makeSeed('d031', 'barbershop', 'Barbershop', '2026-03-12', '8:00 AM'),
  makeSeed('d032', 'barbershop', 'Barbershop', '2026-03-12', '9:00 AM'),
  makeSeed('d033', 'barbershop', 'Barbershop', '2026-03-12', '9:00 AM'),
  makeSeed('d034', 'barbershop', 'Barbershop', '2026-03-12', '9:00 AM'),
  makeSeed('d035', 'barbershop', 'Barbershop', '2026-03-12', '9:00 AM'),  // FULL
  makeSeed('d036', 'barbershop', 'Barbershop', '2026-03-12', '10:00 AM'),
  makeSeed('d037', 'barbershop', 'Barbershop', '2026-03-12', '11:00 AM'),
  makeSeed('d038', 'barbershop', 'Barbershop', '2026-03-12', '11:00 AM'),
  makeSeed('d039', 'barbershop', 'Barbershop', '2026-03-12', '11:00 AM'),

  // ── Barbershop – March 14 (very busy Saturday) ───────────────────────
  makeSeed('d040', 'barbershop', 'Barbershop', '2026-03-14', '8:00 AM'),
  makeSeed('d041', 'barbershop', 'Barbershop', '2026-03-14', '8:00 AM'),
  makeSeed('d042', 'barbershop', 'Barbershop', '2026-03-14', '8:00 AM'),
  makeSeed('d043', 'barbershop', 'Barbershop', '2026-03-14', '8:00 AM'),  // FULL
  makeSeed('d044', 'barbershop', 'Barbershop', '2026-03-14', '9:00 AM'),
  makeSeed('d045', 'barbershop', 'Barbershop', '2026-03-14', '9:00 AM'),
  makeSeed('d046', 'barbershop', 'Barbershop', '2026-03-14', '9:00 AM'),
  makeSeed('d047', 'barbershop', 'Barbershop', '2026-03-14', '9:00 AM'),  // FULL
  makeSeed('d048', 'barbershop', 'Barbershop', '2026-03-14', '10:00 AM'),
  makeSeed('d049', 'barbershop', 'Barbershop', '2026-03-14', '10:00 AM'),
  makeSeed('d050', 'barbershop', 'Barbershop', '2026-03-14', '10:00 AM'),
  makeSeed('d051', 'barbershop', 'Barbershop', '2026-03-14', '11:00 AM'),
  makeSeed('d052', 'barbershop', 'Barbershop', '2026-03-14', '11:00 AM'),
  makeSeed('d053', 'barbershop', 'Barbershop', '2026-03-14', '12:00 PM'),
  makeSeed('d054', 'barbershop', 'Barbershop', '2026-03-14', '12:00 PM'),
  makeSeed('d055', 'barbershop', 'Barbershop', '2026-03-14', '12:00 PM'),
  makeSeed('d056', 'barbershop', 'Barbershop', '2026-03-14', '12:00 PM'), // FULL

  // ── Gym – March 12 (mostly open, peak hours busy) ─────────────────────
  makeSeed('d060', 'gym', 'Fitness Centre', '2026-03-12', '8:00 AM'),
  makeSeed('d061', 'gym', 'Fitness Centre', '2026-03-12', '8:00 AM'),
  makeSeed('d062', 'gym', 'Fitness Centre', '2026-03-12', '8:00 AM'),
  makeSeed('d063', 'gym', 'Fitness Centre', '2026-03-12', '8:00 AM'),
  makeSeed('d064', 'gym', 'Fitness Centre', '2026-03-12', '8:00 AM'),
  makeSeed('d065', 'gym', 'Fitness Centre', '2026-03-12', '8:00 AM'),     // FULL (cap=6)
  makeSeed('d066', 'gym', 'Fitness Centre', '2026-03-12', '9:00 AM'),
  makeSeed('d067', 'gym', 'Fitness Centre', '2026-03-12', '9:00 AM'),
  makeSeed('d068', 'gym', 'Fitness Centre', '2026-03-12', '9:00 AM'),
  makeSeed('d069', 'gym', 'Fitness Centre', '2026-03-12', '9:00 AM'),
  makeSeed('d070', 'gym', 'Fitness Centre', '2026-03-12', '10:00 AM'),
  makeSeed('d071', 'gym', 'Fitness Centre', '2026-03-12', '10:00 AM'),

  // ── Gym – March 17 (heavy bookings) ───────────────────────────────────
  makeSeed('d080', 'gym', 'Fitness Centre', '2026-03-17', '8:00 AM'),
  makeSeed('d081', 'gym', 'Fitness Centre', '2026-03-17', '8:00 AM'),
  makeSeed('d082', 'gym', 'Fitness Centre', '2026-03-17', '8:00 AM'),
  makeSeed('d083', 'gym', 'Fitness Centre', '2026-03-17', '8:00 AM'),
  makeSeed('d084', 'gym', 'Fitness Centre', '2026-03-17', '8:00 AM'),
  makeSeed('d085', 'gym', 'Fitness Centre', '2026-03-17', '9:00 AM'),
  makeSeed('d086', 'gym', 'Fitness Centre', '2026-03-17', '9:00 AM'),
  makeSeed('d087', 'gym', 'Fitness Centre', '2026-03-17', '9:00 AM'),
  makeSeed('d088', 'gym', 'Fitness Centre', '2026-03-17', '9:00 AM'),
  makeSeed('d089', 'gym', 'Fitness Centre', '2026-03-17', '9:00 AM'),
  makeSeed('d090', 'gym', 'Fitness Centre', '2026-03-17', '10:00 AM'),
  makeSeed('d091', 'gym', 'Fitness Centre', '2026-03-17', '10:00 AM'),
  makeSeed('d092', 'gym', 'Fitness Centre', '2026-03-17', '10:00 AM'),
  makeSeed('d093', 'gym', 'Fitness Centre', '2026-03-17', '11:00 AM'),
  makeSeed('d094', 'gym', 'Fitness Centre', '2026-03-17', '11:00 AM'),

  // ── Boardroom – March 13 (2 slots only, very limited) ─────────────────
  makeSeed('d100', 'boardroom', 'Meeting Rooms', '2026-03-13', '9:00 AM'),
  makeSeed('d101', 'boardroom', 'Meeting Rooms', '2026-03-13', '9:00 AM'),  // FULL (cap=2)
  makeSeed('d102', 'boardroom', 'Meeting Rooms', '2026-03-13', '10:00 AM'),
  makeSeed('d103', 'boardroom', 'Meeting Rooms', '2026-03-13', '1:00 PM'),
  makeSeed('d104', 'boardroom', 'Meeting Rooms', '2026-03-13', '2:00 PM'),
  makeSeed('d105', 'boardroom', 'Meeting Rooms', '2026-03-13', '2:00 PM'), // FULL

  // ── Swimming Pool – March 12 & 19 (popular) ───────────────────────────
  makeSeed('d110', 'swimming-pool', 'Swimming Pool Training', '2026-03-12', '8:00 AM'),
  makeSeed('d111', 'swimming-pool', 'Swimming Pool Training', '2026-03-12', '8:00 AM'),
  makeSeed('d112', 'swimming-pool', 'Swimming Pool Training', '2026-03-12', '8:00 AM'),
  makeSeed('d113', 'swimming-pool', 'Swimming Pool Training', '2026-03-12', '8:00 AM'), // FULL
  makeSeed('d114', 'swimming-pool', 'Swimming Pool Training', '2026-03-12', '9:00 AM'),
  makeSeed('d115', 'swimming-pool', 'Swimming Pool Training', '2026-03-12', '9:00 AM'),
  makeSeed('d116', 'swimming-pool', 'Swimming Pool Training', '2026-03-12', '9:00 AM'),
  makeSeed('d117', 'swimming-pool', 'Swimming Pool Training', '2026-03-19', '9:00 AM'),
  makeSeed('d118', 'swimming-pool', 'Swimming Pool Training', '2026-03-19', '9:00 AM'),
  makeSeed('d119', 'swimming-pool', 'Swimming Pool Training', '2026-03-19', '9:00 AM'),
  makeSeed('d120', 'swimming-pool', 'Swimming Pool Training', '2026-03-19', '9:00 AM'), // FULL
  makeSeed('d121', 'swimming-pool', 'Swimming Pool Training', '2026-03-19', '10:00 AM'),
  makeSeed('d122', 'swimming-pool', 'Swimming Pool Training', '2026-03-19', '10:00 AM'),
  makeSeed('d123', 'swimming-pool', 'Swimming Pool Training', '2026-03-19', '10:00 AM'),
]

// ── Seed bookings from mock data ───────────────────────────────────────
function seedBookings(): BookingRecord[] {
  const base: BookingRecord[] = [
    ...UPCOMING_BOOKINGS.map(b => ({
      id: b.id, reference: b.reference, service: b.service, serviceSlug: b.serviceSlug,
      serviceCategory: b.serviceCategory, resource: b.resource, staff: b.staff,
      date: b.date, time: b.time, endTime: b.endTime, duration: b.duration,
      guests: b.guests, status: b.status as BookingStatus, amount: b.amount,
      paymentMethod: b.paymentMethod, mpesaRef: b.mpesaRef, image: b.image,
      notes: b.notes, canReschedule: b.canReschedule, canCancel: b.canCancel,
      cancellationDeadline: b.cancellationDeadline, rating: null, review: null,
      bookedFor: null, services: [b.service], smsReminder: true,
    })),
    ...PAST_BOOKINGS.map(b => ({
      id: b.id, reference: b.reference, service: b.service, serviceSlug: b.serviceSlug,
      serviceCategory: '', resource: '', staff: '', date: b.date, time: b.time,
      endTime: '', duration: b.duration, guests: 1, status: b.status as BookingStatus,
      amount: b.amount, paymentMethod: b.paymentMethod, mpesaRef: null, image: b.image,
      notes: null, canReschedule: false, canCancel: false, cancellationDeadline: null,
      rating: b.rating, review: b.review, bookedFor: null, services: [b.service], smsReminder: true,
    })),
  ]

  const demo: BookingRecord[] = DEMO_BOOKINGS.map(b => ({
    id: b.id, reference: b.reference, service: b.service, serviceSlug: b.serviceSlug,
    serviceCategory: '', resource: '', staff: DEFAULT_SPECIALIST_BY_SERVICE[b.serviceSlug] ?? 'Ezra team',
    date: b.date, time: b.time,
    endTime: '', duration: '60 min', guests: 1, status: b.status, amount: 0,
    paymentMethod: null, mpesaRef: null, image: SERVICE_IMAGES[b.serviceSlug] ?? '/images/image-resizing-3.avif', notes: null,
    canReschedule: false, canCancel: false, cancellationDeadline: null,
    rating: null, review: null, bookedFor: null, services: [b.service], smsReminder: false,
  }))

  return [...base, ...demo]
}

// ── Context ────────────────────────────────────────────────────────────
interface BookingContextValue {
  bookings: BookingRecord[]
  staffBlocks: StaffBlock[]
  cancelBooking: (id: string) => void
  rescheduleBooking: (id: string, newDate: string, newTime: string) => void
  createBooking: (booking: Omit<BookingRecord, 'id' | 'reference'>) => BookingRecord
  addStaffBlock: (block: Omit<StaffBlock, 'id'>) => void
  removeStaffBlock: (id: string) => void
  getBlockedTimes: (staffName: string, date: string) => StaffBlock[]
  getBookedTimes: (date: string) => string[]
  /** Count confirmed bookings for a specific service + date + time */
  getSlotBookingCount: (date: string, time: string, serviceSlug: string) => number
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}

function generateRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'EZR-'
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

// ── Provider ───────────────────────────────────────────────────────────
export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<BookingRecord[]>(() => seedBookings())
  const [storageReady, setStorageReady] = useState(false)
  const [staffBlocks, setStaffBlocks] = useState<StaffBlock[]>(INITIAL_STAFF_BLOCKS)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as BookingRecord[]
        if (Array.isArray(parsed)) {
          setBookings(mergeStoredWithSeed(seedBookings(), parsed))
        }
      }
    } catch {
      /* ignore */
    }
    setStorageReady(true)
  }, [])

  useEffect(() => {
    if (!storageReady || typeof window === 'undefined') return
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))
    } catch {
      /* ignore */
    }
  }, [bookings, storageReady])

  const cancelBooking = useCallback((id: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === id ? { ...b, status: 'CANCELLED' as const, canReschedule: false, canCancel: false } : b
      )
    )
  }, [])

  const rescheduleBooking = useCallback((id: string, newDate: string, newTime: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === id
          ? {
              ...b,
              date: newDate,
              time: newTime,
              cancellationDeadline: computeCancellationDeadline(newDate, newTime),
            }
          : b
      )
    )
  }, [])

  const createBooking = useCallback((booking: Omit<BookingRecord, 'id' | 'reference'>) => {
    const staffName =
      booking.staff?.trim() ||
      DEFAULT_SPECIALIST_BY_SERVICE[booking.serviceSlug] ||
      'Ezra team'
    const newBooking: BookingRecord = {
      ...booking,
      staff: staffName,
      id: `bk-${Date.now()}`,
      reference: generateRef(),
    }
    setBookings(prev => [newBooking, ...prev])
    return newBooking
  }, [])

  const addStaffBlock = useCallback((block: Omit<StaffBlock, 'id'>) => {
    setStaffBlocks(prev => [...prev, { ...block, id: `sb-${Date.now()}` }])
  }, [])

  const removeStaffBlock = useCallback((id: string) => {
    setStaffBlocks(prev => prev.filter(b => b.id !== id))
  }, [])

  const getBlockedTimes = useCallback((staffName: string, date: string) => {
    return staffBlocks.filter(b => b.staffName === staffName && b.date === date)
  }, [staffBlocks])

  const getBookedTimes = useCallback((date: string) => {
    return bookings.filter(b => b.date === date && b.status !== 'CANCELLED').map(b => b.time)
  }, [bookings])

  const getSlotBookingCount = useCallback((date: string, time: string, serviceSlug: string) => {
    return bookings.filter(
      b => b.date === date && b.time === time && b.serviceSlug === serviceSlug && b.status !== 'CANCELLED'
    ).length
  }, [bookings])

  return (
    <BookingContext.Provider value={{
      bookings, staffBlocks,
      cancelBooking, rescheduleBooking, createBooking,
      addStaffBlock, removeStaffBlock,
      getBlockedTimes, getBookedTimes, getSlotBookingCount,
    }}>
      {children}
    </BookingContext.Provider>
  )
}
