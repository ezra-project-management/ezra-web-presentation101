'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { UPCOMING_BOOKINGS, PAST_BOOKINGS } from './dashboard-data'

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
  // New fields
  bookedFor: { name: string; phone: string } | null
  services: string[] // multi-service support
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
  { date: '2026-01-01', name: 'New Year\'s Day' },
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

// ── Closed Days (Sundays) ──────────────────────────────────────────────
export function isClosedDay(dateStr: string): string | null {
  const date = new Date(dateStr)
  if (date.getDay() === 0) return 'Closed on Sundays'
  const holiday = PUBLIC_HOLIDAYS.find(h => h.date === dateStr)
  if (holiday) return `Closed — ${holiday.name}`
  return null
}

// ── Initial Staff Blocks ───────────────────────────────────────────────
const INITIAL_STAFF_BLOCKS: StaffBlock[] = [
  { id: 'sb-001', staffName: 'Grace M.', date: '2026-03-15', startTime: '12:00 PM', endTime: '1:00 PM', reason: 'Lunch Break' },
  { id: 'sb-002', staffName: 'Coach Mike T.', date: '2026-03-18', startTime: '12:00 PM', endTime: '1:00 PM', reason: 'Lunch Break' },
]

// ── Seed bookings from mock data ───────────────────────────────────────
function seedBookings(): BookingRecord[] {
  const upcoming: BookingRecord[] = UPCOMING_BOOKINGS.map(b => ({
    id: b.id,
    reference: b.reference,
    service: b.service,
    serviceSlug: b.serviceSlug,
    serviceCategory: b.serviceCategory,
    resource: b.resource,
    staff: b.staff,
    date: b.date,
    time: b.time,
    endTime: b.endTime,
    duration: b.duration,
    guests: b.guests,
    status: b.status as BookingStatus,
    amount: b.amount,
    paymentMethod: b.paymentMethod,
    mpesaRef: b.mpesaRef,
    image: b.image,
    notes: b.notes,
    canReschedule: b.canReschedule,
    canCancel: b.canCancel,
    cancellationDeadline: b.cancellationDeadline,
    rating: null,
    review: null,
    bookedFor: null,
    services: [b.service],
    smsReminder: true,
  }))

  const past: BookingRecord[] = PAST_BOOKINGS.map(b => ({
    id: b.id,
    reference: b.reference,
    service: b.service,
    serviceSlug: b.serviceSlug,
    serviceCategory: '',
    resource: '',
    staff: '',
    date: b.date,
    time: b.time,
    endTime: '',
    duration: b.duration,
    guests: 1,
    status: b.status as BookingStatus,
    amount: b.amount,
    paymentMethod: b.paymentMethod,
    mpesaRef: null,
    image: b.image,
    notes: null,
    canReschedule: false,
    canCancel: false,
    cancellationDeadline: null,
    rating: b.rating,
    review: b.review,
    bookedFor: null,
    services: [b.service],
    smsReminder: true,
  }))

  return [...upcoming, ...past]
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
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}

// ── Generate reference ─────────────────────────────────────────────────
function generateRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'EZR-'
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

// ── Provider ───────────────────────────────────────────────────────────
export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<BookingRecord[]>(seedBookings)
  const [staffBlocks, setStaffBlocks] = useState<StaffBlock[]>(INITIAL_STAFF_BLOCKS)

  const cancelBooking = useCallback((id: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, status: 'CANCELLED' as const, canReschedule: false, canCancel: false }
          : b
      )
    )
  }, [])

  const rescheduleBooking = useCallback((id: string, newDate: string, newTime: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === id ? { ...b, date: newDate, time: newTime } : b
      )
    )
  }, [])

  const createBooking = useCallback((booking: Omit<BookingRecord, 'id' | 'reference'>) => {
    const newBooking: BookingRecord = {
      ...booking,
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
    return bookings
      .filter(b => b.date === date && b.status !== 'CANCELLED')
      .map(b => b.time)
  }, [bookings])

  return (
    <BookingContext.Provider
      value={{
        bookings,
        staffBlocks,
        cancelBooking,
        rescheduleBooking,
        createBooking,
        addStaffBlock,
        removeStaffBlock,
        getBlockedTimes,
        getBookedTimes,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}
