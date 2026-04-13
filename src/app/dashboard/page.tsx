'use client'

import { useMemo, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays,
  Star,
  TrendingUp,
  ArrowRight,
  QrCode,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Crown,
  Plus,
  Check,
  X,
} from 'lucide-react'
import CountUp from 'react-countup'
import { toast } from 'sonner'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import { formatCurrency, formatServicePrice } from '@/lib/utils'
import { SERVICES } from '@/lib/services'
import type { Service } from '@/lib/services'
import {
  CURRENT_USER,
  SPENDING_CHART_DATA,
  SERVICE_HISTORY_CHART,
} from '@/lib/dashboard-data'
import { useBooking, isClosedDay, getServiceCapacity } from '@/lib/booking-context'

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const statusStyles: Record<string, string> = {
  CONFIRMED: 'text-emerald-600',
  PENDING_PAYMENT: 'text-amber-600',
  COMPLETED: 'text-navy',
  CANCELLED: 'text-gray-400',
}

const statusDot: Record<string, string> = {
  CONFIRMED: 'bg-emerald-500',
  PENDING_PAYMENT: 'bg-amber-500 animate-pulse-dot',
  COMPLETED: 'bg-navy',
  CANCELLED: 'bg-gray-400',
}

const statusLabel: Record<string, string> = {
  CONFIRMED: 'Confirmed',
  PENDING_PAYMENT: 'Pending Payment',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export default function DashboardPage() {
  const greeting = useMemo(() => getGreeting(), [])
  const { bookings, createBooking, getSlotBookingCount } = useBooking()
  const upcomingBookings = useMemo(() =>
    bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING_PAYMENT'),
    [bookings]
  )
  const pastBookings = useMemo(() =>
    bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED'),
    [bookings]
  )
  const nextBooking = upcomingBookings[0] ?? null
  const otherUpcoming = upcomingBookings.slice(1)
  const [qrOpen, setQrOpen] = useState(false)
  const [showAllUpcoming, setShowAllUpcoming] = useState(false)
  const router = useRouter()

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }, [calendarMonth])

  const bookingDates = useMemo(() => {
    const dates = new Set<string>()
    upcomingBookings.forEach(b => dates.add(b.date))
    return dates
  }, [upcomingBookings])

  const todayStr = useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }, [])

  const getDayDateStr = useCallback((day: number) => {
    return `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }, [calendarMonth])

  const isToday = useCallback((day: number) => getDayDateStr(day) === todayStr, [getDayDateStr, todayStr])

  const hasBooking = useCallback((day: number) => bookingDates.has(getDayDateStr(day)), [getDayDateStr, bookingDates])

  // Compute date availability: 'available' | 'partial' | 'full' | 'closed'
  const getDateAvailability = useCallback((dateStr: string): 'available' | 'partial' | 'full' | 'closed' => {
    if (dateStr < todayStr) return 'closed'
    if (isClosedDay(dateStr)) return 'closed'
    let totalSlots = 0
    let bookedSlots = 0
    for (const service of SERVICES) {
      const cap = getServiceCapacity(service.slug)
      for (const time of TIME_SLOTS) {
        totalSlots += cap
        bookedSlots += getSlotBookingCount(dateStr, time, service.slug)
      }
    }
    if (totalSlots === 0) return 'closed'
    const ratio = bookedSlots / totalSlots
    if (ratio >= 0.95) return 'full'
    if (ratio >= 0.5) return 'partial'
    return 'available'
  }, [todayStr, getSlotBookingCount])

  const prevMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
  const nextMonthFn = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))

  const handleDateClick = (day: number) => {
    const dateStr = getDayDateStr(day)
    if (dateStr < todayStr) return
    const closed = isClosedDay(dateStr)
    if (closed) { toast.error(closed); return }
    setSelectedDate(dateStr)
    setSelectedService(null)
    setSelectedTime(null)
  }

  const handleQuickBook = () => {
    if (!selectedDate || !selectedService || !selectedTime) return
    const capacity = getServiceCapacity(selectedService.slug)
    const booked = getSlotBookingCount(selectedDate, selectedTime, selectedService.slug)
    if (booked >= capacity) { toast.error('This slot is fully booked'); return }

    createBooking({
      service: selectedService.name,
      serviceSlug: selectedService.slug,
      serviceCategory: selectedService.category,
      resource: '',
      staff: '',
      date: selectedDate,
      time: selectedTime,
      endTime: '',
      duration: selectedService.duration,
      guests: 1,
      status: 'CONFIRMED',
      amount: selectedService.basePrice,
      paymentMethod: null,
      mpesaRef: null,
      image: selectedService.image,
      notes: null,
      canReschedule: true,
      canCancel: true,
      cancellationDeadline: selectedDate,
      rating: null,
      review: null,
      bookedFor: null,
      services: [selectedService.name],
      smsReminder: true,
    })

    toast.success(`${selectedService.name} booked for ${new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at ${selectedTime}`)
    setSelectedDate(null)
    setSelectedService(null)
    setSelectedTime(null)
  }

  return (
    <div className="space-y-8">
      {/* Section A — Hero Welcome Card */}
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy-light to-[#1A4A7A] p-8 lg:p-10 animate-gradient">
          {/* Decorative circles */}
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-[-60px] left-[-20px] w-[250px] h-[250px] rounded-full bg-teal/5 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-display text-3xl lg:text-4xl text-white">
                  <span className="font-light">{greeting}, </span>
                  <span className="font-bold">{CURRENT_USER.firstName}</span>
                </h1>
                <div className="mt-2 flex items-center gap-2">
                  <p className="font-sans text-white/60 text-sm">Welcome back to</p>
                  <Image
                    src="/ezralogo.jpeg"
                    alt="Ezra Center"
                    width={28}
                    height={28}
                    className="rounded-full object-cover inline-block"
                  />
                </div>
              </div>
              <Link
                href="/dashboard/bookings/new"
                className="bg-gold text-navy font-sans font-semibold text-sm rounded-full px-6 py-2.5 hover:bg-gold-light transition-all duration-300 shadow-md hover:shadow-gold flex items-center gap-2"
              >
                Book a Service
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats inside hero */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: 'Upcoming', value: upcomingBookings.length, icon: CalendarDays },
                { label: 'Points', value: CURRENT_USER.loyaltyPoints, icon: Star },
                { label: 'Visits', value: CURRENT_USER.totalVisits, icon: TrendingUp },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4"
                >
                  <stat.icon className="w-5 h-5 text-gold/80 mb-2" />
                  <p className="font-display text-2xl lg:text-3xl font-bold text-white">
                    <CountUp end={stat.value} duration={1.5} separator="," />
                  </p>
                  <p className="font-sans text-xs text-white/60 uppercase tracking-wide mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section B — Interactive Calendar & Quick Book */}
      <AnimatedSection delay={0.06}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl lg:text-2xl text-navy font-semibold">
              Your Calendar
            </h2>
            {selectedDate && (
              <button
                onClick={() => { setSelectedDate(null); setSelectedService(null); setSelectedTime(null) }}
                className="flex items-center gap-1.5 font-sans text-sm text-charcoal/50 hover:text-navy transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 rounded-full hover:bg-cream transition-colors">
                  <ChevronLeft className="w-5 h-5 text-navy" />
                </button>
                <h3 className="font-display text-lg text-navy font-semibold">
                  {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={nextMonthFn} className="p-2 rounded-full hover:bg-cream transition-colors">
                  <ChevronRight className="w-5 h-5 text-navy" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center font-sans text-[10px] text-charcoal/40 uppercase tracking-wider py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  if (day === null) return <div key={`e-${i}`} />
                  const dateStr = getDayDateStr(day)
                  const isSelected = dateStr === selectedDate
                  const isTodayDay = isToday(day)
                  const avail = getDateAvailability(dateStr)
                  const disabled = avail === 'closed'

                  return (
                    <button
                      key={dateStr}
                      disabled={disabled}
                      onClick={() => handleDateClick(day)}
                      className={cn(
                        'aspect-square flex flex-col items-center justify-center relative rounded-lg font-sans text-sm transition-all duration-200',
                        disabled ? 'text-charcoal/20 cursor-not-allowed' :
                        isSelected ? 'bg-gold text-navy-dark font-bold shadow-md' :
                        isTodayDay ? 'ring-2 ring-gold/50 text-gold font-bold hover:bg-gold/10' :
                        avail === 'full' ? 'bg-red-50 text-red-400 font-medium' :
                        avail === 'partial' ? 'bg-amber-50 text-amber-700 font-medium hover:bg-amber-100' :
                        'text-charcoal/70 hover:bg-emerald-50 cursor-pointer'
                      )}
                    >
                      {day}
                      {/* Availability dot */}
                      {!disabled && !isSelected && (
                        <span className={cn(
                          'absolute bottom-1 w-1.5 h-1.5 rounded-full',
                          avail === 'available' ? 'bg-emerald-400' :
                          avail === 'partial' ? 'bg-amber-400' :
                          'bg-red-400'
                        )} />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100 flex-wrap">
                <span className="flex items-center gap-1.5 font-sans text-[10px] text-charcoal/50">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Available
                </span>
                <span className="flex items-center gap-1.5 font-sans text-[10px] text-charcoal/50">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Filling up
                </span>
                <span className="flex items-center gap-1.5 font-sans text-[10px] text-charcoal/50">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> Fully booked
                </span>
                <span className="flex items-center gap-1.5 font-sans text-[10px] text-charcoal/50">
                  <span className="w-2 h-2 rounded-full bg-charcoal/15" /> Closed
                </span>
              </div>
            </div>

            {/* Right panel — Booking Flow */}
            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                {!selectedDate ? (
                  <motion.div
                    key="prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center py-12"
                  >
                    <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                      <CalendarDays className="w-7 h-7 text-gold" />
                    </div>
                    <p className="font-display text-lg text-navy font-semibold">Select a date</p>
                    <p className="font-sans text-sm text-charcoal/50 mt-1">Pick a day to start booking</p>
                  </motion.div>
                ) : !selectedService ? (
                  <motion.div
                    key="service-pick"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="font-sans text-xs uppercase tracking-widest text-charcoal/40 mb-1">
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p className="font-display text-lg text-navy font-semibold mb-4">Choose a service</p>
                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                      {SERVICES.map(service => (
                        <button
                          key={service.id}
                          onClick={() => { setSelectedService(service); setSelectedTime(null) }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-gold/40 hover:shadow-sm transition-all duration-200 text-left group"
                        >
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0">
                            <Image src={service.image} alt={service.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-sm font-medium text-navy group-hover:text-gold transition-colors truncate">
                              {service.name}
                            </p>
                            <p className="font-sans text-[10px] text-charcoal/50">{service.duration}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-charcoal/30 group-hover:text-gold transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="time-pick"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => { setSelectedService(null); setSelectedTime(null) }}
                      className="flex items-center gap-1 font-sans text-xs text-charcoal/50 hover:text-navy transition-colors mb-3"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back to services
                    </button>

                    <div className="flex items-center gap-3 mb-4 p-3 bg-cream/60 rounded-xl">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <Image src={selectedService.image} alt={selectedService.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-sans text-sm font-semibold text-navy">{selectedService.name}</p>
                        <p className="font-sans text-[10px] text-charcoal/50">
                          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} &middot; {selectedService.duration}
                        </p>
                      </div>
                    </div>

                    <p className="font-sans text-xs uppercase tracking-widest text-charcoal/40 mb-3">Pick a time</p>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map(time => {
                        const booked = getSlotBookingCount(selectedDate, time, selectedService.slug)
                        const capacity = getServiceCapacity(selectedService.slug)
                        const available = Math.max(0, capacity - booked)
                        const isFull = available === 0
                        const isFew = available === 1
                        const isSelected = time === selectedTime

                        return (
                          <button
                            key={time}
                            disabled={isFull}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              'relative px-3 py-2.5 rounded-lg font-sans text-sm font-medium transition-all duration-200 border',
                              isFull ? 'border-red-200 bg-red-50/60 text-red-400 cursor-not-allowed' :
                              isSelected ? 'border-gold bg-gold text-navy-dark shadow-sm' :
                              isFew ? 'border-amber-200 bg-amber-50/60 text-amber-700 hover:border-amber-400' :
                              'border-emerald-200 bg-emerald-50/40 text-emerald-800 hover:border-emerald-400'
                            )}
                          >
                            {time}
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center shadow">
                                <Check className="w-2.5 h-2.5 text-navy-dark" />
                              </span>
                            )}
                            {isFull ? (
                              <span className="block text-[9px] font-normal mt-0.5">Fully booked</span>
                            ) : isFew ? (
                              <span className="block text-[9px] font-normal mt-0.5">1 spot left</span>
                            ) : (
                              <span className={cn('block text-[9px] font-normal mt-0.5', isSelected ? 'text-navy-dark/60' : 'text-emerald-600')}>{available} spots open</span>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Confirm button */}
                    <AnimatePresence>
                      {selectedTime && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="mt-5"
                        >
                          <button
                            onClick={handleQuickBook}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gold text-navy-dark font-sans font-semibold text-sm rounded-xl hover:bg-gold-light transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            Confirm Booking
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section C — Next Appointment */}
      <AnimatedSection delay={0.08}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl lg:text-2xl text-navy font-semibold">
              Next Appointment
            </h2>
            <Link
              href="/dashboard/bookings"
              className="font-sans text-sm text-gold hover:text-gold-dark transition-colors flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {nextBooking ? (
            <>
              {/* Main booking card */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-[140px] h-[140px] rounded-2xl overflow-hidden shrink-0">
                  {nextBooking.image ? (
                    <Image
                      src={nextBooking.image}
                      alt={nextBooking.service}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                      <span className="text-gold text-2xl font-bold">{nextBooking.service.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-display text-xl font-semibold text-navy">
                        {nextBooking.service}
                        <span className="font-sans text-sm font-normal text-gray-400 ml-2">
                          {nextBooking.resource}
                        </span>
                      </p>
                      <p className="font-sans text-sm text-charcoal/70 mt-1">
                        {formatDate(nextBooking.date)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 font-sans text-sm text-charcoal/60">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {nextBooking.time} - {nextBooking.endTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {nextBooking.resource}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      with {nextBooking.staff}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5 font-sans text-sm font-medium">
                      <span className={cn('w-2 h-2 rounded-full', statusDot[nextBooking.status])} />
                      <span className={statusStyles[nextBooking.status]}>
                        {statusLabel[nextBooking.status]}
                      </span>
                    </span>
                    <span className="font-sans text-sm text-navy font-semibold">
                      {formatCurrency(nextBooking.amount)}
                    </span>
                    {nextBooking.paymentMethod && (
                      <span className="font-sans text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Paid
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setQrOpen(!qrOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-navy text-white font-sans text-sm font-medium rounded-lg hover:bg-navy-light transition-all duration-300"
                    >
                      <QrCode className="w-4 h-4" />
                      QR Check-in
                    </button>
                    {nextBooking.canReschedule && (
                      <button className="px-4 py-2 border border-charcoal/20 text-navy font-sans text-sm font-medium rounded-lg hover:border-gold hover:shadow-sm transition-all duration-300">
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Other upcoming (collapsible dropdown) */}
              {otherUpcoming.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                    className="w-full flex items-center justify-between mb-3 group"
                  >
                    <p className="font-sans text-xs uppercase tracking-widest text-gray-400">
                      Also upcoming
                      <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold/10 text-gold text-[10px] font-bold">
                        {otherUpcoming.length}
                      </span>
                    </p>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-gray-400 transition-transform duration-300',
                        showAllUpcoming && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* Always show first 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {otherUpcoming.slice(0, 3).map((booking) => (
                      <Link
                        key={booking.id}
                        href={`/dashboard/bookings/${booking.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all duration-300 group"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          {booking.image ? (
                            <Image src={booking.image} alt={booking.service} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                              <span className="text-gold text-xs font-bold">{booking.service.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-medium text-navy truncate">
                            {booking.service}
                          </p>
                          <p className="font-sans text-xs text-gray-400">
                            {formatDate(booking.date)} · {booking.time}
                          </p>
                        </div>
                        <span className="flex items-center gap-1">
                          <span className={cn('w-1.5 h-1.5 rounded-full', statusDot[booking.status])} />
                          <span className={cn('font-sans text-xs font-medium', statusStyles[booking.status])}>
                            {statusLabel[booking.status]}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Expandable rest */}
                  {otherUpcoming.length > 3 && (
                    <>
                      <div
                        className={cn(
                          'grid grid-cols-1 md:grid-cols-2 gap-3 overflow-hidden transition-all duration-500 ease-in-out',
                          showAllUpcoming ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0'
                        )}
                      >
                        {otherUpcoming.slice(3).map((booking) => (
                          <Link
                            key={booking.id}
                            href={`/dashboard/bookings/${booking.id}`}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all duration-300 group"
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                              {booking.image ? (
                                <Image src={booking.image} alt={booking.service} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                                  <span className="text-gold text-xs font-bold">{booking.service.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-sans text-sm font-medium text-navy truncate">
                                {booking.service}
                              </p>
                              <p className="font-sans text-xs text-gray-400">
                                {formatDate(booking.date)} · {booking.time}
                              </p>
                            </div>
                            <span className="flex items-center gap-1">
                              <span className={cn('w-1.5 h-1.5 rounded-full', statusDot[booking.status])} />
                              <span className={cn('font-sans text-xs font-medium', statusStyles[booking.status])}>
                                {statusLabel[booking.status]}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>

                      <button
                        onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cream/60 hover:bg-cream transition-colors duration-300 font-sans text-xs text-charcoal/60 hover:text-navy"
                      >
                        {showAllUpcoming ? 'Show less' : `Show all ${otherUpcoming.length} bookings`}
                        <ChevronDown
                          className={cn(
                            'w-3.5 h-3.5 transition-transform duration-300',
                            showAllUpcoming && 'rotate-180'
                          )}
                        />
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <CalendarDays className="w-8 h-8 text-gold" />
              </div>
              <p className="font-display text-xl text-navy font-semibold">No upcoming appointments</p>
              <p className="font-sans text-sm text-gray-400 mt-1">Your schedule is clear — time to treat yourself</p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 mt-6 bg-gold text-navy font-sans font-semibold text-sm rounded-full px-6 py-3 hover:bg-gold-light transition-all"
              >
                Book an Experience <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Section C — Loyalty Progress */}
      <AnimatedSection delay={0.16}>
        <div className="bg-gradient-to-r from-amber-50 via-gold/10 to-amber-50 border border-gold/30 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-2">
                Your Membership
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gold to-gold-dark text-white font-sans">
                <Crown className="w-3 h-3" />
                GOLD MEMBER
              </span>
            </div>
            <p className="font-display text-3xl font-bold text-navy">
              <CountUp end={CURRENT_USER.loyaltyPoints} duration={1.5} separator="," /> <span className="text-base font-normal text-gray-400">points</span>
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-sm text-charcoal/60">
                Progress to {CURRENT_USER.nextTier}
              </span>
              <span className="font-sans text-sm font-medium text-navy">
                {Math.round((CURRENT_USER.loyaltyPoints / 5000) * 100)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold"
                initial={{ width: 0 }}
                animate={{ width: `${(CURRENT_USER.loyaltyPoints / 5000) * 100}%` }}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className="mt-2 font-sans text-xs text-gray-400">
              {CURRENT_USER.loyaltyPoints.toLocaleString()} / 5,000 points needed
            </p>
          </div>

          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <Link
              href="/dashboard/membership"
              className="font-sans text-sm text-gold-dark font-medium hover:underline flex items-center gap-1"
            >
              Earn more points <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard/membership"
              className="font-sans text-sm text-gold-dark font-medium hover:underline flex items-center gap-1"
            >
              How to redeem <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Section D — Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedSection delay={0.24}>
          <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display text-lg text-navy font-semibold">Your Spending</h3>
              <Link href="/dashboard/payments" className="font-sans text-xs text-gold hover:text-gold-dark">
                View all
              </Link>
            </div>
            <p className="font-sans text-xs text-gray-400 mb-4">Last 6 months</p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={SPENDING_CHART_DATA}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'var(--font-dm-sans)' }}
                  formatter={(value) => [`KES ${Number(value).toLocaleString()}`, 'Spent']}
                />
                <Area type="monotone" dataKey="amount" stroke="#C9A84C" strokeWidth={2} fill="url(#goldGradient)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="font-sans text-xs text-gray-400">Total this year</p>
              <p className="font-display text-2xl font-bold text-navy">
                {formatCurrency(CURRENT_USER.totalSpent)}
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.32}>
          <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6">
            <h3 className="font-display text-lg text-navy font-semibold mb-1">Favourite Services</h3>
            <p className="font-sans text-xs text-gray-400 mb-4">By number of visits</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={SERVICE_HISTORY_CHART} layout="vertical" margin={{ left: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="service" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} width={80} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'var(--font-dm-sans)' }}
                  formatter={(value) => [`${value} visits`, 'Visits']}
                />
                <Bar dataKey="visits" fill="#0F2C4A" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimatedSection>
      </div>

      {/* Section E — Quick Book Strip */}
      <AnimatedSection delay={0.4}>
        <h3 className="font-display text-xl text-navy font-semibold mb-4">Quick Book</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          {SERVICES.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group shrink-0 w-[160px] rounded-2xl overflow-hidden relative h-[110px] border-2 border-transparent hover:border-gold transition-all duration-300 hover:scale-105"
            >
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-display text-sm font-semibold text-white">{service.name}</p>
                <p className="font-sans text-[10px] text-white/60">{formatServicePrice(service.basePrice)}</p>
              </div>
            </Link>
          ))}
        </div>
      </AnimatedSection>

      {/* Section F — Recent Activity */}
      <AnimatedSection delay={0.48}>
        <h3 className="font-display text-xl text-navy font-semibold mb-4">Recent Activity</h3>
        <div className="relative pl-6">
          {/* Gold timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-gold via-gold/40 to-transparent" />

          <div className="space-y-6">
            {pastBookings.slice(0, 3).map((booking, i) => (
              <AnimatedSection key={booking.id} delay={0.5 + i * 0.08}>
                <div className="relative flex items-start gap-4">
                  {/* Dot */}
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-gold" />

                  <div className="flex-1 bg-gradient-to-br from-white to-cream/40 rounded-xl shadow-card p-4 hover:shadow-card-hover transition-all duration-300">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-sans text-sm font-medium text-navy">{booking.service}</p>
                        <p className="font-sans text-xs text-gray-400 mt-0.5">
                          {formatDate(booking.date)} · {booking.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-sm font-semibold text-navy">
                          {formatCurrency(booking.amount)}
                        </span>
                        <span className={cn(
                          'font-sans text-xs font-medium rounded-full px-2.5 py-0.5',
                          booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                          booking.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                        )}>
                          {statusLabel[booking.status]}
                        </span>
                      </div>
                    </div>
                    {booking.status === 'COMPLETED' && (
                      <div className="mt-3 flex items-center justify-between">
                        {booking.rating && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className={cn(
                                  'w-3.5 h-3.5',
                                  j < booking.rating! ? 'text-gold fill-gold' : 'text-gray-200'
                                )}
                              />
                            ))}
                          </div>
                        )}
                        <Link
                          href={`/services/${booking.serviceSlug}`}
                          className="font-sans text-xs text-gold font-medium hover:text-gold-dark flex items-center gap-1"
                        >
                          Book Again <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
