'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Lock, Phone, ChevronLeft, ChevronRight, Minus, Plus,
  UserPlus, X, AlertCircle, Bell, Check, Users, Clock,
  CalendarDays, ArrowRight, ChevronDown, Info, Zap, Star
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { SERVICES } from '@/lib/services'
import type { StaffMember } from '@/lib/services'
import {
  useBooking, isClosedDay,
  getServiceCapacity
} from '@/lib/booking-context'
import { computeCancellationDeadline, requiresDeposit } from '@/lib/booking-copy'
import { BookingCancellationNote } from '@/components/booking/BookingCancellationNote'
import {
  isVenueSlug,
  defaultVenueAttendees,
  maxVenueAttendees,
  minVenueAttendees,
} from '@/lib/venue-booking'

interface BookingWidgetProps {
  serviceName: string
  basePrice: number
  duration: string
  serviceSlug: string
}

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// ── Helpers ───────────────────────────────────────────────────────────
function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function getFirstDay(y: number, m: number) { return new Date(y, m, 1).getDay() }

type SlotStatus = 'available' | 'few' | 'full' | 'closed'

function getSlotStatus(booked: number, capacity: number): SlotStatus {
  if (booked >= capacity) return 'full'
  if (booked >= capacity - 1) return 'few'
  return 'available'
}

const STATUS = {
  available: {
    card: 'border-emerald-200 bg-emerald-50/60 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer',
    selected: 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-300/40',
    badge: 'bg-emerald-100 text-emerald-700',
    text: 'text-emerald-700',
    bar: 'bg-emerald-400',
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-100 text-emerald-700',
  },
  few: {
    card: 'border-amber-200 bg-amber-50/60 hover:border-amber-400 hover:bg-amber-50 cursor-pointer',
    selected: 'border-amber-400 bg-amber-50 ring-2 ring-amber-300/40',
    badge: 'bg-amber-100 text-amber-700',
    text: 'text-amber-700',
    bar: 'bg-amber-400',
    dot: 'bg-amber-500',
    pill: 'bg-amber-100 text-amber-700',
  },
  full: {
    card: 'border-red-200 bg-red-50/40 cursor-not-allowed opacity-75',
    selected: '',
    badge: 'bg-red-100 text-red-600',
    text: 'text-red-600',
    bar: 'bg-red-400',
    dot: 'bg-red-400',
    pill: 'bg-red-100 text-red-600',
  },
  closed: {
    card: 'border-gray-200 bg-gray-50/50 cursor-not-allowed opacity-60',
    selected: '',
    badge: 'bg-gray-100 text-gray-500',
    text: 'text-gray-400',
    bar: 'bg-gray-300',
    dot: 'bg-gray-400',
    pill: 'bg-gray-100 text-gray-500',
  },
}

// ── Step Indicator ────────────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  const steps = [{ n: 1, label: 'Date' }, { n: 2, label: 'Who' }, { n: 3, label: 'Slot' }, { n: 4, label: 'Confirm' }]
  return (
    <div className="flex items-center justify-center gap-2 mb-5">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-0.5">
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
              step > s.n ? 'bg-emerald-500 text-white' :
              step === s.n ? 'bg-gold text-navy-dark ring-4 ring-gold/20' :
              'bg-charcoal/10 text-charcoal/40'
            )}>
              {step > s.n ? <Check className="w-3.5 h-3.5" /> : s.n}
            </div>
            <span className={cn('text-[10px] font-medium', step >= s.n ? 'text-charcoal/60' : 'text-charcoal/25')}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('w-6 h-px mb-4 transition-all duration-300', step > s.n ? 'bg-emerald-300' : 'bg-charcoal/15')} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Mini Calendar ─────────────────────────────────────────────────────
function MiniCalendar({
  selectedDate, onSelect,
  getDateAvailability,
}: {
  selectedDate: string
  onSelect: (d: string) => void
  /** Returns 'open' | 'partial' | 'busy' | 'closed' for a date */
  getDateAvailability: (date: string) => 'open' | 'partial' | 'busy' | 'closed'
}) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDay(viewYear, viewMonth)

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }

  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-charcoal/8 transition-colors">
          <ChevronLeft className="w-4 h-4 text-charcoal/50" />
        </button>
        <span className="font-display text-base font-semibold text-navy">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-charcoal/8 transition-colors">
          <ChevronRight className="w-4 h-4 text-charcoal/50" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-charcoal/35 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />
          const dateStr = toDateStr(viewYear, viewMonth, day)
          const isPast = dateStr < todayStr
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const avail = isPast ? 'closed' : getDateAvailability(dateStr)
          const disabled = isPast || avail === 'closed'

          // Dot color for availability hint
          const dotColor = avail === 'busy' ? 'bg-red-400' : avail === 'partial' ? 'bg-amber-400' : avail === 'closed' ? 'bg-red-400' : ''

          return (
            <button
              key={dateStr}
              disabled={disabled}
              onClick={() => !disabled && onSelect(dateStr)}
              className={cn(
                'relative w-full aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all duration-150',
                disabled ? 'text-charcoal/20 cursor-not-allowed' :
                isSelected ? 'bg-gold text-navy-dark shadow-gold font-bold' :
                isToday ? 'ring-2 ring-gold/50 text-gold font-bold hover:bg-gold/10' :
                'text-charcoal hover:bg-gold/8 hover:text-navy'
              )}
            >
              <span>{day}</span>
              {/* Availability dot */}
              {!isPast && dotColor && !isSelected && (
                <span className={cn('w-1 h-1 rounded-full mt-0.5', dotColor)} />
              )}
              {/* Today gold dot */}
              {isToday && !isSelected && (
                <span className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-gold" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-charcoal/8">
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold" /><span className="text-[10px] text-charcoal/45">Today</span></div>
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /><span className="text-[10px] text-charcoal/45">Partial</span></div>
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /><span className="text-[10px] text-charcoal/45">Busy / Closed</span></div>
      </div>
    </div>
  )
}

// ── Slot Card ─────────────────────────────────────────────────────────
function SlotCard({
  time, booked, capacity, isSelected, isClosed, onClick,
}: {
  time: string; booked: number; capacity: number
  isSelected: boolean; isClosed: boolean; onClick: () => void
}) {
  const status: SlotStatus = isClosed ? 'closed' : getSlotStatus(booked, capacity)
  const s = STATUS[status]
  const available = Math.max(0, capacity - booked)
  const pct = Math.min(booked / capacity, 1)

  const statusLabel =
    status === 'full' ? 'Fully booked' :
    status === 'closed' ? 'Unavailable' :
    status === 'few' ? `Last spot!` :
    `${available} spot${available !== 1 ? 's' : ''} left`

  return (
    <button
      disabled={status === 'full' || status === 'closed'}
      onClick={onClick}
      title={status === 'full' ? 'This slot is fully booked' : undefined}
      className={cn(
        'relative w-full rounded-xl border-2 p-3 text-left transition-all duration-200',
        s.card,
        isSelected && status !== 'full' && status !== 'closed' ? s.selected : ''
      )}
    >
      {/* Selected tick */}
      {isSelected && status !== 'full' && status !== 'closed' && (
        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gold flex items-center justify-center shadow">
          <Check className="w-3 h-3 text-navy-dark" />
        </span>
      )}

      {/* Time */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <Clock className={cn('w-3.5 h-3.5 shrink-0', s.text)} />
        <span className={cn('text-sm font-bold', s.text)}>{time}</span>
      </div>

      {/* Seat icons */}
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: capacity }).map((_, i) => (
          <div key={i} className={cn(
            'w-5 h-5 rounded flex items-center justify-center transition-colors',
            i < booked
              ? status === 'full' ? 'bg-red-400' : 'bg-amber-400'
              : 'bg-white/70 border border-charcoal/10'
          )}>
            <Users className={cn('w-2.5 h-2.5', i < booked ? 'text-white' : 'text-charcoal/25')} />
          </div>
        ))}
        <span className={cn('ml-1 text-[11px] font-medium', s.text)}>
          {booked}/{capacity}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-white/60 overflow-hidden mb-2">
        <div className={cn('h-full rounded-full transition-all duration-500', s.bar)} style={{ width: `${pct * 100}%` }} />
      </div>

      {/* Status */}
      <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-md', s.pill)}>
        <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
        {statusLabel}
      </span>
    </button>
  )
}

// ── Service Availability Badge (used in Step 3 for added services) ────
function ServiceAvailBadge({
  svc, date, time, onRemove,
}: {
  svc: typeof SERVICES[number]
  date: string
  time: string
  onRemove: () => void
}) {
  const { getSlotBookingCount } = useBooking()
  const capacity = getServiceCapacity(svc.slug)
  const booked = getSlotBookingCount(date, time, svc.slug)
  const status = getSlotStatus(booked, capacity)
  const s = STATUS[status]
  const available = Math.max(0, capacity - booked)

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
      status === 'full'
        ? 'border-red-200 bg-red-50/60'
        : status === 'few'
        ? 'border-amber-200 bg-amber-50/50'
        : 'border-emerald-200 bg-emerald-50/50'
    )}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-sans text-sm font-semibold text-navy truncate">{svc.name}</p>
          <span className={cn('inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full', s.pill)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
            {status === 'full' ? 'FULL' : status === 'few' ? 'Last spot' : `${available} left`}
          </span>
        </div>
        <p className="font-sans text-xs text-charcoal/50 mt-0.5">
          {time} · {booked}/{capacity} booked · +{formatCurrency(svc.basePrice)}
        </p>
        {status === 'full' && (
          <p className="flex items-center gap-1 text-[11px] text-red-600 font-medium mt-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            No spots at this time — remove or change slot
          </p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-charcoal/30 hover:bg-red-100 hover:text-red-500 transition-colors shrink-0"
        title="Remove service"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Service Picker Modal ───────────────────────────────────────────────
function ServicePicker({
  otherServices, selected, date, time, onToggle, onClose,
}: {
  otherServices: typeof SERVICES
  selected: string[]
  date: string
  time: string
  onToggle: (slug: string, name: string) => void
  onClose: () => void
}) {
  const { getSlotBookingCount } = useBooking()

  return (
    <div className="mt-3 rounded-xl border border-charcoal/15 shadow-lg bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-charcoal/8 bg-navy/3">
        <p className="font-sans text-sm font-semibold text-navy">Add services at {time}</p>
        <button onClick={onClose} className="text-charcoal/40 hover:text-navy transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="divide-y divide-charcoal/5 max-h-64 overflow-y-auto">
        {otherServices.map(svc => {
          const capacity = getServiceCapacity(svc.slug)
          const booked = getSlotBookingCount(date, time, svc.slug)
          const status = getSlotStatus(booked, capacity)
          const s = STATUS[status]
          const isChecked = selected.includes(svc.slug)
          const isFull = status === 'full'

          return (
            <label
              key={svc.id}
              className={cn(
                'flex items-center gap-3 px-4 py-3 transition-all cursor-pointer',
                isFull ? 'opacity-60 cursor-not-allowed' :
                isChecked ? 'bg-gold/5' : 'hover:bg-charcoal/3'
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                disabled={isFull && !isChecked}
                onChange={() => !isFull || isChecked ? onToggle(svc.slug, svc.name) : null}
              />
              {/* Custom checkbox */}
              <div className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                isChecked ? 'border-gold bg-gold' : 'border-charcoal/20'
              )}>
                {isChecked && <Check className="w-3 h-3 text-navy-dark" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-sans text-sm font-medium text-navy truncate">{svc.name}</p>
                  <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', s.pill)}>
                    {status === 'full' ? 'FULL' : status === 'few' ? 'Last spot' : `${capacity - booked} left`}
                  </span>
                </div>
                <p className="font-sans text-xs text-charcoal/50">{svc.duration}</p>
              </div>

              {/* Mini seat viz */}
              <div className="flex items-center gap-0.5 shrink-0">
                {Array.from({ length: Math.min(capacity, 6) }).map((_, i) => (
                  <div key={i} className={cn('w-3 h-3 rounded-sm',
                    i < booked
                      ? status === 'full' ? 'bg-red-400' : 'bg-amber-400'
                      : 'bg-charcoal/10'
                  )} />
                ))}
              </div>

              <span className="font-sans text-sm font-semibold text-gold shrink-0">+{formatCurrency(svc.basePrice)}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Widget ───────────────────────────────────────────────────────
export function BookingWidget({ serviceName, basePrice, duration, serviceSlug }: BookingWidgetProps) {
  const router = useRouter()
  const { createBooking, getSlotBookingCount } = useBooking()

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [guests, setGuests] = useState(1)
  const [venueAttendees, setVenueAttendees] = useState(() => defaultVenueAttendees(serviceSlug))
  const [venueEventNotes, setVenueEventNotes] = useState('')
  const [showRequest, setShowRequest] = useState(false)
  const [specialRequest, setSpecialRequest] = useState('')
  const [smsReminder, setSmsReminder] = useState(true)
  const [showServicePicker, setShowServicePicker] = useState(false)
  const [bookingForOther, setBookingForOther] = useState(false)
  const [otherName, setOtherName] = useState('')
  const [otherPhone, setOtherPhone] = useState('')

  // Added services stored as { slug, name } pairs
  const [addedServices, setAddedServices] = useState<{ slug: string; name: string }[]>([])

  const currentService = SERVICES.find(s => s.slug === serviceSlug)
  const serviceStaff = currentService?.staff ?? []
  const otherServices = SERVICES.filter(s => s.slug !== serviceSlug)
  const closedReason = selectedDate ? isClosedDay(selectedDate) : null
  const mainCapacity = getServiceCapacity(serviceSlug)
  const isVenue = isVenueSlug(serviceSlug)
  const needsDeposit = requiresDeposit(serviceSlug)

  useEffect(() => {
    setVenueAttendees(defaultVenueAttendees(serviceSlug))
    setVenueEventNotes('')
  }, [serviceSlug])

  // Per-slot booking counts for current service on selected date
  const slotCounts = useMemo(() => {
    if (!selectedDate) return {} as Record<string, number>
    return TIME_SLOTS.reduce<Record<string, number>>((acc, t) => {
      acc[t] = getSlotBookingCount(selectedDate, t, serviceSlug)
      return acc
    }, {})
  }, [selectedDate, getSlotBookingCount, serviceSlug])

  // Calendar availability hint per date (for this service)
  const getDateAvailability = useCallback((dateStr: string): 'open' | 'partial' | 'busy' | 'closed' => {
    if (isClosedDay(dateStr)) return 'closed'
    const slotStatuses = TIME_SLOTS.map(t => {
      const c = getSlotBookingCount(dateStr, t, serviceSlug)
      return getSlotStatus(c, mainCapacity)
    })
    const fullCount = slotStatuses.filter(s => s === 'full').length
    if (fullCount === TIME_SLOTS.length) return 'busy'
    if (fullCount > 3 || slotStatuses.filter(s => s === 'few').length > 3) return 'partial'
    return 'open'
  }, [getSlotBookingCount, serviceSlug, mainCapacity])

  const totalPrice = useMemo(() => {
    let total = basePrice
    addedServices.forEach(({ slug }) => {
      const svc = SERVICES.find(s => s.slug === slug)
      if (svc) total += svc.basePrice
    })
    if (isVenue) return total
    return total * guests
  }, [basePrice, addedServices, guests, isVenue])

  const parseMins = (d: string) => {
    const m = d.match(/(\d+)\s*min/i); if (m) return parseInt(m[1])
    const h = d.match(/(\d+)\s*hr/i); if (h) return parseInt(h[1]) * 60
    return 60
  }

  const totalDuration = useMemo(() => {
    let mins = parseMins(duration)
    addedServices.forEach(({ slug }) => {
      const svc = SERVICES.find(s => s.slug === slug)
      if (svc) mins += parseMins(svc.duration)
    })
    if (mins >= 60) { const h = Math.floor(mins / 60); const m = mins % 60; return m > 0 ? `${h}h ${m}m` : `${h}h` }
    return `${mins}m`
  }, [duration, addedServices])

  const toggleService = (slug: string, name: string) => {
    setAddedServices(prev =>
      prev.find(s => s.slug === slug) ? prev.filter(s => s.slug !== slug) : [...prev, { slug, name }]
    )
  }

  // Does any added service have no availability at selected time?
  const conflictingServices = useMemo(() => {
    if (!selectedDate || !selectedTime) return []
    return addedServices.filter(({ slug }) => {
      const cap = getServiceCapacity(slug)
      const booked = getSlotBookingCount(selectedDate, selectedTime, slug)
      return booked >= cap
    })
  }, [addedServices, selectedDate, selectedTime, getSlotBookingCount])

  const availableSlotCount = useMemo(() => {
    if (!selectedDate || closedReason) return 0
    return TIME_SLOTS.filter(t => (slotCounts[t] ?? 0) < mainCapacity).length
  }, [selectedDate, slotCounts, closedReason, mainCapacity])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime('')
    // If service has staff, go to staff selection; otherwise go straight to slots
    if (serviceStaff.length > 0) {
      setStep(2)
    } else {
      setStep(3)
    }
  }
  const handleStaffSelect = (staff: StaffMember | null) => { setSelectedStaff(staff); setStep(3) }
  const handleSlotSelect = (time: string) => { setSelectedTime(time); setStep(4) }

  const handleBook = () => {
    if (!selectedDate || !selectedTime) { toast.error('Please select a date and time'); return }
    if (closedReason) { toast.error(closedReason); return }
    if (conflictingServices.length > 0) {
      toast.error(`Some services are fully booked at ${selectedTime}. Please remove them or change your time.`)
      return
    }
    if (bookingForOther && (!otherName.trim() || !otherPhone.trim())) {
      toast.error("Please fill in the details of the person you're booking for"); return
    }
    if (isVenue) {
      const cap = maxVenueAttendees(serviceSlug)
      const n = Math.min(cap, Math.max(minVenueAttendees(serviceSlug), Math.round(venueAttendees) || 1))
      if (n < 1) {
        toast.error('Enter how many guests you expect.')
        return
      }
    }
    const allServices = [serviceName, ...addedServices.map(s => s.name)]

    const headcount = isVenue
      ? Math.min(maxVenueAttendees(serviceSlug), Math.max(minVenueAttendees(serviceSlug), Math.round(venueAttendees) || 1))
      : guests

    let combinedNotes = specialRequest?.trim() || null
    if (isVenue && venueEventNotes.trim()) {
      const ev = venueEventNotes.trim()
      combinedNotes = combinedNotes ? `${combinedNotes}\n\nEvent details: ${ev}` : `Event details: ${ev}`
    }

    const bookingStatus = needsDeposit ? 'PENDING_PAYMENT' as const : 'CONFIRMED' as const

    createBooking({
      service: allServices.length > 1 ? allServices.join(' + ') : serviceName,
      serviceSlug, serviceCategory: currentService?.category || '',
      resource: '', staff: selectedStaff?.name || '', date: selectedDate, time: selectedTime, endTime: '',
      duration: totalDuration, guests: headcount, status: bookingStatus, amount: totalPrice,
      paymentMethod: needsDeposit ? null : 'Pay at service', mpesaRef: needsDeposit ? null : null,
      image: currentService?.image || '', notes: combinedNotes,
      canReschedule: true, canCancel: true,
      cancellationDeadline: computeCancellationDeadline(selectedDate, selectedTime),
      rating: null, review: null,
      bookedFor: bookingForOther ? { name: otherName, phone: otherPhone } : null,
      services: allServices, smsReminder,
      eventNotes: isVenue ? (venueEventNotes.trim() || null) : null,
    })

    toast.success(needsDeposit ? 'Booking created. Please complete your 50% deposit.' : 'Booking confirmed! Redirecting...')
    setTimeout(() => router.push('/dashboard/booking-confirmed'), 500)
  }

  const mainSlotStatus = selectedTime ? getSlotStatus(slotCounts[selectedTime] ?? 0, mainCapacity) : 'available'

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gold/20 p-6 sticky top-24">
      {/* Header */}
      <h3 className="font-display text-xl font-semibold text-navy">Book This Service</h3>
      <div className="mt-1 mb-5">
        <p className="font-display text-2xl text-gold font-semibold">Starting from {formatCurrency(basePrice)}</p>
        <p className="font-sans text-sm text-charcoal/50">{duration}</p>
      </div>

      <StepIndicator step={step} />

      {/* ── STEP 1: Calendar ─────────────────────────────── */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-4 h-4 text-gold" />
            <p className="font-sans text-sm font-semibold text-navy">Pick a date</p>
          </div>
          <MiniCalendar
            selectedDate={selectedDate}
            onSelect={handleDateSelect}
            getDateAvailability={getDateAvailability}
          />
          {/* Hint */}
          <div className="mt-4 flex items-start gap-2 px-3 py-2.5 bg-navy/4 rounded-xl">
            <Info className="w-3.5 h-3.5 text-charcoal/40 mt-0.5 shrink-0" />
            <p className="font-sans text-xs text-charcoal/50 leading-relaxed">
              Calendar dots show availability for <strong>{serviceName}</strong>.
              You can add more services after choosing a slot.
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 2: Staff Selection ──────────────────────── */}
      {step === 2 && serviceStaff.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-charcoal/45 hover:text-navy transition-colors">
              <ChevronLeft className="w-4 h-4" /> Change date
            </button>
          </div>
          <p className="font-sans text-sm font-semibold text-navy mb-1">Who would you like?</p>
          <p className="font-sans text-xs text-charcoal/50 mb-4">Pick the person you want to handle your session, or skip and we&apos;ll assign the next available team member.</p>

          <div className="space-y-3">
            {serviceStaff.map(member => (
              <button
                key={member.id}
                onClick={() => handleStaffSelect(member)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200',
                  selectedStaff?.id === member.id
                    ? 'border-gold bg-gold/5 ring-2 ring-gold/20'
                    : 'border-charcoal/10 hover:border-gold/50 hover:bg-gold/3'
                )}
              >
                <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-semibold text-navy">{member.name}</p>
                  <p className="font-sans text-xs text-charcoal/50">{member.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-gold fill-gold" />
                    <span className="font-sans text-xs font-semibold text-navy">{member.rating}</span>
                    <span className="font-sans text-xs text-charcoal/40">({member.reviewCount} reviews)</span>
                  </div>
                </div>
                {selectedStaff?.id === member.id && (
                  <span className="w-6 h-6 rounded-full bg-gold flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-navy-dark" />
                  </span>
                )}
              </button>
            ))}

            {/* No preference option */}
            <button
              onClick={() => handleStaffSelect(null)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-charcoal/15 text-left hover:border-gold/40 hover:bg-gold/3 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-full bg-charcoal/8 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-charcoal/40" />
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-navy">No preference</p>
                <p className="font-sans text-xs text-charcoal/50">We&apos;ll assign the next available team member</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Slot Grid ────────────────────────────── */}
      {step === 3 && selectedDate && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Date pill + back */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setStep(serviceStaff.length > 0 ? 2 : 1)} className="flex items-center gap-1 text-sm text-charcoal/45 hover:text-navy transition-colors">
              <ChevronLeft className="w-4 h-4" /> {serviceStaff.length > 0 ? 'Change person' : 'Change date'}
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 rounded-full">
              <CalendarDays className="w-3.5 h-3.5 text-gold" />
              <span className="font-sans text-xs font-bold text-navy">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>

          {closedReason ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <p className="font-sans text-sm font-semibold text-red-700">Day Unavailable</p>
                <p className="font-sans text-xs text-red-500 mt-0.5">{closedReason}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <p className="font-sans text-sm font-semibold text-navy">{serviceName}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-charcoal/50">{availableSlotCount}/{TIME_SLOTS.length} open</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 mb-3">
                {[{ dot: 'bg-emerald-500', l: 'Available' }, { dot: 'bg-amber-500', l: 'Last spot' }, { dot: 'bg-red-400', l: 'Full' }].map(x => (
                  <div key={x.l} className="flex items-center gap-1.5">
                    <span className={cn('w-1.5 h-1.5 rounded-full', x.dot)} />
                    <span className="text-[11px] text-charcoal/45">{x.l}</span>
                  </div>
                ))}
              </div>

              {/* Slot cards */}
              <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-0.5">
                {TIME_SLOTS.map(time => (
                  <SlotCard
                    key={time}
                    time={time}
                    booked={slotCounts[time] ?? 0}
                    capacity={mainCapacity}
                    isSelected={selectedTime === time}
                    isClosed={false}
                    onClick={() => handleSlotSelect(time)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── STEP 4: Confirm ──────────────────────────────── */}
      {step === 4 && selectedDate && selectedTime && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">

          {/* Selection summary */}
          <div className="p-4 rounded-xl bg-navy/4 border border-navy/8">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-sans text-xs text-charcoal/45 mb-0.5">Your selection</p>
                <p className="font-display text-base font-semibold text-navy">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span className="font-sans text-sm font-bold text-gold">{selectedTime}</span>
                  {/* Main service availability at chosen time */}
                  <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1', STATUS[mainSlotStatus].pill)}>
                    {STATUS[mainSlotStatus].dot && <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1', STATUS[mainSlotStatus].dot)} />}
                    {mainSlotStatus === 'full' ? 'Full' : mainSlotStatus === 'few' ? 'Last spot' : 'Available'}
                  </span>
                </div>
                {selectedStaff && (
                  <div className="flex items-center gap-2 mt-2">
                    <img src={selectedStaff.avatar} alt={selectedStaff.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-sans text-xs text-charcoal/60">with <strong className="text-navy">{selectedStaff.name}</strong></span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setStep(3)}
                className="text-xs text-gold hover:text-gold-dark underline transition-colors shrink-0 mt-0.5"
              >
                Change
              </button>
            </div>
          </div>

          {/* ── Multi-service section ─────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-sans text-sm font-semibold text-navy">Services</p>
              {addedServices.length > 0 && (
                <span className="text-xs font-medium text-gold">
                  {addedServices.length + 1} service{addedServices.length + 1 > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Main service chip */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy/5 mb-2">
              <div className="w-1.5 h-5 rounded-full bg-gold shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium text-navy">{serviceName}</p>
                <p className="font-sans text-xs text-charcoal/45">{duration} · {formatCurrency(basePrice)}</p>
              </div>
              <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', STATUS[mainSlotStatus].pill)}>
                {mainSlotStatus === 'full' ? 'Full' : mainSlotStatus === 'few' ? 'Last spot' : 'Available'}
              </span>
            </div>

            {/* Added service badges */}
            {addedServices.map(({ slug, name }) => {
              const svc = SERVICES.find(s => s.slug === slug)
              if (!svc) return null
              return (
                <div key={slug} className="mb-2">
                  <ServiceAvailBadge
                    svc={svc}
                    date={selectedDate}
                    time={selectedTime}
                    onRemove={() => toggleService(slug, name)}
                  />
                </div>
              )
            })}

            {/* Conflict warning */}
            {conflictingServices.length > 0 && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="font-sans text-xs text-red-700">
                  <strong>{conflictingServices.length} service{conflictingServices.length > 1 ? 's are' : ' is'} fully booked</strong> at {selectedTime}.
                  Remove {conflictingServices.length > 1 ? 'them' : 'it'} or{' '}
                  <button onClick={() => setStep(3)} className="underline font-semibold">pick a different slot</button>.
                </p>
              </div>
            )}

            {/* Add another service button */}
            <button
              onClick={() => setShowServicePicker(!showServicePicker)}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border-2 border-dashed border-gold/30 text-gold hover:border-gold hover:bg-gold/4 transition-all font-sans text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add another service
              <ChevronDown className={cn('w-4 h-4 ml-auto transition-transform', showServicePicker && 'rotate-180')} />
            </button>

            {showServicePicker && (
              <ServicePicker
                otherServices={otherServices}
                selected={addedServices.map(s => s.slug)}
                date={selectedDate}
                time={selectedTime}
                onToggle={toggleService}
                onClose={() => setShowServicePicker(false)}
              />
            )}
          </div>

          {/* Duration + price summary */}
          {(addedServices.length > 0 || (!isVenue && guests > 1) || isVenue) && (
            <div className="p-3 rounded-xl bg-navy/4 border border-navy/8 space-y-1.5">
              {addedServices.length > 0 && (
                <div className="flex justify-between font-sans text-xs text-charcoal/60">
                  <span>Total duration</span><span className="font-semibold text-navy">{totalDuration}</span>
                </div>
              )}
              <div className="flex justify-between font-sans text-sm">
                <span className="text-charcoal/60">Total amount</span>
                <span className="font-bold text-navy">{formatCurrency(totalPrice)}</span>
              </div>
              {isVenue && (
                <p className="font-sans text-xs text-charcoal/50">
                  Space hire for your date &amp; time — not multiplied by guest count. Add-ons are itemised above.
                </p>
              )}
              {!isVenue && guests > 1 && (
                <p className="font-sans text-xs text-charcoal/40">
                  {guests} guests × {formatCurrency(totalPrice / guests)} each
                </p>
              )}
            </div>
          )}

          {/* Headcount: venues vs wellness party size */}
          {isVenue ? (
            <div className="space-y-3 rounded-xl border border-gold/25 bg-gradient-to-br from-navy/[0.04] to-cream/30 p-4">
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="font-sans text-sm font-semibold text-navy">Expected guests</p>
                  <p className="font-sans text-xs text-charcoal/50 mt-0.5">
                    Helps our team plan seating, catering, and safety. Max {maxVenueAttendees(serviceSlug)} for this space.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="number"
                  min={minVenueAttendees(serviceSlug)}
                  max={maxVenueAttendees(serviceSlug)}
                  value={venueAttendees}
                  onChange={(e) => setVenueAttendees(Number(e.target.value))}
                  className="w-28 px-3 py-2 rounded-lg border border-charcoal/20 font-sans text-sm font-semibold text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                />
                <span className="font-sans text-xs text-charcoal/45">people</span>
              </div>
              <div>
                <label className="font-sans text-xs font-semibold text-charcoal/50 uppercase tracking-wide">Event details (optional)</label>
                <textarea
                  value={venueEventNotes}
                  onChange={(e) => setVenueEventNotes(e.target.value)}
                  placeholder="Layout (theatre, banquet, dance floor), AV, catering, timeline…"
                  rows={3}
                  className="mt-2 w-full px-4 py-3 border border-charcoal/20 rounded-xl font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block font-sans text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-2">Guests</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-9 h-9 rounded-lg border border-charcoal/20 flex items-center justify-center hover:border-gold transition-colors" aria-label="−">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-sans text-lg font-bold w-8 text-center text-navy">{guests}</span>
                <button onClick={() => setGuests(Math.min(20, guests + 1))}
                  className="w-9 h-9 rounded-lg border border-charcoal/20 flex items-center justify-center hover:border-gold transition-colors" aria-label="+">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Book for someone else */}
          <div>
            <button onClick={() => setBookingForOther(!bookingForOther)}
              className="flex items-center gap-2 font-sans text-sm text-gold hover:text-gold-dark transition-colors">
              <UserPlus className="w-4 h-4" />
              {bookingForOther ? 'Booking for myself' : 'Book for someone else'}
            </button>
            {bookingForOther && (
              <div className="mt-3 space-y-3 p-4 bg-cream/60 rounded-xl border border-gold/10">
                <p className="font-sans text-xs text-charcoal/55">Enter the details of the person this booking is for</p>
                <input type="text" value={otherName} onChange={e => setOtherName(e.target.value)} placeholder="Full name"
                  className="w-full px-4 py-2.5 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition" />
                <input type="tel" value={otherPhone} onChange={e => setOtherPhone(e.target.value)} placeholder="Phone (e.g. +254...)"
                  className="w-full px-4 py-2.5 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition" />
              </div>
            )}
          </div>

          {/* SMS reminder */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 font-sans text-sm text-navy cursor-pointer">
              <Bell className="w-4 h-4 text-charcoal/40" /> SMS Reminder
            </label>
            <button onClick={() => setSmsReminder(!smsReminder)}
              className={cn('relative w-11 h-6 rounded-full transition-colors duration-200', smsReminder ? 'bg-gold' : 'bg-charcoal/20')}>
              <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200', smsReminder && 'translate-x-5')} />
            </button>
          </div>
          {smsReminder && <p className="-mt-2 font-sans text-xs text-charcoal/40">We&apos;ll send you a reminder 24 hours before</p>}

          {/* Special request */}
          <div>
            <button onClick={() => setShowRequest(!showRequest)}
              className="flex items-center gap-2 font-sans text-sm text-gold hover:text-gold-dark transition-colors">
              <ChevronDown className={cn('w-4 h-4 transition-transform', showRequest && 'rotate-180')} />
              Add special request
            </button>
            {showRequest && (
              <textarea value={specialRequest} onChange={e => setSpecialRequest(e.target.value)}
                placeholder="Any special requirements..."
                className="mt-3 w-full px-4 py-3 border border-charcoal/20 rounded-xl font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition resize-none h-24" />
            )}
          </div>

          {/* Confirm CTA */}
          <button
            onClick={handleBook}
            disabled={conflictingServices.length > 0}
            className={cn(
              'w-full py-4 font-sans font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2',
              conflictingServices.length > 0
                ? 'bg-charcoal/10 text-charcoal/40 cursor-not-allowed'
                : 'bg-gold text-navy-dark hover:bg-gold-light shadow-gold hover:shadow-lg'
            )}
          >
            {conflictingServices.length > 0
              ? 'Resolve conflicts to continue'
              : addedServices.length > 0
              ? <><Zap className="w-4 h-4" /> Confirm {addedServices.length + 1} Services</>
              : <><span>Confirm Booking</span><ArrowRight className="w-4 h-4" /></>
            }
          </button>

          <div className="rounded-xl border border-gold/25 bg-navy/[0.02] p-3">
            <p className="font-sans text-xs uppercase tracking-wide text-gold-dark font-semibold">Deposit policy</p>
            <p className="font-sans text-xs text-charcoal/70 mt-1 leading-relaxed">
              50% upfront deposit applies to Meeting Rooms, Ballroom, Banquet Hall, and Gym Membership bookings.
              Salon &amp; Spa, Barbershop, and Swimming Pool walk-ins pay at point of service.
            </p>
          </div>

          <BookingCancellationNote
            status="CONFIRMED"
            cancellationDeadline={computeCancellationDeadline(selectedDate, selectedTime)}
            serviceSlug={serviceSlug}
            variant="inline"
          />

          {/* Trust */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <p className="flex items-center gap-1.5 font-sans text-xs text-charcoal/45"><Lock className="w-3.5 h-3.5" /> Secure M-Pesa</p>
            <p className="flex items-center gap-1.5 font-sans text-xs text-charcoal/45"><Phone className="w-3.5 h-3.5" /> Instant SMS</p>
          </div>
        </div>
      )}
    </div>
  )
}
